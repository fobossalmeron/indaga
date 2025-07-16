import { Button } from "@/app/components/ui/button";
import { Star } from "@/app/components/Star";

export function PromoterCTA() {
  return (
    <div className="flex w-fit flex-col items-end md:gap-1">
      <span className="text-sm md:text-lg">¿Organizas un evento?</span>
      <a
        href="https://form.typeform.com/to/yKJnrmuc"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="link" size="sm" className="translate-x-1">
          <span className="flex items-center gap-3">
            <Star className="text-accent" size={24} /> Súmalo aquí
          </span>
        </Button>
      </a>
    </div>
  );
}
