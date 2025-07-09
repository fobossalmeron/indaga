import { Header } from "@/app/components/Header";
import { Button } from "@/app/components/ui/button";
import { Star } from "@/app/components/Star";
import AgendaClientProvider from "./AgendaClientProvider";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AgendaClientProvider>
      <Header title="Agenda">
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg">¿Organizas un evento?</span>
          <a
            href="https://form.typeform.com/to/yKJnrmuc"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button variant="outline">
              <span className="flex items-center gap-3">
                <Star className="text-accent" size={24} /> Súmalo aquí
              </span>
            </Button>
          </a>
        </div>
      </Header>
      <div className="mx-auto flex w-full max-w-[1020px] flex-col pb-24">
        {children}
      </div>
    </AgendaClientProvider>
  );
}
