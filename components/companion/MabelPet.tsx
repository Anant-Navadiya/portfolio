import { cn } from "@/lib/utils";
import type { MabelAction, MabelMood, MabelSkin } from "@/lib/companion/types";

export type { MabelAction, MabelMood, MabelSkin } from "@/lib/companion/types";

type MabelPetProps = {
    action?: MabelAction;
    className?: string;
    mood?: MabelMood;
    skin?: MabelSkin;
    size?: "tiny" | "compact" | "stage";
};

type SkinShape = {
    body: string;
    head: string;
};

const sizeClasses: Record<NonNullable<MabelPetProps["size"]>, string> = {
    tiny: "h-12 w-10",
    compact: "h-24 w-20",
    stage: "h-56 w-44 sm:h-64 sm:w-52",
};

const skinShapes: Record<MabelSkin, SkinShape> = {
    mabel: {
        body: "M45 118C45 93 61 91 90 91s45 2 45 27v54c-15 14-75 14-90 0v-54Z",
        head: "M39 67C39 36 59 19 90 19s51 17 51 48v17c0 25-21 39-51 39S39 109 39 84V67Z",
    },
    "red-panda": {
        body: "M48 112C53 94 127 94 132 112l4 61c-19 13-73 13-92 0l4-61Z",
        head: "M40 65C40 36 61 20 90 20s50 16 50 45v18c0 27-21 41-50 41S40 110 40 83V65Z",
    },
    robot: {
        body: "M49 111Q49 98 62 98h56q13 0 13 13v62q-41 14-82 0v-62Z",
        head: "M42 48Q42 26 64 26h52q22 0 22 22v49q0 22-22 22H64q-22 0-22-22V48Z",
    },
    fox: {
        body: "M48 112C53 94 127 94 132 112l4 61c-19 13-73 13-92 0l4-61Z",
        head: "M42 62C42 35 62 20 90 20s48 15 48 42v21c0 27-20 41-48 41S42 110 42 83V62Z",
    },
    axolotl: {
        body: "M50 112C52 95 128 95 130 112l7 58c-17 16-77 16-94 0l7-58Z",
        head: "M35 61C35 34 58 22 90 22s55 12 55 39v25c0 25-23 38-55 38S35 111 35 86V61Z",
    },
    owl: {
        body: "M45 112C48 92 132 92 135 112l2 56c-17 20-77 20-94 0l2-56Z",
        head: "M39 62C39 34 59 19 90 19s51 15 51 43v24c0 25-21 39-51 39S39 111 39 86V62Z",
    },
    dragon: {
        body: "M49 112C54 93 126 93 131 112l5 61c-19 14-73 14-92 0l5-61Z",
        head: "M42 62C42 34 62 20 90 20s48 14 48 42v22c0 27-20 41-48 41S42 111 42 84V62Z",
    },
    astronaut: {
        body: "M46 111C50 93 130 93 134 111l3 62c-18 14-76 14-94 0l3-62Z",
        head: "M43 62C43 37 62 24 90 24s47 13 47 38v22c0 24-19 37-47 37S43 108 43 84V62Z",
    },
    "forest-spirit": {
        body: "M48 112C52 93 128 93 132 112l4 61c-19 14-73 14-92 0l4-61Z",
        head: "M41 64C41 35 61 20 90 20s49 15 49 44v20c0 26-20 40-49 40S41 110 41 84V64Z",
    },
    ghost: {
        body: "M42 111C42 91 58 84 90 84s48 7 48 27v73l-16-10-16 12-16-12-16 12-16-12-16 10v-73Z",
        head: "M41 61C41 34 61 20 90 20s49 14 49 41v25c0 25-20 39-49 39S41 111 41 86V61Z",
    },
    capybara: {
        body: "M43 116C43 94 59 91 90 91s47 3 47 25v57c-17 14-77 14-94 0v-57Z",
        head: "M36 62C36 35 59 21 94 21s52 14 52 41v25c0 24-23 37-56 37S36 111 36 87V62Z",
    },
    raccoon: {
        body: "M48 112C52 94 128 94 132 112l4 61c-19 13-73 13-92 0l4-61Z",
        head: "M40 64C40 36 61 20 90 20s50 16 50 44v20c0 26-21 40-50 40S40 110 40 84V64Z",
    },
    slime: {
        body: "M38 121C38 91 58 78 90 78s52 13 52 43v48c0 10-8 17-18 17-8 0-13-4-17-10-4 8-10 13-18 13s-14-5-18-13c-4 6-9 10-17 10-10 0-16-7-16-17v-48Z",
        head: "M41 65C41 37 60 21 90 21s49 16 49 44v24c0 25-20 39-49 39S41 114 41 89V65Z",
    },
};

const Tail = ({ skin }: { skin: MabelSkin }) => {
    if (skin === "mabel") return <path className="mabel-tail mabel-beaver-tail" d="M128 135c34-16 52 7 42 31-8 20-29 29-48 23-6-19-4-40 6-54Z" fill="var(--mabel-tail)" stroke="var(--mabel-ink)" strokeWidth="4" />;
    if (skin === "red-panda" || skin === "raccoon") return <g className="mabel-tail"><path d="M131 132c39-8 52 18 35 38-12 14-29 14-43 5" stroke="var(--mabel-tail)" strokeWidth="22" strokeLinecap="round" /><path d="M141 135c4 3 8 6 11 10M153 151c3 4 5 8 5 12" stroke="var(--mabel-tail-stripe)" strokeWidth="8" strokeLinecap="round" /></g>;
    if (skin === "fox") return <path className="mabel-tail" d="M126 140c31-24 54-5 43 21-7 17-25 26-45 17 12-4 21-10 26-20-8 2-16 1-24-3Z" fill="var(--mabel-tail)" stroke="var(--mabel-ink)" strokeWidth="4" strokeLinejoin="round" />;
    if (skin === "axolotl") return <path className="mabel-tail" d="M128 139c28-14 45 5 36 27-7 15-22 21-38 14 9-12 10-26 2-41Z" fill="var(--mabel-tail)" stroke="var(--mabel-ink)" strokeWidth="4" />;
    if (skin === "dragon") return <path className="mabel-tail" d="M126 146c29-7 41 13 27 31l12 6-20 7 2-12c-12 5-22-1-25-10" fill="var(--mabel-tail)" stroke="var(--mabel-ink)" strokeWidth="4" strokeLinejoin="round" />;
    if (skin === "forest-spirit") return <path className="mabel-tail" d="M127 144c31-15 45 11 27 29-8 8-19 11-30 6 9-11 10-23 3-35Z" fill="var(--mabel-tail)" stroke="var(--mabel-ink)" strokeWidth="4" />;
    return null;
};

const BackDetails = ({ skin }: { skin: MabelSkin }) => (
    <>
        {skin === "dragon" ? <g className="mabel-wings" fill="var(--mabel-accent)" stroke="var(--mabel-ink)" strokeWidth="4" strokeLinejoin="round"><path d="M52 112C24 91 17 117 35 145l18-13 8 20 9-43-18 3Z" /><path d="M128 112c28-21 35 5 17 33l-18-13-8 20-9-43 18 3Z" /></g> : null}
        {skin === "astronaut" ? <g className="mabel-backpack"><rect x="34" y="112" width="112" height="55" rx="20" fill="var(--mabel-tail)" stroke="var(--mabel-ink)" strokeWidth="4" /><path d="M42 136H28v29h15" stroke="var(--mabel-accent)" strokeWidth="8" strokeLinecap="round" /></g> : null}
        {skin === "axolotl" ? <g className="mabel-gills" fill="var(--mabel-accent)" stroke="var(--mabel-ink)" strokeWidth="3" strokeLinecap="round"><path d="m43 48-18-12 12 23-22-2 24 12" /><path d="m137 48 18-12-12 23 22-2-24 12" /></g> : null}
        {skin === "forest-spirit" ? <g className="mabel-antlers" stroke="var(--mabel-tail)" strokeWidth="6" strokeLinecap="round"><path d="M62 37 49 16m7 10-15-2m15 1 5-15M118 37l13-21m-7 10 15-2m-15 1-5-15" /></g> : null}
    </>
);

const EarDetails = ({ skin }: { skin: MabelSkin }) => {
    if (skin === "mabel" || skin === "capybara") return <g fill="var(--mabel-ear)" stroke="var(--mabel-ink)" strokeWidth="4"><circle cx="51" cy="42" r="12" /><circle cx="129" cy="42" r="12" /></g>;
    if (skin === "red-panda" || skin === "raccoon") return <g fill="var(--mabel-fur)" stroke="var(--mabel-ink)" strokeWidth="4"><circle cx="52" cy="37" r="15" /><circle cx="128" cy="37" r="15" /><circle cx="52" cy="37" r="7" fill="var(--mabel-ear)" stroke="none" /><circle cx="128" cy="37" r="7" fill="var(--mabel-ear)" stroke="none" /></g>;
    if (skin === "fox") return <g fill="var(--mabel-fur)" stroke="var(--mabel-ink)" strokeWidth="4" strokeLinejoin="round"><path d="M47 49 48 8l32 28Z" /><path d="m133 49-1-41-32 28Z" /><path d="M53 35V19l14 16M127 35V19l-14 16" stroke="var(--mabel-ear)" strokeWidth="7" /></g>;
    if (skin === "owl") return <g fill="var(--mabel-fur)" stroke="var(--mabel-ink)" strokeWidth="4" strokeLinejoin="round"><path d="m45 48 3-35 28 24ZM135 48l-3-35-28 24Z" /></g>;
    if (skin === "dragon") return <g fill="var(--mabel-accent)" stroke="var(--mabel-ink)" strokeWidth="4" strokeLinejoin="round"><path d="M54 42 47 10l25 24ZM126 42l7-32-25 24Z" /></g>;
    if (skin === "robot") return <g className="mabel-antenna" stroke="var(--mabel-ink)" strokeWidth="4"><path d="M90 27V11" /><circle cx="90" cy="8" r="7" fill="var(--mabel-accent)" /></g>;
    return null;
};

const FaceDetails = ({ skin }: { skin: MabelSkin }) => (
    <>
        {skin === "robot" ? <rect x="51" y="45" width="78" height="54" rx="18" fill="var(--mabel-face)" stroke="var(--mabel-ink)" strokeWidth="3" /> : null}
        {skin === "red-panda" ? <g fill="var(--mabel-face)"><path d="M48 53c13-15 27-12 31 5L68 81 48 72Z" /><path d="M132 53c-13-15-27-12-31 5l11 23 20-9Z" /><ellipse cx="90" cy="91" rx="24" ry="17" /></g> : null}
        {skin === "fox" ? <path d="M59 79c11-12 22-8 31 4 9-12 20-16 31-4-4 23-16 34-31 34S63 102 59 79Z" fill="var(--mabel-face)" /> : null}
        {skin === "owl" ? <g fill="var(--mabel-face)" stroke="var(--mabel-ink)" strokeWidth="3"><circle cx="68" cy="68" r="22" /><circle cx="112" cy="68" r="22" /></g> : null}
        {skin === "raccoon" ? <path d="M46 53c18-14 30-8 44 4 14-12 26-18 44-4l-11 35-33-7-33 7-11-35Z" fill="var(--mabel-face)" /> : null}
        {skin === "mabel" || skin === "capybara" ? <g fill="var(--mabel-face)"><ellipse cx="71" cy="90" rx="25" ry="19" /><ellipse cx="109" cy="90" rx="25" ry="19" /></g> : null}
        {skin === "astronaut" ? <path d="M45 68c0-31 18-47 45-47s45 16 45 47v20c-9-9-25-14-45-14S54 79 45 88V68Z" fill="var(--mabel-visor)" opacity=".72" /> : null}
        {skin === "forest-spirit" ? <g fill="var(--mabel-accent)"><path d="m48 52 14-12 8 16-14 7Z" /><path d="m132 52-14-12-8 16 14 7Z" /><circle cx="90" cy="104" r="7" /></g> : null}
        {skin === "slime" ? <path d="M51 50c10-18 29-24 46-19-17 2-26 12-30 28Z" fill="white" opacity=".28" /> : null}
    </>
);

const Face = ({ skin }: { skin: MabelSkin }) => (
    <>
        <g className="mabel-eyes">
            <ellipse className="mabel-eye mabel-eye-left" cx="69" cy="68" rx={skin === "mabel" ? 13 : 10} ry={skin === "mabel" ? 16 : 13} fill="white" stroke="var(--mabel-ink)" strokeWidth="3" />
            <ellipse className="mabel-eye mabel-eye-right" cx="111" cy="68" rx={skin === "mabel" ? 13 : 10} ry={skin === "mabel" ? 16 : 13} fill="white" stroke="var(--mabel-ink)" strokeWidth="3" />
            <circle className="mabel-pupil mabel-pupil-left" cx="72" cy="70" r="4" fill="var(--mabel-ink)" />
            <circle className="mabel-pupil mabel-pupil-right" cx="114" cy="70" r="4" fill="var(--mabel-ink)" />
        </g>
        {skin === "owl" ? <path d="m90 78-8 9 8 7 8-7-8-9Z" fill="var(--mabel-accent)" stroke="var(--mabel-ink)" strokeWidth="2.5" /> : <path d="m84 84 6 4 6-4" fill="var(--mabel-nose)" stroke="var(--mabel-ink)" strokeWidth="2.5" strokeLinejoin="round" />}
        {skin === "robot" ? <path className="mabel-mouth" d="M75 91h30" stroke="var(--mabel-accent)" strokeWidth="4" strokeLinecap="round" strokeDasharray="4 5" /> : <path className="mabel-mouth" d="M78 96c7 7 17 7 24 0" stroke="var(--mabel-ink)" strokeWidth="3" strokeLinecap="round" />}
        {skin === "mabel" ? <g fill="#fff7ed" stroke="var(--mabel-ink)" strokeWidth="2"><path d="M83 99h8v16c-7 2-10-5-8-16Z" /><path d="M89 99h8c2 11-1 18-8 16V99Z" /></g> : null}
        {skin === "mabel" ? <path d="M55 90 24 84M56 97l-31 6M125 90l31-6M124 97l31 6" stroke="var(--mabel-ink)" strokeWidth="2" strokeLinecap="round" opacity=".55" /> : null}
        {skin === "axolotl" ? <g fill="var(--mabel-accent)" opacity=".75"><circle cx="56" cy="91" r="6" /><circle cx="124" cy="91" r="6" /></g> : null}
    </>
);

const BodyDetails = ({ skin }: { skin: MabelSkin }) => (
    <>
        {skin === "mabel" ? <path d="M66 106c12-8 36-8 48 0-5 11-14 17-24 17s-19-6-24-17Z" fill="var(--mabel-face)" opacity=".5" /> : null}
        {skin === "robot" ? <g><rect x="66" y="118" width="48" height="34" rx="8" fill="var(--mabel-face)" stroke="var(--mabel-ink)" strokeWidth="3" /><circle cx="79" cy="130" r="4" fill="var(--mabel-accent)" /><circle cx="91" cy="130" r="4" fill="#34d399" /><path d="M76 142h29" stroke="var(--mabel-ink)" strokeWidth="3" strokeLinecap="round" /></g> : null}
        {skin === "owl" ? <path d="M64 112c13 7 39 7 52 0v52c-12 12-40 12-52 0v-52Z" fill="var(--mabel-face)" opacity=".9" /> : null}
        {skin === "dragon" ? <path d="M75 108h30l7 61c-9 5-35 5-44 0l7-61Z" fill="var(--mabel-face)" opacity=".75" /> : null}
        {skin === "astronaut" ? <g><path d="M61 112h58v31H61z" fill="var(--mabel-face)" stroke="var(--mabel-ink)" strokeWidth="3" /><circle cx="76" cy="126" r="4" fill="#ef4444" /><circle cx="90" cy="126" r="4" fill="#22c55e" /><path d="M102 122h10M102 130h10" stroke="var(--mabel-ink)" strokeWidth="3" /></g> : null}
        {skin === "forest-spirit" ? <g fill="var(--mabel-accent)"><path d="M88 108c-19 13-21 32 2 44 23-12 21-31-2-44Z" /><path d="M90 111v36" stroke="var(--mabel-tail)" strokeWidth="3" /></g> : null}
        {skin === "raccoon" ? <path d="M69 111c12 8 30 8 42 0l-6 25H75l-6-25Z" fill="var(--mabel-face)" /> : null}
        {skin === "slime" ? <ellipse cx="72" cy="120" rx="14" ry="24" fill="white" opacity=".14" /> : null}
    </>
);

const MabelPet = ({ action = "idle", className, mood = "idle", skin = "mabel", size = "compact" }: MabelPetProps) => {
    const shape = skinShapes[skin];
    return (
        <span className={cn("mabel-avatar relative block shrink-0", `mabel-skin-${skin}`, `mabel-mood-${mood}`, `mabel-action-${action}`, sizeClasses[size], className)} aria-hidden="true">
            <svg className="h-full w-full overflow-visible" viewBox="0 0 180 225" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse className="mabel-shadow" cx="90" cy="215" rx="53" ry="7" fill="currentColor" opacity=".12" />
                <BackDetails skin={skin} />
                <Tail skin={skin} />

                <g className="mabel-leg mabel-leg-left"><path d="M67 165v37" stroke="var(--mabel-limb)" strokeWidth="22" strokeLinecap="round" /><ellipse cx="61" cy="207" rx="20" ry="10" fill="var(--mabel-limb)" stroke="var(--mabel-ink)" strokeWidth="4" /></g>
                <g className="mabel-leg mabel-leg-right"><path d="M113 165v37" stroke="var(--mabel-limb)" strokeWidth="22" strokeLinecap="round" /><ellipse cx="119" cy="207" rx="20" ry="10" fill="var(--mabel-limb)" stroke="var(--mabel-ink)" strokeWidth="4" /></g>

                <path className="mabel-body" d={shape.body} fill="var(--mabel-body)" stroke="var(--mabel-ink)" strokeWidth="4" strokeLinejoin="round" />
                <BodyDetails skin={skin} />

                <g className="mabel-arm mabel-arm-left"><path d="M56 113c-16 12-21 31-10 43 5 6 11 4 14-2" stroke="var(--mabel-limb)" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" /><circle cx="58" cy="153" r="9" fill="var(--mabel-limb)" stroke="var(--mabel-ink)" strokeWidth="3" /></g>
                <g className="mabel-arm mabel-arm-right"><path d="M124 113c16 12 21 31 10 43-5 6-11 4-14-2" stroke="var(--mabel-limb)" strokeWidth="17" strokeLinecap="round" strokeLinejoin="round" /><circle cx="122" cy="153" r="9" fill="var(--mabel-limb)" stroke="var(--mabel-ink)" strokeWidth="3" /></g>

                <g className="mabel-head">
                    <EarDetails skin={skin} />
                    {skin === "astronaut" ? <circle cx="90" cy="70" r="61" fill="var(--mabel-helmet)" stroke="var(--mabel-ink)" strokeWidth="5" /> : null}
                    <path className="mabel-head-shape" d={shape.head} fill="var(--mabel-fur)" stroke="var(--mabel-ink)" strokeWidth="4" strokeLinejoin="round" />
                    <FaceDetails skin={skin} />
                    <Face skin={skin} />
                </g>

                <g className="mabel-book"><path d="M61 145c12-5 22-2 29 5v32c-8-7-18-9-29-5v-32Z" fill="var(--mabel-paper)" stroke="var(--mabel-ink)" strokeWidth="3" strokeLinejoin="round" /><path d="M119 145c-12-5-22-2-29 5v32c8-7 18-9 29-5v-32Z" fill="var(--mabel-paper)" stroke="var(--mabel-ink)" strokeWidth="3" strokeLinejoin="round" /><path d="M70 155h12M70 162h12M110 155H98M110 162H98" stroke="var(--mabel-ink)" strokeWidth="2" strokeLinecap="round" opacity=".35" /></g>
                <g className="mabel-sparkles" fill="var(--mabel-accent)"><path d="m31 76 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" /><path d="m149 43 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" /></g>
                <g className="mabel-sleep" fill="var(--mabel-ink)"><path d="M136 50h15l-15 15h15" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" /><path d="M151 29h11l-11 11h11" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity=".65" /></g>
            </svg>
        </span>
    );
};

export default MabelPet;
