import { getSnapshot } from "@/lib/minecraft-store";
import { subscribeToSnapshots } from "@/lib/minecraft-live";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const send = (event: string, data: string) => {
        controller.enqueue(encoder.encode(`event: ${event}\n`));
        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      };

      send("snapshot", JSON.stringify(getSnapshot()));

      const unsubscribe = subscribeToSnapshots((snapshot) => {
        send("snapshot", JSON.stringify(snapshot));
      });

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": keepalive\n\n"));
      }, 15000);

      const close = () => {
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // Ignore duplicate close attempts during connection teardown.
        }
      };

      controller.enqueue(encoder.encode("retry: 2000\n\n"));
      request.signal.addEventListener("abort", close, { once: true });
    },
    cancel() {
      // Cleanup is handled in the start callback return function.
    },
  });

  return new Response(stream, {
    headers: {
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  });
}
