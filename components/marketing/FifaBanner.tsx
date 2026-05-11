import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

// FIFA 2026 brand-mark palette — sampled to the saturated reference
const FIFA_PURPLE = "#6F00E8";
const FIFA_RED = "#DC0A18";
const FIFA_LIME = "#C4F12A";

export function FifaBanner() {
  return (
    <section id="fifa" className="w-full">
      {/* TOP — FIFA-branded composition */}
      <div
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: FIFA_PURPLE }}
      >
        {/* Desktop — precise SVG composition.
            1920×500 viewBox with the two gigantic ellipses centered well
            outside the canvas; we only see arcs. preserveAspectRatio="slice"
            keeps the curves proportionally identical as the section width
            scales between lg and xl. */}
        <svg
          viewBox="0 0 1920 500"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
          className="absolute inset-0 hidden h-full w-full lg:block"
        >
          <rect width="1920" height="500" fill={FIFA_PURPLE} />
          <ellipse cx="1850" cy="720" rx="650" ry="420" fill={FIFA_LIME} />
          <ellipse cx="1700" cy="230" rx="920" ry="360" fill={FIFA_RED} />
        </svg>

        {/* Mobile — CSS shapes (the wide SVG viewBox doesn't reduce
            cleanly to a narrow mobile column, so we keep the mobile
            composition as separate positioned divs). */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[10%] left-1/2 h-[55%] w-[200%] -translate-x-1/2 rounded-[50%] lg:hidden"
          style={{ backgroundColor: FIFA_RED }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[5%] -right-[10%] h-[18%] w-[35%] rounded-[50%] lg:hidden"
          style={{ backgroundColor: FIFA_LIME }}
        />

        <div className="relative z-10 flex flex-col items-start gap-10 px-6 py-14 sm:py-16 lg:flex-row lg:items-center lg:gap-12 lg:px-[60px] lg:py-20">
          <div className="flex max-w-[520px] flex-col gap-4 lg:flex-1">
            <Eyebrow tone="light" className="!text-white">
              FIFA World Cup 2026™ · Host City
            </Eyebrow>
            <p className="text-[14px] font-light leading-[1.7] text-white/90 lg:text-[15px]">
              <span className="font-semibold text-white">
                Atlanta is a FIFA World Cup 2026™ host city.
              </span>{" "}
              CTR Food Works opens just in time — positioned at the center of downtown, surrounded by major sports venues and cultural landmarks. The perfect place to gather before the match, celebrate the win, and be part of history.
            </p>
          </div>

          <div className="flex w-full justify-center lg:w-auto lg:flex-shrink-0 lg:pr-[40px]">
            <img
              src="/images/fifa-trophy.png"
              alt="FIFA World Cup 2026™ trophy"
              className="h-40 w-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:h-52 lg:h-64"
            />
          </div>
        </div>
      </div>

      {/* BOTTOM — single editorial block, B&W photo fading into the dark bg */}
      <article className="grid w-full grid-cols-1 bg-[var(--bg-dark)] text-white lg:grid-cols-2">
        <div className="relative aspect-[3/2] overflow-hidden lg:aspect-auto lg:min-h-[640px]">
          <img
            src="/images/mbappe.jpg"
            alt="World Cup match-day atmosphere"
            className="fade-into-bg absolute inset-0 h-full w-full object-cover grayscale"
          />
        </div>

        <div className="flex flex-col justify-center gap-6 px-6 py-[80px] lg:px-[60px] lg:py-[120px]">
          <Eyebrow tone="light">Match Venue · Atlanta</Eyebrow>
          <DisplayHeading size="md" as="h3" className="text-white">
            EIGHT MATCHES.
            <br />
            ONE STADIUM.
            <br />
            ONE FOOD HALL.
          </DisplayHeading>
          <div className="h-[2px] w-12 bg-[var(--primary)]" />
          <p className="max-w-[480px] text-[14px] font-light leading-[1.8] text-white/70 lg:text-[15px]">
            Mercedes-Benz Stadium is hosting eight 2026 World Cup matches — a short walk from our front door. Eleven chef-driven kitchens and one extraordinary bar, open late through the tournament. Eat before, celebrate after, and be part of history at the heart of downtown Atlanta.
          </p>
        </div>
      </article>
    </section>
  );
}
