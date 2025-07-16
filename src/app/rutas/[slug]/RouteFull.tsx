import { RouteHeader } from "./RouteHeader";
import { RouteMap } from "./RouteMap";
import { RouteSteps } from "./RouteSteps";
import { Content } from "@prismicio/client";
import { asImageSrc, asText } from "@prismicio/helpers";

interface RouteFullProps {
  route: Content.RouteDocument;
}

export default function RouteFull({ route }: RouteFullProps) {
  // Transform Prismic data structure to match the expected format
  const transformedSteps = route.data.step.map((step) => {
    const place = step.place as any;
    return {
      step_title: place.data?.nombre || "",
      step_area: place.data?.area || "",
      step_map_link: { url: place.data?.mapLink?.url || "" },
      step_link: { url: place.data?.link?.url || "" },
      step_capsule_link: { url: place.data?.capsuleLink?.url || "" },
      step_category: place.data?.categoria || "",
      step_description: place.data?.description || "",
      step_activity_description: step.description || "",
    };
  });

  const tourUrl = route.data.tour as any;

  return (
    <div className="mx-auto flex w-full flex-col items-center">
      {/* Imagen de cabecera */}
      {route.data.image?.url && (
        <img
          src={asImageSrc(route.data.image, { width: 1200, height: 180 })}
          alt={route.data.title || "Imagen de ruta"}
          className="h-[180px] w-full object-cover"
        />
      )}
      <div className="mx-auto flex w-full max-w-[1020px] flex-col items-center pb-24">
        <RouteHeader
          title={route.data.title || ""}
          subtitle={route.data.featuring || ""}
          description={[{ type: "paragraph", text: asText(route.data.description) }]}
          tourBookingUrl={tourUrl?.uid ? `/agenda/${tourUrl.uid}` : undefined}
          googleMapsUrl={(route.data.share_url as any)?.url || ""}
        />
        <div className="mt-12 grid w-full grid-cols-1 gap-12 lg:grid-cols-[1fr_350px]">
          <div className="order-2 h-full min-h-[400px] w-full lg:order-1">
            <RouteMap embedUrl={(route.data.embed_url as any)?.url || ""} />
          </div>

          <div className="order-1 w-full lg:order-2 lg:w-[350px]">
            <RouteSteps steps={transformedSteps} />
          </div>
        </div>
      </div>
    </div>
  );
}
