import { MinecraftDashboard } from "@/components/minecraft-dashboard";
import { getDashboardState } from "@/lib/minecraft-store";

export default function Home() {
  const state = getDashboardState();

  return (
    <MinecraftDashboard
      initialSnapshot={state.snapshot}
      initialHasReceivedSnapshot={state.hasReceivedSnapshot}
    />
  );
}
