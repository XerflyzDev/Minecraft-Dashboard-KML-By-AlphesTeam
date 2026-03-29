package com.alphesteam.dashboard;

import org.bukkit.plugin.java.JavaPlugin;

public final class MinecraftDashboardPlugin extends JavaPlugin {
    private SnapshotPublisher publisher;

    @Override
    public void onEnable() {
        saveDefaultConfig();

        this.publisher = new SnapshotPublisher(this);
        this.publisher.start();

        getLogger().info("MinecraftDashboardBridge enabled.");
    }

    @Override
    public void onDisable() {
        if (publisher != null) {
            publisher.stop();
        }

        getLogger().info("MinecraftDashboardBridge disabled.");
    }
}
