import next from "next";
import { parse } from "url";
import { createServer } from "http";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url || "", true);

    // Handle SSE endpoint inline
    if (parsedUrl.pathname === "/api/sse") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
      });

      const intervalId = setInterval(() => {
        res.write(
          `data: ${JSON.stringify({
            message: "Hello from server",
          })}\n\n`
        );
      }, 3000);

      req.on("close", () => {
        clearInterval(intervalId);
      });
    } else {
      // Handle regular Next.js requests
      handle(req, res, parsedUrl);
    }
  }).listen(3000, (error?: Error) => {
    if (error) throw error;
    console.log("Ready on http://localhost:3000");
  });

  // Clean up on server shutdown
  process.on("SIGTERM", () => {
    process.exit(0);
  });
});
