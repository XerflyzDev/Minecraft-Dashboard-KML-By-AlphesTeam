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
  endpoint: "http://localhost:3000/api/minecraft/snapshot"
  bearerToken: "change-me"
  serverName: "My Minecraft Server"
  intervalTicks: 20
  retryIntervalTicks: 40
  maxQueueSize: 8
```

## Runtime notes

- Use this with Paper for the best access to TPS and player ping.
- The HTTP push runs async so it does not block the main server thread.
- The dashboard accepts a bearer token through `MINECRAFT_DASHBOARD_TOKEN`.
- Periodic snapshots still run, and important events also trigger immediate pushes.
- Failed deliveries are retried from a small in-memory queue.
