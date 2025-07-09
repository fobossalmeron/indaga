import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <header className="animate-fadeIn flex w-full max-w-[1020px] flex-col items-center gap-4 px-5 pt-12 pb-5 sm:pt-24 lg:flex-row">
      <div
        className={
          children
            ? "flex w-full flex-col items-center gap-3 text-center lg:flex-row lg:items-start lg:justify-between lg:text-start"
            : "flex w-full flex-col text-center lg:text-start"
        }
      >
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl md:text-5xl lg:text-6xl">{title}</h1>
          {subtitle && <h2 className="text-2xl">{subtitle}</h2>}
        </div>
        {children ? children : null}
      </div>
    </header>
  );
}
