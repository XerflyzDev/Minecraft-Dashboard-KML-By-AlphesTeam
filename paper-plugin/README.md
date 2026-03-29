# Paper Plugin Skeleton

This folder contains a Paper plugin that collects live server data and pushes it to the Next.js dashboard.

## Build

```bash
mvn package
```

The shaded jar will be generated in:

`paper-plugin/target/minecraft-dashboard-bridge-0.1.0.jar`

## Configure

Edit `src/main/resources/config.yml` before packaging or change the generated plugin config after the first run.

```yaml
dashboard:
  enabled: true
  endpoint: "https://minecraft-dashboard-kml.vercel.app/api/minecraft/snapshot"
  bearerToken: "replace-with-your-minecraft-dashboard-token"
  serverName: "My Minecraft Server"
  intervalTicks: 20
  retryIntervalTicks: 40
  maxQueueSize: 8
```

For a ready-to-copy production template, use:

`paper-plugin/config.production.example.yml`

## Install On Paper

1. Build the jar with `mvn package`.
2. Copy `paper-plugin/target/minecraft-dashboard-bridge-0.1.0.jar` into your Paper server `plugins` folder.
3. Start the server once so Paper creates the plugin data folder.
4. Open the generated plugin config and confirm:
   - `dashboard.endpoint` points to `https://minecraft-dashboard-kml.vercel.app/api/minecraft/snapshot`
   - `dashboard.bearerToken` matches `MINECRAFT_DASHBOARD_TOKEN` on the website
   - `dashboard.serverName` is your real server name
5. Restart the server.

## Expected Result

After the plugin starts successfully, the website should begin showing real data such as:

- in-game day and time
- weather
- online player count
- player positions
- world and biome
- bridge delivery metrics on `/status`

## Runtime notes

- Use this with Paper for the best access to TPS and player ping.
- The HTTP push runs async so it does not block the main server thread.
- The dashboard accepts a bearer token through `MINECRAFT_DASHBOARD_TOKEN`.
- Periodic snapshots still run, and important events also trigger immediate pushes.
- Failed deliveries are retried from a small in-memory queue.
