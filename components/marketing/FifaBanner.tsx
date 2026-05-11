import { Eyebrow } from "@/components/ui/Eyebrow";
import { DisplayHeading } from "@/components/ui/DisplayHeading";

const FIFA_PURPLE = "#5C16E5";
const FIFA_RED = "#E51D2A";
const FIFA_LIME = "#C7F31E";

type Block = {
  number: string;
  eyebrow: string;
  headline: React.ReactNode;
  body: string;
  imageUrl: string;
  imageAlt: string;
  imageSide: "left" | "right";
};

const blocks: Block[] = [
  {
    number: "01",
    eyebrow: "Match Venue",
    headline: (
      <>
        EIGHT MATCHES.
        <br />
        ONE STADIUM.
        <br />
        WALKABLE FROM
        <br />
        OUR FRONT DOOR.
      </>
    ),
    body: "Mercedes-Benz Stadium is hosting eight 2026 World Cup matches, including a semifinal. CTR Food Works sits a short walk away — the perfect pre- or post-match stop, whether you've got a ticket or you're celebrating with the city.",
    imageUrl:
      "https://images.unsplash.com/photo-1522778119026-d647f0596c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1600",
    imageAlt: "Soccer stadium under match-day lights",
    imageSide: "left",
  },
  {
    number: "02",
    eyebrow: "Game Day",
    headline: (
      <>
        EAT BEFORE.
        <br />
        CELEBRATE AFTER.
      </>
    ),
    body: "Eleven chef-driven kitchens, one extraordinary bar, open late through the tournament. Whether your team wins or breaks your heart, you'll have somewhere to land.",
    imageUrl: "/images/260218 Food Hall Rendering_View_002 (1).webp",
    imageAlt: "CTR Food Works food hall rendering",
    imageSide: "right",
  },
];

export function FifaBanner() {
  return (
    <section id="fifa" className="w-full">
      {/* TOP — FIFA-branded composition */}
      <div
        className="relative w-full overflow-hidden"
        style={{ backgroundColor: FIFA_PURPLE }}
      >
        {/* Red curve — mobile */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[10%] left-1/2 h-[55%] w-[200%] -translate-x-1/2 rounded-[50%] lg:hidden"
          style={{ backgroundColor: FIFA_RED }}
        />
        {/* Red curve — desktop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-[10%] top-1/2 hidden h-[200%] w-[65%] -translate-y-1/2 rounded-[50%] lg:block"
          style={{ backgroundColor: FIFA_RED }}
        />
        {/* Lime corner — mobile */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[5%] -right-[10%] h-[18%] w-[35%] rounded-[50%] lg:hidden"
          style={{ backgroundColor: FIFA_LIME }}
        />
        {/* Lime corner — desktop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[20%] -right-[2%] hidden h-[65%] w-[10%] rounded-[50%] lg:block"
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

      {/* BOTTOM — editorial blocks */}
      <div className="w-full bg-[var(--bg-dark)] text-white">
        {blocks.map((block) => (
          <article
            key={block.number}
            className="grid grid-cols-1 lg:grid-cols-2"
          >
            {/* Image */}
            <div
              className={`relative aspect-[4/3] overflow-hidden lg:aspect-auto lg:min-h-[560px] ${
                block.imageSide === "right" ? "lg:order-2" : ""
              }`}
            >
              <img
                src={block.imageUrl}
                alt={block.imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center gap-6 px-6 py-[80px] lg:px-[60px] lg:py-[100px]">
              <span className="text-[10px] font-semibold tracking-[4px] uppercase text-[var(--secondary-ochre)]">
                {block.number}
              </span>
              <Eyebrow tone="light">{block.eyebrow}</Eyebrow>
              <DisplayHeading size="md" as="h3" className="text-white">
                {block.headline}
              </DisplayHeading>
              <div className="h-[2px] w-12 bg-[var(--primary)]" />
              <p className="max-w-[480px] text-[14px] font-light leading-[1.8] text-white/70 lg:text-[15px]">
                {block.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
