package com.alphesteam.dashboard;

import org.bukkit.entity.Player;
import org.bukkit.event.EventHandler;
import org.bukkit.event.EventPriority;
import org.bukkit.event.Listener;
import org.bukkit.event.player.PlayerChangedWorldEvent;
import org.bukkit.event.player.PlayerJoinEvent;
import org.bukkit.event.player.PlayerMoveEvent;
import org.bukkit.event.player.PlayerQuitEvent;
import org.bukkit.event.weather.ThunderChangeEvent;
import org.bukkit.event.weather.WeatherChangeEvent;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public final class SnapshotEventListener implements Listener {
    private final SnapshotPublisher publisher;
    private final Map<UUID, PlayerSnapshotKey> lastPlayerKeys;

    public SnapshotEventListener(SnapshotPublisher publisher) {
        this.publisher = publisher;
        this.lastPlayerKeys = new HashMap<>();
    }

    @EventHandler(priority = EventPriority.MONITOR)
    public void onPlayerJoin(PlayerJoinEvent event) {
        cachePlayer(event.getPlayer());
        publisher.requestImmediatePush("player-join");
    }

    @EventHandler(priority = EventPriority.MONITOR)
    public void onPlayerQuit(PlayerQuitEvent event) {
        lastPlayerKeys.remove(event.getPlayer().getUniqueId());
        publisher.requestImmediatePush("player-quit");
    }

    @EventHandler(priority = EventPriority.MONITOR)
    public void onPlayerChangedWorld(PlayerChangedWorldEvent event) {
        cachePlayer(event.getPlayer());
        publisher.requestImmediatePush("world-change");
    }

    @EventHandler(priority = EventPriority.MONITOR, ignoreCancelled = true)
    public void onPlayerMove(PlayerMoveEvent event) {
        if (event.getTo() == null) {
            return;
        }

        Player player = event.getPlayer();
        PlayerSnapshotKey nextKey = PlayerSnapshotKey.from(player);
        PlayerSnapshotKey previousKey = lastPlayerKeys.put(player.getUniqueId(), nextKey);

        if (previousKey == null || !previousKey.equals(nextKey)) {
            publisher.requestImmediatePush("player-state-change");
        }
    }

    @EventHandler(priority = EventPriority.MONITOR)
    public void onWeatherChange(WeatherChangeEvent event) {
        publisher.requestImmediatePush("weather-change");
    }

    @EventHandler(priority = EventPriority.MONITOR)
    public void onThunderChange(ThunderChangeEvent event) {
        publisher.requestImmediatePush("thunder-change");
    }

    private void cachePlayer(Player player) {
        lastPlayerKeys.put(player.getUniqueId(), PlayerSnapshotKey.from(player));
    }
}
