const primaryPeek = [
  {
    url: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Colorful world cuisine bowl",
  },
  {
    url: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Japanese sushi",
  },
];

const secondaryPeek = [
  {
    url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Indian curry",
  },
  {
    url: "https://images.unsplash.com/photo-1557872943-16a5ac26437e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Japanese ramen",
  },
  {
    url: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Mexican tacos",
  },
  {
    url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Italian pizza",
  },
  {
    url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Chinese dim sum",
  },
  {
    url: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Mediterranean spread",
  },
  {
    url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "Fresh grain bowl",
  },
  {
    url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    alt: "American smash burger",
  },
];

function SectionHeader() {
  return (
    <div className="flex w-full items-end justify-between gap-4">
      <div className="flex flex-col gap-4">
        <span className="text-[11px] font-medium tracking-[6px] text-[var(--text-muted-dark)]">
          SNEAK PEEK
        </span>
        <h2 className="font-display text-[30px] text-[var(--text-dark)] lg:text-[36px]">
          A taste of what&apos;s coming.
        </h2>
      </div>
      <a
        href="#"
        className="text-[12px] font-medium tracking-[3px] whitespace-nowrap text-[var(--primary)] transition-opacity hover:opacity-80"
      >
        FOLLOW ALONG &nbsp;&rarr;
      </a>
    </div>
  );
}

export function SneakPeek() {
  return (
    <section className="flex w-full flex-col gap-12 bg-[var(--bg-warm-white)] px-6 py-[100px] lg:px-[60px]">
      <SectionHeader />

      <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {primaryPeek.map((img) => (
          <div
            key={img.alt}
            className="h-[280px] overflow-hidden rounded-[4px] bg-[var(--bg-cream)] lg:h-[400px]"
          >
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>

      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
        {secondaryPeek.map((img) => (
          <div
            key={img.alt}
            className="h-[120px] overflow-hidden rounded-[4px] bg-[var(--bg-cream)] lg:h-[400px]"
          >
            <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
          </div>
        ))}
      </div>
    </section>
  );
}
