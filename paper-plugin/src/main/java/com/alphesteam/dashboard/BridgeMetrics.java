package com.alphesteam.dashboard;

public record BridgeMetrics(
        int queueSize,
        String lastPushStatus,
        String lastPushAt,
        String lastError,
        int totalPushCount,
        int retryCount
) {
}
