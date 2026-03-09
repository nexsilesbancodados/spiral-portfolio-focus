import React, { useState, useEffect } from "react";

const ICONS = [
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
];

const LABELS = ["GitHub", "Python", "React", "Node.js", "TypeScript", "Docker"];

function SemiCircleOrbit({ radius, centerX, centerY, count, iconSize }: { radius: number; centerX: number; centerY: number; count: number; iconSize: number }) {
  return (
    <>
      <div className="absolute inset-0 flex justify-center">
        <div
          className="w-[1000px] h-[1000px] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)] blur-3xl -mt-40 pointer-events-none"
          style={{ zIndex: 0 }}
        />
      </div>

      {Array.from({ length: count }).map((_, index) => {
        const angle = (index / (count - 1)) * 180;
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);
        const icon = ICONS[index % ICONS.length];
        const label = LABELS[index % LABELS.length];
        const tooltipAbove = angle > 90;

        return (
          <div
            key={index}
            className="absolute flex flex-col items-center group"
            style={{
              left: `${centerX + x - iconSize / 2}px`,
              top: `${centerY - y - iconSize / 2}px`,
              zIndex: 5,
            }}
          >
            <img
              src={icon}
              alt={label}
              width={iconSize}
              height={iconSize}
              className="object-contain cursor-pointer transition-transform hover:scale-110 drop-shadow-[0_0_8px_hsl(25_95%_55%/0.4)]"
              style={{ minWidth: iconSize, minHeight: iconSize, filter: 'brightness(1.2)' }}
            />

            <div
              className={`absolute ${
                tooltipAbove ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"
              } hidden group-hover:block w-28 rounded-lg bg-background/90 backdrop-blur-sm border border-vice-sunset/30 px-2 py-1 text-xs text-foreground shadow-lg text-center`}
            >
              {label}
              <div
                className={`absolute left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-background/90 border border-vice-sunset/30 ${
                  tooltipAbove ? "top-full -mt-1.5 border-t-0 border-l-0" : "bottom-full -mb-1.5 border-b-0 border-r-0"
                }`}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}

export default function MultiOrbitSemiCircle() {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const baseWidth = Math.min(size.width * 0.8, 700);
  const centerX = baseWidth / 2;
  const centerY = baseWidth * 0.5;

  const iconSize =
    size.width < 480
      ? Math.max(24, baseWidth * 0.05)
      : size.width < 768
      ? Math.max(28, baseWidth * 0.06)
      : Math.max(32, baseWidth * 0.07);

  return (
    <div className="relative w-full flex flex-col items-center mt-16">
      <div
        className="relative"
        style={{ width: baseWidth, height: baseWidth * 0.6 }}
      >
        <SemiCircleOrbit radius={baseWidth * 0.22} centerX={centerX} centerY={centerY} count={6} iconSize={iconSize} />
        <SemiCircleOrbit radius={baseWidth * 0.36} centerX={centerX} centerY={centerY} count={8} iconSize={iconSize} />
        <SemiCircleOrbit radius={baseWidth * 0.5} centerX={centerX} centerY={centerY} count={10} iconSize={iconSize} />
      </div>
    </div>
  );
}
