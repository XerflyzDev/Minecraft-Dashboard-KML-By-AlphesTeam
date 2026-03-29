package com.alphesteam.dashboard;

import org.bukkit.Bukkit;
import org.bukkit.Difficulty;
import org.bukkit.Location;
import org.bukkit.World;
import org.bukkit.entity.Player;

import java.lang.reflect.Method;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.Comparator;
import java.util.List;

public final class SnapshotFactory {
    private final MinecraftDashboardPlugin plugin;

    public SnapshotFactory(MinecraftDashboardPlugin plugin) {
        this.plugin = plugin;
    }

    public ServerSnapshot createSnapshot(BridgeMetrics bridgeMetrics) {
        World primaryWorld = Bukkit.getWorlds().stream()
                .filter(world -> world.getEnvironment() == World.Environment.NORMAL)
                .findFirst()
                .orElseGet(() -> Bukkit.getWorlds().getFirst());

        List<PlayerSnapshot> players = Bukkit.getOnlinePlayers().stream()
                .map(this::createPlayerSnapshot)
                .sorted(Comparator.comparing(PlayerSnapshot::name, String.CASE_INSENSITIVE_ORDER))
                .toList();

        return new ServerSnapshot(
                plugin.getConfig().getString("dashboard.serverName", Bukkit.getServer().getName()),
                OffsetDateTime.now(ZoneId.systemDefault()).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),
                resolveDay(primaryWorld),
                formatWorldTime(primaryWorld.getTime()),
                resolveWeather(primaryWorld),
                resolveTps(),
                players.size(),
                Bukkit.getMaxPlayers(),
                resolveDifficulty(primaryWorld.getDifficulty()),
                players,
                bridgeMetrics
        );
    }

    private PlayerSnapshot createPlayerSnapshot(Player player) {
        Location location = player.getLocation();

        return new PlayerSnapshot(
                player.getUniqueId().toString(),
                player.getName(),
                player.getHealth(),
                player.getFoodLevel(),
                resolvePing(player),
                location.getBlock().getBiome().getKey().getKey(),
                resolveWorld(location.getWorld()),
                new PositionSnapshot(location.getBlockX(), location.getBlockY(), location.getBlockZ()),
                resolveFacing(location)
        );
    }

    private int resolveDay(World world) {
        return (int) (world.getFullTime() / 24000L);
    }

    private String formatWorldTime(long worldTime) {
        long adjusted = (worldTime + 6000L) % 24000L;
        int hours = (int) (adjusted / 1000L) % 24;
        int minutes = (int) Math.round(((adjusted % 1000L) / 1000.0) * 60.0);

        if (minutes == 60) {
            hours = (hours + 1) % 24;
            minutes = 0;
        }

        return "%02d:%02d".formatted(hours, minutes);
    }

    private String resolveWeather(World world) {
        if (world.isThundering()) {
            return "thunder";
        }

        if (world.hasStorm()) {
            return "rain";
        }

        return "clear";
    }

    private double resolveTps() {
        try {
            Method method = Bukkit.getServer().getClass().getMethod("getTPS");
            Object value = method.invoke(Bukkit.getServer());
            if (value instanceof double[] samples && samples.length > 0) {
                return Math.round(samples[0] * 10.0) / 10.0;
            }
        } catch (ReflectiveOperationException ignored) {
            // Fallback below.
        }

        return 20.0;
    }

    private String resolveDifficulty(Difficulty difficulty) {
        return difficulty.name().toLowerCase();
    }

    private int resolvePing(Player player) {
        try {
            Method method = player.getClass().getMethod("getPing");
            Object value = method.invoke(player);
            if (value instanceof Number number) {
                return number.intValue();
            }
        } catch (ReflectiveOperationException ignored) {
            // Fallback below.
        }

        return -1;
    }

    private String resolveWorld(World world) {
        return switch (world.getEnvironment()) {
            case NORMAL -> "overworld";
            case NETHER -> "nether";
            case THE_END -> "end";
            default -> "overworld";
        };
    }

    private String resolveFacing(Location location) {
        float yaw = location.getYaw();
        float normalized = (yaw % 360 + 360) % 360;

        if (normalized >= 45 && normalized < 135) {
            return "west";
        }
        if (normalized >= 135 && normalized < 225) {
            return "north";
        }
        if (normalized >= 225 && normalized < 315) {
            return "east";
        }
        return "south";
    }
}
