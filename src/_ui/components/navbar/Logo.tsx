import { SwatchBook } from "lucide-react";
import Link from "next/link";

export const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <SwatchBook className="size-6" />
    <span className="text-xl font-bold">Shelfie</span>
  </Link>
);
