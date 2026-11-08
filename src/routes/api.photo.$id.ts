import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/photo/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { kvGet } = await import("@/server/store");
        const { photoKey } = await import("@/server/site");
        const raw = await kvGet(photoKey(params.id));
        const match = raw?.match(/^data:(image\/(?:webp|jpeg|png));base64,(.+)$/);
        if (!match) return new Response("Not found", { status: 404 });
        const bytes = Uint8Array.from(atob(match[2]!), (c) => c.charCodeAt(0));
        return new Response(bytes, {
          headers: {
            "Content-Type": match[1]!,
            // A URL leva ?v=<timestamp>, então pode ficar em cache pra sempre.
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      },
    },
  },
});
