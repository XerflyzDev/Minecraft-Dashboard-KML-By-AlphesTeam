export function isDiscordAuthConfigured() {
  return Boolean(
    process.env.AUTH_SECRET &&
      process.env.DISCORD_CLIENT_ID &&
      process.env.DISCORD_CLIENT_SECRET,
  );
}
