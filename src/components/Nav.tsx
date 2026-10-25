import Link from "next/link";
import { Button } from "./Button";
import { SantoshIcon } from "./SantoshIcon";

const links = [
  { href: "/kitchen", label: "The Kitchen" },
  { href: "/cook", label: "Cook with Maej" },
  { href: "/this-weekend", label: "This Weekend" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-10 border-b border-almond bg-rice/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl text-ink">
          <SantoshIcon className="h-9 w-9" />
          Santosh
        </Link>
        <nav className="hidden items-center gap-6 text-[15px] text-ink-soft md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <Button href="/this-weekend" className="shrink-0">
          Reserve a seat
        </Button>
      </div>
    </header>
  );
}
