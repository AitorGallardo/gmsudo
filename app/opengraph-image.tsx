import { ImageResponse } from "next/og";

export const alt = "Aitor Gallardo — full-stack & AI engineer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#0a0a0b",
        padding: "72px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 64,
          height: 64,
          borderRadius: 9999,
          background: "#111113",
          color: "#EDEDEF",
          fontSize: 22,
          fontWeight: 500,
          letterSpacing: -0.5,
        }}
      >
        ag
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            color: "#ffffff",
            fontSize: 72,
            fontWeight: 600,
            letterSpacing: -1.5,
            lineHeight: 1.1,
          }}
        >
          Aitor Gallardo
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            color: "#8b8b8f",
            fontSize: 32,
            fontWeight: 400,
          }}
        >
          @gmsudo · full-stack & AI engineer
        </div>
      </div>

      <div
        style={{
          display: "flex",
          color: "#8b8b8f",
          fontSize: 24,
          fontFamily: "monospace",
        }}
      >
        aitor@gmsudo:~
        <span style={{ color: "#22c55e", margin: "0 8px" }}>$</span>_
      </div>
    </div>,
    { ...size },
  );
}
