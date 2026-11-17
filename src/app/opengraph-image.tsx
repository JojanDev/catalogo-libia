import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Tonorosa by Leyar, ropa infantil con ternura y estilo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const svg = await readFile(join(process.cwd(), "public", "logo-tonorosa.svg"));
  const logo = `data:image/svg+xml;base64,${svg.toString("base64")}`;
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#fff9f8",
          border: "16px solid #fce8ec",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} width={372} height={348} alt="" />
        <div style={{ fontSize: 44, color: "#5a4636", marginTop: 32 }}>Ropa infantil con ternura y estilo</div>
      </div>
    ),
    size,
  );
}
