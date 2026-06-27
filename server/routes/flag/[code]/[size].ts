import { defineHandler } from "nitro";
import { defineCachedFunction } from "nitro/cache";

const fetchFlag = defineCachedFunction(
  async (code: string, size: string) => {
    const buffer = await (
      await fetch(
        `https://api.fifa.com/api/v3/picture/flags-sq-${size}/${code}`,
      )
    ).arrayBuffer();
    return Buffer.from(buffer).toString("base64");
  },
  {
    name: "flag",
    getKey: (code: string, size: string) => `${code}/${size}`,
    maxAge: 60 * 60 * 24,
    staleMaxAge: 60 * 60 * 24 * 7,
  },
);

export default defineHandler(async function (e): Promise<Response> {
  const base64 = await fetchFlag(
    e.context.params?.code || "",
    e.context.params?.size || "",
  );
  return new Response(Buffer.from(base64, "base64"), {
    headers: {
      "Content-Type": "image/png",
    },
  });
});
