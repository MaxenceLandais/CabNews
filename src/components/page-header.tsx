import type { ReactNode } from "react";

export function PageHeader({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <header className="max-w-2xl">
      <h1 className="font-serif text-3xl tracking-tight">{title}</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">{children}</p>
    </header>
  );
}
