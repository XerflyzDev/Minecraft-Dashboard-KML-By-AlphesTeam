package com.alphesteam.dashboard;

import com.google.gson.Gson;
import org.bukkit.Bukkit;
import org.bukkit.scheduler.BukkitTask;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayDeque;
import java.util.Queue;

public final class SnapshotPublisher {
    private final MinecraftDashboardPlugin plugin;
    private final HttpClient httpClient;
    private final Gson gson;
    private final SnapshotFactory snapshotFactory;
    private final Queue<QueuedSnapshot> retryQueue;
    private final long retryIntervalTicks;
    private final int maxQueueSize;
    private BukkitTask intervalTask;
    private BukkitTask retryTask;
    private volatile boolean pushInFlight;
    private volatile String lastPushStatus = "never";
    private volatile String lastPushAt = null;
    private volatile String lastError = null;
    private volatile int totalPushCount;
    private volatile int retryCount;

    public SnapshotPublisher(MinecraftDashboardPlugin plugin) {
        this.plugin = plugin;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
        this.gson = new Gson();
        this.snapshotFactory = new SnapshotFactory(plugin);
        this.retryQueue = new ArrayDeque<>();
        this.retryIntervalTicks = Math.max(20L, plugin.getConfig().getLong("dashboard.retryIntervalTicks", 40L));
        this.maxQueueSize = Math.max(1, plugin.getConfig().getInt("dashboard.maxQueueSize", 8));
    }

    public void start() {
        if (!plugin.getConfig().getBoolean("dashboard.enabled", true)) {
            plugin.getLogger().info("Dashboard sync is disabled in config.yml.");
            return;
        }

        long intervalTicks = Math.max(20L, plugin.getConfig().getLong("dashboard.intervalTicks", 20L));
        this.intervalTask = Bukkit.getScheduler().runTaskTimerAsynchronously(
                plugin,
                () -> pushFreshSnapshot("interval"),
                20L,
                intervalTicks
        );
        this.retryTask = Bukkit.getScheduler().runTaskTimerAsynchronously(
                plugin,
                this::flushRetryQueue,
                retryIntervalTicks,
                retryIntervalTicks
        );
    }

    public void stop() {
        if (intervalTask != null) {
            intervalTask.cancel();
            intervalTask = null;
        }

        if (retryTask != null) {
            retryTask.cancel();
            retryTask = null;
        }

        synchronized (retryQueue) {
            retryQueue.clear();
        }
    }

    public void requestImmediatePush(String reason) {
        if (!plugin.getConfig().getBoolean("dashboard.enabled", true)) {
            return;
        }

        Bukkit.getScheduler().runTaskAsynchronously(plugin, () -> pushFreshSnapshot(reason));
    }

    private void pushFreshSnapshot(String reason) {
        pushSnapshotSafely(new QueuedSnapshot(snapshotFactory.createSnapshot(createBridgeMetrics()), reason, 0));
    }

    private void flushRetryQueue() {
        QueuedSnapshot queuedSnapshot;

        synchronized (retryQueue) {
            queuedSnapshot = retryQueue.poll();
        }

        if (queuedSnapshot == null) {
            return;
        }

        pushSnapshotSafely(queuedSnapshot);
    }

    private void pushSnapshotSafely(QueuedSnapshot queuedSnapshot) {
        if (pushInFlight) {
            enqueueForRetry(queuedSnapshot.nextAttempt("busy"));
            return;
        }

        pushInFlight = true;

        try {
            pushSnapshot(queuedSnapshot);
        } catch (Exception exception) {
            enqueueForRetry(queuedSnapshot.nextAttempt("exception"));
            plugin.getLogger().warning("Failed to push dashboard snapshot: " + exception.getMessage());
        } finally {
            pushInFlight = false;
        }
    }

    private void pushSnapshot(QueuedSnapshot queuedSnapshot) throws IOException, InterruptedException {
        String endpoint = plugin.getConfig().getString("dashboard.endpoint", "").trim();
        if (endpoint.isEmpty()) {
            plugin.getLogger().warning("dashboard.endpoint is empty. Skipping snapshot push.");
            return;
        }

        String token = plugin.getConfig().getString("dashboard.bearerToken", "");
        String json = gson.toJson(queuedSnapshot.snapshot());

        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                .uri(URI.create(endpoint))
                .timeout(Duration.ofSeconds(8))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json));

        if (!token.isBlank()) {
            requestBuilder.header("Authorization", "Bearer " + token);
        }

        HttpResponse<String> response = httpClient.send(requestBuilder.build(), HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() >= 300) {
            lastPushStatus = "http-" + response.statusCode();
            lastPushAt = nowIso();
            lastError = response.body();
            enqueueForRetry(queuedSnapshot.nextAttempt("http-" + response.statusCode()));
            plugin.getLogger().warning(
                    "Dashboard endpoint returned HTTP " + response.statusCode() + " for " + queuedSnapshot.reason()
            );
            return;
        }

        totalPushCount += 1;
        lastPushStatus = "success";
        lastPushAt = nowIso();
        lastError = null;

        if (queuedSnapshot.attempt() > 0) {
            plugin.getLogger().info("Retried snapshot delivery succeeded for " + queuedSnapshot.reason() + ".");
        }
    }

    private void enqueueForRetry(QueuedSnapshot queuedSnapshot) {
        synchronized (retryQueue) {
            while (retryQueue.size() >= maxQueueSize) {
                retryQueue.poll();
            }

            retryQueue.offer(queuedSnapshot);
            retryCount += 1;
        }
    }

    private BridgeMetrics createBridgeMetrics() {
        int queueSize;

        synchronized (retryQueue) {
            queueSize = retryQueue.size();
        }

        return new BridgeMetrics(
                queueSize,
                lastPushStatus,
                lastPushAt,
                lastError,
                totalPushCount,
                retryCount
        );
    }

    private String nowIso() {
        return OffsetDateTime.now(ZoneId.systemDefault()).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME);
    }
}
