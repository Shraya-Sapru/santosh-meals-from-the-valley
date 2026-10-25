import { Button } from "@/components/Button";
import { PhotoSlot } from "@/components/PhotoSlot";
import { MaejTip } from "@/components/MaejTip";
import { getPhotoUrl } from "@/lib/pipeline/store";

const colors = [
  { name: "--color-rice", className: "bg-rice", textOn: "text-ink" },
  { name: "--color-lotus", className: "bg-lotus", textOn: "text-ink" },
  { name: "--color-cardamom", className: "bg-cardamom", textOn: "text-ink" },
  { name: "--color-saffron", className: "bg-saffron", textOn: "text-ink" },
  { name: "--color-almond", className: "bg-almond", textOn: "text-ink" },
  { name: "--color-chilli", className: "bg-chilli", textOn: "text-rice" },
  { name: "--color-ink", className: "bg-ink", textOn: "text-rice" },
  { name: "--color-ink-soft", className: "bg-ink-soft", textOn: "text-rice" },
];

export default function StyleGuidePage() {
  return (
    <main className="mx-auto flex w-full max-w-[1120px] flex-col gap-12 px-6 py-12">
      <div>
        <h1 className="font-display text-4xl text-ink">Style guide</h1>
        <p className="mt-1 text-ink-soft">
          Every design token and shared component, for a quick look before
          shipping a new screen.
        </p>
      </div>

      <section>
        <h2 className="font-display text-2xl text-ink">Colour tokens</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {colors.map((c) => (
            <div
              key={c.name}
              className={`flex h-24 flex-col justify-end rounded-panel p-3 ${c.className} ${c.textOn}`}
            >
              <span className="font-mono text-xs">{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink">Type scale</h2>
        <div className="mt-4 flex flex-col gap-3">
          <p className="font-display text-[56px] leading-none text-ink">
            Rogan Josh
          </p>
          <p className="font-display text-[40px] leading-none text-ink">
            Rogan Josh
          </p>
          <p className="font-display text-[28px] leading-none text-ink">
            Rogan Josh
          </p>
          <p className="text-[21px] text-ink">Body — 21px</p>
          <p className="text-[18px] text-ink">Body — 18px</p>
          <p className="text-[15px] text-ink-soft">Caption — 15px</p>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink">Buttons</h2>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Button variant="primary">Reserve a seat</Button>
          <Button variant="secondary">Start cooking</Button>
          <Button variant="quiet">Explore The Kitchen</Button>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink">PhotoSlot</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Real photos where the owner has supplied one; a pastel
          placeholder otherwise.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <PhotoSlot
            id="DISH-ROGAN"
            label="Rogan Josh"
            tone="chilli"
            src={getPhotoUrl("DISH-ROGAN")}
            showNote
          />
          <PhotoSlot
            id="DISH-KEHWA"
            label="Kehwa"
            tone="cardamom"
            src={getPhotoUrl("DISH-KEHWA")}
            showNote
          />
          <PhotoSlot
            id="DISH-DUMAALOO"
            label="Dum Aaloo"
            tone="saffron"
            src={getPhotoUrl("DISH-DUMAALOO")}
            showNote
          />
          <PhotoSlot
            id="DISH-MYAKHNI"
            label="Mutton Yakhni"
            tone="almond"
            src={getPhotoUrl("DISH-MYAKHNI")}
            showNote
          />
          <PhotoSlot
            id="DISH-NADRUYAKHNI"
            label="Nadru Yakhni"
            tone="lotus"
            src={getPhotoUrl("DISH-NADRUYAKHNI")}
            showNote
          />
          <PhotoSlot
            id="DISH-NADURMONJE"
            label="Nadur Monje"
            tone="saffron"
            src={getPhotoUrl("DISH-NADURMONJE")}
            showNote
          />
          <PhotoSlot
            id="DISH-KONGPHIRIN"
            label="Kong Phirin"
            tone="saffron"
            showNote
          />
          <PhotoSlot id="HERO-SPREAD" label="Hero spread" tone="lotus" showNote />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl text-ink">MaejTip</h2>
        <div className="mt-4 flex flex-col gap-4 sm:max-w-md">
          <MaejTip tone="saffron">
            Add the whisked yoghurt a little at a time, stirring continuously
            to prevent curdling.
          </MaejTip>
          <MaejTip tone="lotus">
            Releasing the oil too early means it isn&apos;t at smoking point
            yet.
          </MaejTip>
        </div>
      </section>
    </main>
  );
}
