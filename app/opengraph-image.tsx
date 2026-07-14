import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/siteConfig";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0E232B",
          color: "#F6FAFB",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 8,
              background: "#3EAECC",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              fontWeight: 700,
              color: "#0E232B",
            }}
          >
            N
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: 1 }}>
            {siteConfig.name.toUpperCase()}
          </div>
        </div>
        <div
          style={{
            marginTop: 48,
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: 900,
          }}
        >
          {siteConfig.tagline}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 26,
            color: "#3EAECC",
            fontFamily: "monospace",
          }}
        >
          Order on WhatsApp · Pay with M-Pesa
        </div>
      </div>
    ),
    { ...size }
  );
}
