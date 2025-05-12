import { Header } from "@/app/components/Header";
import { Button } from "@/app/components/Button";
import { Star } from "@/app/components/Star";

export default function HappeningsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header title="Agenda">
        <div className="flex flex-col items-center gap-2">
          <span className="text-lg">¿Organizas un evento?</span>
          <a
            href="https://form.typeform.com/to/yKJnrmuc"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button secondary>
              <span className="flex items-center gap-3">
                <Star color="#00808b" className="h-5 w-5 md:h-6 md:w-6" />{" "}
                Súmalo aquí
              </span>
            </Button>
          </a>
        </div>
      </Header>
      <div className="mx-auto flex w-full max-w-[1020px] flex-col pb-24">
        {children}
      </div>
    </>
  );
}
