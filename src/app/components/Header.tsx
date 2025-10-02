import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  return (
    <header className="animate-fadeIn flex w-full max-w-[1020px] flex-row items-center gap-4 px-5 pt-8 pb-5 md:pt-20">
      <div
        className={
          children
            ? "flex w-full flex-row items-center justify-between gap-4 text-start md:gap-8"
            : "flex w-full flex-col text-start"
        }
      >
        <div className="flex flex-col md:gap-2">
          <h1 className="text-2xl font-medium md:text-5xl md:font-normal lg:text-6xl">
            {title}
          </h1>
          {subtitle && <h2 className="text-base md:text-2xl">{subtitle}</h2>}
        </div>
        {children ? children : null}
      </div>
    </header>
  );
}
