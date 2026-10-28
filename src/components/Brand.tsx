import { Link } from "react-router";
import { Plane } from "lucide-react";

export function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2 font-semibold text-foreground">
      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary">
        <Plane className="h-4 w-4 text-primary-foreground" />
      </span>
      <span className="brand-name hidden text-2xl leading-none sm:inline">Flight Price Notifier</span>
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t-2 border-primary py-8 text-center text-sm text-muted-foreground">
      © 2026 <span className="brand-name text-lg">Flight Price Notifier</span>
    </footer>
  );
}
