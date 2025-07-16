import AgendaClientProvider from "./AgendaClientProvider";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AgendaClientProvider>
      <div className="mx-auto flex w-full max-w-[1020px] flex-col pb-24">
        {children}
      </div>
    </AgendaClientProvider>
  );
}
