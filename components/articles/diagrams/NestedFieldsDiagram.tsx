const bandTextStyle = { fontFamily: "var(--font-mono)" } as const;

const NestedFieldsDiagram = () => (
    <svg viewBox="0 0 600 380" role="img" aria-hidden="true" className="h-auto w-full">
        <rect x="8" y="8" width="584" height="364" rx="28" fill="none" stroke="var(--border)" strokeWidth="1.5" />
        <rect x="70" y="64" width="460" height="252" rx="22" fill="none" stroke="var(--border)" strokeWidth="1.5" />
        <rect x="140" y="120" width="320" height="140" rx="18" fill="none" stroke="var(--border)" strokeWidth="1.5" />
        <rect x="220" y="180" width="160" height="56" rx="14" fill="color-mix(in oklch, var(--primary) 12%, transparent)" stroke="var(--primary)" strokeWidth="1.5" />

        <text x="30" y="34" fontSize="13" letterSpacing="0.06em" fill="var(--foreground)" fontWeight="600" style={bandTextStyle}>ARTIFICIAL INTELLIGENCE</text>
        <text x="30" y="52" fontSize="11" fill="var(--muted-foreground)" style={bandTextStyle}>the broad goal: software that decides</text>

        <text x="92" y="90" fontSize="12.5" letterSpacing="0.05em" fill="var(--foreground)" fontWeight="600" style={bandTextStyle}>MACHINE LEARNING</text>
        <text x="92" y="108" fontSize="11" fill="var(--muted-foreground)" style={bandTextStyle}>learns patterns from examples</text>

        <text x="162" y="146" fontSize="12" letterSpacing="0.05em" fill="var(--foreground)" fontWeight="600" style={bandTextStyle}>DEEP LEARNING</text>
        <text x="162" y="164" fontSize="11" fill="var(--muted-foreground)" style={bandTextStyle}>layered neural networks</text>

        <text x="300" y="204" fontSize="14" fontWeight="700" fill="var(--primary)" textAnchor="middle" style={bandTextStyle}>LLMs</text>
        <text x="300" y="222" fontSize="10.5" fill="var(--muted-foreground)" textAnchor="middle" style={bandTextStyle}>e.g. GPT, Claude, Gemini</text>
    </svg>
);

export default NestedFieldsDiagram;
