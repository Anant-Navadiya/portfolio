import { ImageResponse } from "next/og";

import { brandColors } from "@/lib/brand";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

const Icon = () => new ImageResponse(
    (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: brandColors.primaryLight, borderRadius: 7, color: brandColors.backgroundLight, fontSize: 20, fontWeight: 700 }}>
            A
        </div>
    ),
    { ...size },
);

export default Icon;
