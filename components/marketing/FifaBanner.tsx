import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

const FIFA_PURPLE = "#5C16E5";
const FIFA_RED = "#E51D2A";
const FIFA_LIME = "#C7F31E";

export function FifaBanner() {
  return (
    <section
      id="fifa"
      className="w-full overflow-hidden bg-[var(--bg-dark)] text-white"
    >
      {/* Three-zone unified composition */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1.3fr_1fr]">
        {/* LEFT — Mbappé B&W, fades right into the dark middle */}
        <div className="relative aspect-[3/2] overflow-hidden lg:aspect-auto lg:min-h-[640px]">
          <img
            src="/images/mbappe.jpg"
            alt="World Cup match-day atmosphere"
            className="fade-into-bg absolute inset-0 h-full w-full object-cover grayscale"
          />
        </div>

        {/* MIDDLE — unified text block */}
        <div className="flex flex-col justify-center gap-6 px-6 py-[60px] lg:px-10 lg:py-[100px] xl:px-12">
          <Eyebrow tone="primary">
            FIFA World Cup 2026™ · Host City · Atlanta
          </Eyebrow>
          <DisplayHeading size="md" as="h2" className="text-white">
            EIGHT MATCHES.
            <br />
            ONE STADIUM.
            <br />
            ONE FOOD HALL.
          </DisplayHeading>
          <div className="h-[2px] w-12 bg-[var(--primary)]" />
          <p className="max-w-[480px] text-[14px] font-light leading-[1.8] text-white/75 lg:text-[15px]">
            Atlanta is a FIFA World Cup 2026™ host city. Mercedes-Benz Stadium hosts eight matches — a short walk from our front door. Eleven chef-driven kitchens, one extraordinary bar, open late through the tournament. Eat before, celebrate after, and be part of history.
          </p>
        </div>

        {/* RIGHT — FIFA composition (purple + red blob + lime corner + trophy) */}
        <div
          className="relative overflow-hidden aspect-square lg:aspect-auto lg:min-h-[640px]"
          style={{ backgroundColor: FIFA_PURPLE }}
        >
          {/* Red blob — curves in from the left edge so it visually
              "emerges" from the dark middle column */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 -left-[30%] h-[150%] w-[140%] rounded-[50%]"
            style={{ backgroundColor: FIFA_RED }}
          />
          {/* Lime corner */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[10%] -right-[15%] h-[45%] w-[55%] rounded-[50%]"
            style={{ backgroundColor: FIFA_LIME }}
          />
          {/* Trophy centered */}
          <div className="relative z-10 flex h-full items-center justify-center p-6 lg:p-10">
            <img
              src="/images/fifa-trophy.png"
              alt="FIFA World Cup 2026™ trophy"
              className="h-44 w-auto drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)] sm:h-52 lg:h-56 xl:h-64"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
