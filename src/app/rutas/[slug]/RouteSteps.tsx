import { PlaceCard } from "@/app/guia/PlaceCard";
import { Content } from "@prismicio/client";
import { asLink } from "@prismicio/helpers";

interface RouteStepsProps {
  steps: Content.RouteDocumentDataStepsItem[];
}

export function RouteSteps({ steps }: RouteStepsProps) {
  if (!steps || !Array.isArray(steps)) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            {/* Número del paso */}
            <div className="absolute top-0 -left-3 z-10">
              <div className="text-foreground flex h-8 w-8 items-center justify-center rounded-full bg-[#DAE7FB] text-sm font-semibold">
                {index + 1}
              </div>
            </div>

            {/* Descripción de actividad */}
            <div className="mb-6 ml-8">
              <p className="text-foreground text-base leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* PlaceCard */}
            <div className="ml-8">
              {(() => {
                const place = step.place as unknown as Content.LugarDocument;
                const capsuleLinkUrl = asLink(place.data?.capsuleLink);
                return (
                  <PlaceCard
                    title={place.data?.nombre || ""}
                    area={place.data?.area || ""}
                    mapLink={{ url: asLink(place.data?.mapLink) || "" }}
                    link={{ url: asLink(place.data?.link) || "" }}
                    capsuleLink={capsuleLinkUrl ? { url: capsuleLinkUrl } : null}
                    category={place.data?.categoria || ""}
                    description={place.data?.description || ""}
                  />
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
