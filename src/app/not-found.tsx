import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Container } from "@/components/container";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <span
        aria-hidden
        className="grid size-12 place-items-center rounded-xl bg-foreground font-mono text-sm text-background"
      >
        SS
      </span>
      <p className="mt-6 font-mono text-xs tracking-wider text-brand uppercase">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">This page does not exist.</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The link may be old, or I moved the page while refining the site.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Home
        </Link>
        <Link href="/projects" className={buttonVariants({ variant: "outline" })}>
          Work
        </Link>
        <Link href="/writing" className={buttonVariants({ variant: "outline" })}>
          Writing
        </Link>
      </div>
    </Container>
  );
}
