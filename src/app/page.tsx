import { MinecraftDashboard } from "@/components/minecraft-dashboard";
import { mockSnapshot } from "@/lib/minecraft-mock";

export default function Home() {
  return <MinecraftDashboard initialSnapshot={mockSnapshot} />;
}
