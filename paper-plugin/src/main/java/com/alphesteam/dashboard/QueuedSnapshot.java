package com.alphesteam.dashboard;

public record QueuedSnapshot(
        ServerSnapshot snapshot,
        String reason,
        int attempt
) {
    public QueuedSnapshot nextAttempt(String suffix) {
        return new QueuedSnapshot(snapshot, reason + ":" + suffix, attempt + 1);
    }
}
