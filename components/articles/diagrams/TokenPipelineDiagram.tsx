const labelStyle = { fontFamily: "var(--font-mono)" } as const;
const textStyle = { fontFamily: "var(--font-sans)" } as const;

type NodeProps = {
    x: number;
    label: string;
    title: string;
    example: string[];
};

const boxY = 44;
const boxHeight = 96;
const boxWidth = 120;

const PipelineNode = ({ x, label, title, example }: NodeProps) => (
    <g>
        <text x={x + boxWidth / 2} y={boxY - 10} fontSize="10" letterSpacing="0.06em" textAnchor="middle" fill="var(--muted-foreground)" style={labelStyle}>{label}</text>
        <rect x={x} y={boxY} width={boxWidth} height={boxHeight} rx={10} fill="var(--card)" stroke="var(--border)" strokeWidth="1.5" />
        <text x={x + boxWidth / 2} y={boxY + 32} fontSize="12.5" fontWeight="600" textAnchor="middle" fill="var(--foreground)" style={textStyle}>{title}</text>
        {example.map((line, index) => (
            <text key={line} x={x + boxWidth / 2} y={boxY + 54 + index * 16} fontSize="9.5" textAnchor="middle" fill="var(--muted-foreground)" style={textStyle}>{line}</text>
        ))}
    </g>
);

const nodes: NodeProps[] = [
    { x: 10, label: "TEXT SO FAR", title: "Your text", example: ["“The cat sat", "on the ___”"] },
    { x: 150, label: "TOKENIZE", title: "Tokens", example: ["the · cat · sat", "on · the"] },
    { x: 290, label: "EMBED", title: "Numbers", example: ["token → vector"] },
    { x: 430, label: "ATTENTION", title: "Transformer", example: ["weighs context"] },
    { x: 570, label: "PREDICT", title: "Probabilities", example: ["mat 61%", "roof 12%"] },
];

const TokenPipelineDiagram = () => (
    <svg viewBox="0 0 700 300" role="img" aria-hidden="true" className="h-auto w-full">
        <defs>
            <marker id="tpd-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)" />
            </marker>
        </defs>

        {nodes.map((node) => <PipelineNode key={node.title} {...node} />)}

        {[10, 150, 290, 430].map((x) => (
            <line key={x} x1={x + boxWidth} y1={boxY + boxHeight / 2} x2={x + 150} y2={boxY + boxHeight / 2} stroke="var(--muted-foreground)" strokeWidth="1.5" markerEnd="url(#tpd-arrow)" />
        ))}

        <line x1={630} y1={boxY + boxHeight} x2={630} y2={180} stroke="var(--primary)" strokeWidth="1.5" markerEnd="url(#tpd-arrow)" />
        <rect x={550} y={180} width={160} height={56} rx={10} fill="color-mix(in oklch, var(--primary) 12%, transparent)" stroke="var(--primary)" strokeWidth="1.5" />
        <text x={630} y={204} fontSize="12" fontWeight="600" textAnchor="middle" fill="var(--foreground)" style={textStyle}>Sample one token</text>
        <text x={630} y={222} fontSize="10.5" textAnchor="middle" fill="var(--primary)" style={textStyle}>chosen: &ldquo;mat&rdquo;</text>

        <path d="M630,236 L630,266 L70,266 L70,140" fill="none" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="4 3" markerEnd="url(#tpd-arrow)" />
        <text x={350} y={283} fontSize="10.5" textAnchor="middle" fill="var(--primary)" style={labelStyle}>APPEND THE NEW TOKEN, THEN REPEAT</text>
    </svg>
);

export default TokenPipelineDiagram;
