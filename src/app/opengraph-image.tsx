import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Trust Point IT Solutions — Managed IT Services";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Dynamically-rendered Open Graph image for the site. Edge-rendered so
 * every share on LinkedIn/Twitter/Slack gets a fresh, brand-correct preview.
 */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "radial-gradient(ellipse 120% 80% at 50% 0%, #2A1F8A 0%, #0B0A3B 50%, #07062B 100%)",
          color: "#FFFFFF",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top eyebrow */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#22D3EE",
            fontSize: "22px",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          <div
            style={{
              width: "48px",
              height: "1px",
              background: "rgba(34, 211, 238, 0.6)",
            }}
          />
          Managed IT Services
        </div>

        {/* Main heading */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "80px",
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: "900px",
            }}
          >
            Built to protect what your business depends on.
          </div>
          <div
            style={{
              fontSize: "26px",
              color: "rgba(255, 255, 255, 0.65)",
              maxWidth: "700px",
              lineHeight: 1.4,
            }}
          >
            A layered security and support stack — one fixed monthly price.
          </div>
        </div>

        {/* Footer: brand lockup + accent bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "28px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "28px",
              fontWeight: 600,
            }}
          >
            {/* Geometric mark echoing the logo */}
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <circle cx="12" cy="8" r="3" fill="#3B82F6" />
              <circle cx="32" cy="8" r="3" fill="#22D3EE" />
              <circle cx="12" cy="36" r="3" fill="#22D3EE" />
              <circle cx="32" cy="36" r="3" fill="#3B82F6" />
              <rect x="11" y="12" width="2" height="20" fill="#3B82F6" />
              <rect x="31" y="12" width="2" height="20" fill="#22D3EE" />
              <rect x="14" y="14" width="16" height="2" fill="#1E40AF" />
              <rect x="14" y="28" width="16" height="2" fill="#1E40AF" />
              <rect x="18" y="18" width="8" height="8" fill="#3B82F6" opacity="0.8" />
            </svg>
            Trust Point IT Solutions
          </div>
          <div
            style={{
              fontSize: "18px",
              color: "rgba(34, 211, 238, 0.8)",
              fontFamily: "monospace",
              letterSpacing: "0.15em",
            }}
          >
            TRUSTPOINTITSOLUTIONS.COM
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
