import { Header } from "@/app/components/Header";
import PortalBg from "@/assets/img/portalbg.svg";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header title="Nuestro blog" />
      <div className="mx-auto flex w-full max-w-[1020px] flex-col pb-24">
        {children}
      </div>
      <PortalBg className="animate-fadeIn absolute top-0 right-0 -z-10 h-auto w-[150vw] translate-x-1/2 pt-40" />
    </>
  );
}
