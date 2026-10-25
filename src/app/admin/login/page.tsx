import { Button } from "@/components/Button";
import { login } from "./actions";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : "/admin";
  const hasError = params.error === "1";

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-6 py-24">
      <div>
        <h1 className="font-display text-3xl text-ink">Santosh admin</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Recipe pipeline, events, and photos.
        </p>
      </div>
      {hasError && (
        <p className="rounded-input bg-lotus px-4 py-2 text-sm text-ink">
          That password didn&apos;t match. Try again.
        </p>
      )}
      <form action={login} className="flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />
        <label className="flex flex-col gap-2 text-sm text-ink-soft">
          Admin password
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="rounded-input border border-almond bg-rice px-4 py-2 text-ink focus:outline-none focus:ring-2 focus:ring-chilli"
          />
        </label>
        <Button type="submit">Sign in</Button>
      </form>
    </main>
  );
}
