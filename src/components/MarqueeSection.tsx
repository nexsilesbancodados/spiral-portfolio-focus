import "./MarqueeSection.css";

const ITEMS = ["Noise", "Nexus", "All in", "Voiture", "Legacy"];

const RepeatedItems = () => (
  <>
    {Array.from({ length: 8 }).map((_, i) =>
      ITEMS.map((text, j) => (
        <span key={`${i}-${j}`} className="marquee-item">
          {text} <span className="marquee-dot" />
        </span>
      ))
    )}
  </>
);

export const MarqueeSection = () => {
  return (
    <section className="marquee-wrapper" aria-hidden="true">
      {/* Black band (behind) */}
      <div className="marquee-stripe black-band">
        <div className="marquee-scroller marquee-reverse">
          <RepeatedItems />
        </div>
      </div>

      {/* White band (front) */}
      <div className="marquee-stripe white-band">
        <div className="marquee-scroller">
          <RepeatedItems />
        </div>
      </div>
    </section>
  );
};
