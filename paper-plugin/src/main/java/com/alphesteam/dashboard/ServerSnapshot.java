package com.alphesteam.dashboard;

import java.util.List;

public record ServerSnapshot(
        String serverName,
        String updatedAt,
        int day,
        String time,
        String weather,
        double tps,
        int onlinePlayers,
        int maxPlayers,
        String difficulty,
        List<PlayerSnapshot> players
) {
}
