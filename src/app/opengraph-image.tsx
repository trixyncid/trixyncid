import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Trixync — Built in Sync";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

function buildDotGrid() {
  const width = 1200;
  const height = 630;
  const gap = 46;
  const radius = 2;
  let dots = "";
  for (let y = gap; y < height; y += gap) {
    for (let x = gap; x < width; x += gap) {
      dots += `<circle cx="${x}" cy="${y}" r="${radius}" fill="#3866F2" fill-opacity="0.16"/>`;
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${dots}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

export default async function Image() {
  const logo = await readFile(
    join(process.cwd(), "public/brand/logo-full-white.svg"),
    "base64",
  );
  const logoSrc = `data:image/svg+xml;base64,${logo}`;
  const dotGridSrc = buildDotGrid();

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#101726",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dotGridSrc}
          width={1200}
          height={630}
          alt=""
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage:
              "radial-gradient(circle at 50% 22%, rgba(56,102,242,0.34) 0%, rgba(56,102,242,0) 55%)",
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoSrc} width={440} height={252} alt="Trixync" />

          <div
            style={{
              fontSize: 46,
              fontWeight: 600,
              color: "#c5ccda",
              marginTop: 36,
            }}
          >
            Built in Sync
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 28,
              color: "#8b93a7",
              marginTop: 14,
            }}
          >
            Software House · Web, Mobile, ERP & IoT · Medan
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 40,
              padding: "20px 44px",
              borderRadius: 999,
              background: "#3866F2",
              color: "#FCFDFF",
              fontSize: 30,
              fontWeight: 600,
            }}
          >
            Talk to us
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
