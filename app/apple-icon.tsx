import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#20263F",
          borderRadius: 40
        }}
      >
        <svg
          width="124"
          height="124"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="21" cy="11" r="6" stroke="#A5D7E8" strokeWidth="1.4" opacity="0.9" />
          <circle cx="26" cy="19" r="4" stroke="#A5D7E8" strokeWidth="1.4" opacity="0.9" />
          <circle cx="16" cy="18" r="5" stroke="#A5D7E8" strokeWidth="1.4" opacity="0.9" />
          <circle cx="24" cy="6" r="3" stroke="#A5D7E8" strokeWidth="1.4" opacity="0.9" />
          <circle cx="12" cy="10" r="2.5" stroke="#A5D7E8" strokeWidth="1.4" opacity="0.9" />
        </svg>
      </div>
    ),
    {
      ...size
    }
  );
}
