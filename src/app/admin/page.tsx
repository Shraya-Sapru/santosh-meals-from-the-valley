import Link from "next/link";

export default function AdminHome() {
  return (
    <main className="mx-auto w-full max-w-[1120px] px-6 py-12">
      <h1 className="font-display text-3xl text-ink">Admin</h1>
      <ul className="mt-6 flex flex-col gap-2 text-[15px] text-chilli underline">
        <li>
          <Link href="/admin/recipes">Recipe pipeline</Link>
        </li>
        <li>
          <Link href="/admin/events">Events</Link>
        </li>
        <li>
          <Link href="/admin/style">Style guide</Link>
        </li>
      </ul>
    </main>
  );
}
