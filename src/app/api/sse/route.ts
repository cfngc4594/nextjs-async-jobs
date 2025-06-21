import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const headers = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    // "X-Accel-Buffering": "no",
  };

  const stream = new ReadableStream({
    start(controller) {
      const intervalId = setInterval(() => {
        const data = `Current time: ${new Date().toLocaleTimeString()}`;
        const message = `data: ${data}\n\n`;
        controller.enqueue(new TextEncoder().encode(message));
      }, 1000);

      request.signal.addEventListener("abort", () => {
        clearInterval(intervalId);
        controller.close();
      });
    },
  });

  return new NextResponse(stream, { headers });
}
