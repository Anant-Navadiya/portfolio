import { brandColors } from "@/lib/brand";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

export const OgCard = ({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) => (
    <div
        style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "72px",
            position: "relative",
            backgroundColor: brandColors.backgroundLight,
            backgroundImage: "linear-gradient(145deg, #ffffff 0%, #eef1f6 100%)",
            fontFamily: "sans-serif",
        }}
    >
        <div style={{ position: "absolute", right: -80, bottom: -140, width: 420, height: 420, borderRadius: "50%", border: `2px solid ${brandColors.primaryLight}26`, display: "flex" }} />
        <div style={{ position: "absolute", right: 40, bottom: -20, width: 260, height: 260, borderRadius: "50%", border: `2px solid ${brandColors.primaryLight}40`, display: "flex" }} />
        <div style={{ position: "absolute", top: 72, left: 72, fontSize: 22, letterSpacing: 4, textTransform: "uppercase", color: brandColors.primaryLight, fontWeight: 700, display: "flex" }}>{eyebrow}</div>
        <div style={{ display: "flex", maxWidth: 920, fontSize: 68, fontWeight: 700, lineHeight: 1.15, color: brandColors.foregroundLight, letterSpacing: -1 }}>{title}</div>
        <div style={{ display: "flex", marginTop: 28, fontSize: 26, color: "#5b6472" }}>{footer}</div>
    </div>
);
