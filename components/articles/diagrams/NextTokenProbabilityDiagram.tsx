const labelStyle = { fontFamily: "var(--font-mono)" } as const;
const textStyle = { fontFamily: "var(--font-sans)" } as const;

const trackX = 148;
const trackWidth = 400;
const barHeight = 22;
const rowStep = 34;
const startY = 46;

const rightRoundedBar = (x: number, y: number, w: number, h: number, r: number) => {
    const clampedR = Math.min(r, w, h / 2);
    return `M${x},${y} H${x + w - clampedR} Q${x + w},${y} ${x + w},${y + clampedR} V${y + h - clampedR} Q${x + w},${y + h} ${x + w - clampedR},${y + h} H${x} Z`;
};

const rows: { label: string; value: number }[] = [
    { label: "mat", value: 61 },
    { label: "roof", value: 14 },
    { label: "floor", value: 9 },
    { label: "chair", value: 6 },
    { label: "everything else", value: 10 },
];

const NextTokenProbabilityDiagram = () => (
    <svg viewBox="0 0 600 226" role="img" aria-hidden="true" className="h-auto w-full">
        <text x={0} y={20} fontSize="10.5" letterSpacing="0.06em" fill="var(--muted-foreground)" style={labelStyle}>GIVEN: &ldquo;THE CAT SAT ON THE ___&rdquo;</text>

        {rows.map((row, index) => {
            const y = startY + index * rowStep;
            const width = (row.value / 100) * trackWidth;
            return (
                <g key={row.label}>
                    <text x={trackX - 12} y={y + barHeight / 2 + 4} fontSize="12.5" textAnchor="end" fill="var(--foreground)" style={textStyle}>{row.label}</text>
                    <path d={rightRoundedBar(trackX, y, width, barHeight, 4)} fill={index === 0 ? "var(--primary)" : "color-mix(in oklch, var(--primary) 55%, transparent)"} />
                    <text x={trackX + width + 10} y={y + barHeight / 2 + 4} fontSize="11.5" fill="var(--muted-foreground)" style={textStyle}>{row.value}%</text>
                </g>
            );
        })}
    </svg>
);

export default NextTokenProbabilityDiagram;
