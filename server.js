import { serve } from "https://deno.land/std@0.138.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.138.0/http/file_server.ts";

let previousWord = "しりとり";

console.log("Listening on http://localhost:8000");

let counter = 0;

serve(async (req) => {
  const pathname = new URL(req.url).pathname;
  if (req.method === "GET" && pathname === "/shiritori") {
    return new Response(previousWord);
  }

  if (req.method === "POST" && pathname === "/shiritori") {
    const requestJson = await req.json();
    const nextWord = requestJson.nextWord;

    if (
      nextWord.length > 0 &&
      previousWord.charAt(previousWord.length - 1) !== nextWord.charAt(0)
    ) {
      return new Response("前の単語に続いていません。", { status: 400 });
    }
    if (
      nextWord.length > 0 &&
      nextWord.charAt(nextWord.length-1) === "ん"
    ) {
      return new Response("GAME OVER", { status: 400 });
    }
    
    previousWord = nextWord;
    counter = counter + 1;
    console.log(counter+"回");
    return new Response(previousWord);
  }

  return serveDir(req, {
    fsRoot: "C:/Users/yossy/public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});