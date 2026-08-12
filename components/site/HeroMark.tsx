const points = [
    { x: 20, y: 24 },
    { x: 108, y: 12 },
    { x: 196, y: 30 },
    { x: 284, y: 16 },
    { x: 372, y: 26 },
    { x: 460, y: 10 },
    { x: 548, y: 22 },
    { x: 620, y: 24 },
];

const path = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x},${point.y}`).join(" ");

const HeroMark = () => (
    <svg viewBox="0 0 640 40" role="img" aria-hidden="true" className="h-auto w-full max-w-md text-border">
        <path d={path} fill="none" stroke="currentColor" strokeWidth="1.25" />
        {points.map((point, index) => (
            <circle key={point.x} cx={point.x} cy={point.y} r={index === points.length - 1 ? 3.5 : 2} fill={index === points.length - 1 ? "var(--primary)" : "currentColor"} />
        ))}
    </svg>
);

export default HeroMark;
