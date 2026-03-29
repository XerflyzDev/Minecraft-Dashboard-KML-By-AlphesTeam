package com.alphesteam.dashboard;

import org.bukkit.Location;
import org.bukkit.entity.Player;

public record PlayerSnapshotKey(
        String world,
        String biome,
        int x,
        int y,
        int z
) {
    public static PlayerSnapshotKey from(Player player) {
        Location location = player.getLocation();
        return new PlayerSnapshotKey(
                location.getWorld() == null ? "unknown" : location.getWorld().getName(),
                location.getBlock().getBiome().getKey().getKey(),
                location.getBlockX(),
                location.getBlockY(),
                location.getBlockZ()
        );
    }
}
