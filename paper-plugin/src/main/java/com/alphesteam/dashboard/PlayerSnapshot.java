package com.alphesteam.dashboard;

public record PlayerSnapshot(
        String uuid,
        String name,
        double health,
        int food,
        int ping,
        String biome,
        String world,
        PositionSnapshot position,
        String facing
) {
}
