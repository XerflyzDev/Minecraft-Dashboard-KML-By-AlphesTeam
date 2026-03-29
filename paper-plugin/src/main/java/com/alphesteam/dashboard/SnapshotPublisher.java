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

public final class SnapshotPublisher {
    private final MinecraftDashboardPlugin plugin;
    private final HttpClient httpClient;
    private final Gson gson;
    private final SnapshotFactory snapshotFactory;
    private BukkitTask task;

    public SnapshotPublisher(MinecraftDashboardPlugin plugin) {
        this.plugin = plugin;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .build();
        this.gson = new Gson();
        this.snapshotFactory = new SnapshotFactory(plugin);
    }

    public void start() {
        if (!plugin.getConfig().getBoolean("dashboard.enabled", true)) {
            plugin.getLogger().info("Dashboard sync is disabled in config.yml.");
            return;
        }

        long intervalTicks = Math.max(20L, plugin.getConfig().getLong("dashboard.intervalTicks", 20L));
        this.task = Bukkit.getScheduler().runTaskTimerAsynchronously(
                plugin,
                this::pushSnapshotSafely,
                20L,
                intervalTicks
        );
    }

    public void stop() {
        if (task != null) {
            task.cancel();
            task = null;
        }
    }

    private void pushSnapshotSafely() {
        try {
            pushSnapshot();
        } catch (Exception exception) {
            plugin.getLogger().warning("Failed to push dashboard snapshot: " + exception.getMessage());
        }
    }

    private void pushSnapshot() throws IOException, InterruptedException {
        String endpoint = plugin.getConfig().getString("dashboard.endpoint", "").trim();
        if (endpoint.isEmpty()) {
            plugin.getLogger().warning("dashboard.endpoint is empty. Skipping snapshot push.");
            return;
        }

        String token = plugin.getConfig().getString("dashboard.bearerToken", "");
        String json = gson.toJson(snapshotFactory.createSnapshot());

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
            plugin.getLogger().warning(
                    "Dashboard endpoint returned HTTP " + response.statusCode() + ": " + response.body()
            );
        }
    }
}
