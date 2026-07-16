import Link from "next/link";

export function AppFooter() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto flex min-h-14 max-w-6xl items-center justify-between gap-4 px-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
        <span>RoadMate</span>
        <nav className="flex gap-4" aria-label="Legal">
          <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          <Link href="/terms" className="hover:text-foreground">Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
