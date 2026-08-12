import { ImageResponse } from "next/og";

import { brandColors } from "@/lib/brand";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const AppleIcon = () => new ImageResponse(
    (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: brandColors.primaryLight, color: brandColors.backgroundLight, fontSize: 96, fontWeight: 700 }}>
            A
        </div>
    ),
    { ...size },
);

export default AppleIcon;
