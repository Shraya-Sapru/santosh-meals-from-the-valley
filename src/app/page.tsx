import Image from "next/image";
import { Button } from "@/components/Button";
import { SantoshIcon } from "@/components/SantoshIcon";
import { listPublicEvents, seatsRemaining } from "@/lib/booking";

const PATHWAY_TONE_CLASSES = {
  lotus: "bg-lotus/50",
  saffron: "bg-saffron/50",
  cardamom: "bg-cardamom/50",
} as const;

const PATHWAYS = [
  {
    id: "kitchen",
    tone: "lotus" as const,
    kicker: "Read · Discover",
    title: "Every dish has a story.",
    body: "Explore seven beloved Kashmiri recipes, one step at a time, and discover the ingredients and techniques behind each dish.",
    cta: "Explore The Kitchen",
    href: "/kitchen",
  },
  {
    id: "cook",
    tone: "saffron" as const,
    kicker: "Play · Cook",
    title: "Cook with Maej.",
    body: "Step into Maej's kitchen and make Mutton Rogan Josh yourself, searing, tempering and simmering in the traditional sequence.",
    cta: "Start cooking",
    href: "/cook",
  },
  {
    id: "reserve",
    tone: "cardamom" as const,
    kicker: "Taste · Gather",
    title: "Your seat at our table.",
    body: "Join us for an intimate weekend meal in Bangalore: a fresh set menu of starters, mains and dessert, served with warmth and stories.",
    cta: "See this weekend",
    href: "/this-weekend",
  },
];

export default function Home() {
  const nextEvent = listPublicEvents()[0];

  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-[1120px] px-6 py-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col items-start justify-center gap-6 text-left">
            <div className="flex items-center gap-4">
              <SantoshIcon className="h-24 w-24 shrink-0 animate-hero-in" />
              <div>
                <h1
                  className="animate-hero-in font-display text-5xl text-ink sm:text-6xl"
                  style={{ animationDelay: "0.1s" }}
                >
                  Santosh
                </h1>
                <p
                  className="animate-hero-in mt-1 text-lg text-ink-soft"
                  style={{ animationDelay: "0.25s" }}
                >
                  Joyful meals from the Valley
                </p>
              </div>
            </div>
            <p className="max-w-md text-[19px] leading-relaxed text-ink-soft">
              Kashmiri Pandit food, cooked at home and shared at our table
              on weekends in Bangalore.
            </p>
            <Button href="/this-weekend">
              <span aria-hidden="true" className="chair-wiggle">
                🪑
              </span>{" "}
              Reserve a seat
            </Button>
          </div>

          <div className="relative mx-auto aspect-[4/3] w-full max-w-xs overflow-hidden rounded-photo bg-gradient-to-br from-lotus via-saffron/40 to-cardamom/40 lg:aspect-auto lg:ml-auto lg:mr-0">
            <Image
              src="/banner/FOUNDER.jpg"
              alt="Meenakshi Sapru, Santosh's founder and chef, smiling, wearing traditional dejhoor earrings"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain object-bottom"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/60 to-transparent px-5 pb-4 pt-10">
              <p className="text-xs text-rice/80">Meet the chef</p>
              <p className="font-display text-xl text-rice">Meenakshi Sapru</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-almond bg-almond/40 py-16">
        <div className="mx-auto max-w-[980px] px-6">
          <h2 className="text-center font-display text-4xl text-ink">
            Why Santosh
          </h2>
          <p className="mt-2 text-center text-base text-ink-soft lg:whitespace-nowrap">
            A taste of Kashmir. A tradition carried forward. A table set
            with love.
          </p>

          <div className="mt-10 text-justify text-[19px] leading-relaxed text-ink-soft lg:columns-2 lg:gap-12">
            <p className="mb-6">
              Kashmiri Pandit cuisine is more than food. It is a
              centuries-old culinary tradition shaped by Shaivite
              heritage, Sattvic principles and a deep reverence for the
              ingredients themselves. Our cooking finds its flavour
              without onions, garlic or tomatoes.
            </p>
            <p className="mb-6">
              Instead, it draws on the unmistakable warmth of four
              signature spices: asafoetida (heeng), dried ginger, fennel
              and Kashmiri red chilli. From vegetarian favourites to
              slow-simmered meat dishes, every preparation honours the
              distinctive techniques, thoughtful spice blends and
              time-honoured practices passed down through generations.
            </p>
            <p>
              At Santosh, we bring this heritage to your table through
              joyful, authentic Kashmiri Pandit meals, lovingly prepared
              and served in the warmth of our home in Bangalore.
            </p>
          </div>

          <p className="mt-10 text-center font-display text-lg text-chilli">
            Come for the food. Stay for the stories, the warmth and a
            little taste of Kashmir.
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1120px] px-6 py-16">
        <h2 className="text-center font-display text-4xl text-ink">
          Three ways to know Santosh
        </h2>
        <p className="mx-auto mt-2 max-w-md text-center text-ink-soft">
          Discover the food, cook it yourself, then taste it for real.
        </p>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {PATHWAYS.map((p) => (
            <div
              key={p.id}
              className={`flex flex-col gap-3 rounded-panel p-6 ${PATHWAY_TONE_CLASSES[p.tone]}`}
            >
              <span className="text-xs font-semibold text-ink-soft">
                {p.kicker}
              </span>
              <h3 className="font-display text-2xl text-ink">{p.title}</h3>
              <p className="text-[15px] text-ink-soft">{p.body}</p>
              <Button href={p.href} variant="secondary" className="self-start">
                {p.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-14">
        <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 px-6 sm:flex-row sm:items-center sm:justify-between">
          {nextEvent ? (
            <div>
              <p className="text-sm text-rice/70">This weekend</p>
              <p className="font-display text-2xl text-rice sm:text-3xl">
                {new Date(nextEvent.date).toLocaleDateString("en-IN", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}{" "}
                · {nextEvent.startTime}
              </p>
              <p className="text-sm text-rice/70">
                {seatsRemaining(nextEvent)} seats left of {nextEvent.seatCap}
              </p>
            </div>
          ) : (
            <p className="text-rice/70">No evening on the menu yet.</p>
          )}
          <Button href="/this-weekend">Reserve a seat</Button>
        </div>
      </section>

      <section className="py-14">
        <div className="mx-auto flex max-w-[720px] flex-col items-center gap-6 px-6 text-center">
          <h2 className="font-display text-2xl text-ink">
            Join us at the table
          </h2>
          <div className="flex w-full flex-col items-center gap-4 rounded-panel bg-almond/40 px-6 py-5 sm:flex-row sm:justify-center sm:gap-10">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="text-lg">
                📍
              </span>
              <p className="text-sm text-ink">
                <span className="font-semibold">Where</span>{" "}
                <span className="text-ink-soft">Yelahanka, Bangalore</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="text-lg">
                📞
              </span>
              <p className="text-sm text-ink">
                <span className="font-semibold">Call</span>{" "}
                <span className="text-ink-soft">+91xxxxxxxx</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="text-lg">
                ✉️
              </span>
              <p className="text-sm text-ink">
                <span className="font-semibold">Email</span>{" "}
                <span className="text-ink-soft">meals@santosh.com</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-almond py-8">
        <div className="mx-auto flex max-w-[1120px] flex-col items-center gap-2 px-6 text-center">
          <div className="flex items-center gap-2">
            <SantoshIcon className="h-6 w-6" />
            <span className="font-display text-lg text-ink">Santosh</span>
          </div>
          <p className="text-sm text-ink-soft">
            Joyful meals from the Valley
          </p>
        </div>
      </footer>
    </main>
  );
}
