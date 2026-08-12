const textStyle = { fontFamily: "var(--font-sans)" } as const;
const labelStyle = { fontFamily: "var(--font-mono)" } as const;

type StepBoxProps = {
    x: number;
    y: number;
    lines: string[];
    accent?: boolean;
};

const StepBox = ({ x, y, lines, accent }: StepBoxProps) => (
    <g>
        <rect x={x} y={y} width={260} height={64} rx={10} fill="var(--card)" stroke={accent ? "var(--primary)" : "var(--border)"} strokeWidth="1.5" />
        {lines.map((line, index) => (
            <text key={line} x={x + 130} y={y + 28 + index * 17} fontSize="12.5" textAnchor="middle" fill="var(--foreground)" style={textStyle}>{line}</text>
        ))}
    </g>
);

const Arrow = ({ x, y1, y2 }: { x: number; y1: number; y2: number }) => (
    <line x1={x} y1={y1} x2={x} y2={y2} stroke="var(--muted-foreground)" strokeWidth="1.5" markerEnd="url(#rblv-arrow)" />
);

const RuleBasedVsLearnedDiagram = () => (
    <svg viewBox="0 0 600 320" role="img" aria-hidden="true" className="h-auto w-full">
        <defs>
            <marker id="rblv-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)" />
            </marker>
        </defs>

        <text x="150" y="20" fontSize="11.5" letterSpacing="0.08em" textAnchor="middle" fill="var(--muted-foreground)" style={labelStyle}>RULE-BASED</text>
        <text x="450" y="20" fontSize="11.5" letterSpacing="0.08em" textAnchor="middle" fill="var(--primary)" style={labelStyle}>LEARNED (MACHINE LEARNING)</text>

        <StepBox x={20} y={32} lines={["A person writes", "exact rules by hand"]} />
        <Arrow x={150} y1={96} y2={126} />
        <StepBox x={20} y={126} lines={["Computer follows", "those rules exactly"]} />
        <Arrow x={150} y1={190} y2={220} />
        <StepBox x={20} y={220} lines={["Same input always gives", "the same output"]} />

        <StepBox x={320} y={32} lines={["Computer is shown many", "labeled examples"]} accent />
        <Arrow x={450} y1={96} y2={126} />
        <StepBox x={320} y={126} lines={["It works out its own", "patterns from the data"]} accent />
        <Arrow x={450} y1={190} y2={220} />
        <StepBox x={320} y={220} lines={["Makes a best guess on", "input it has never seen"]} accent />
    </svg>
);

export default RuleBasedVsLearnedDiagram;
