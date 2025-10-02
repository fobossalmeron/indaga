import { RouteHeader } from "./RouteHeader";
import { RouteMap } from "./RouteMap";
import { RouteSteps } from "./RouteSteps";
import { Content } from "@prismicio/client";
import { asImageSrc, asText, asLink } from "@prismicio/helpers";
import Image from "next/image";

interface RouteFullProps {
  route: Content.RouteDocument;
}

export default function RouteFull({ route }: RouteFullProps) {
  // Safe because we used fetchLinks in the query
  const tour = route.data.tour as unknown as Content.HappeningDocument;

  return (
    <div className="mx-auto flex w-full flex-col items-center">
      {route.data.image?.url && (
        <Image
          src={asImageSrc(route.data.image)}
          alt={route.data.title || "Imagen de ruta"}
          width={1200}
          height={180}
          className="h-[180px] w-full object-cover"
          quality={95}
          priority
        />
      )}
      <div className="mx-auto flex w-full max-w-[1020px] flex-col items-center pb-24">
        <RouteHeader
          title={route.data.title || ""}
          subtitle={route.data.featuring || ""}
          description={[
            { type: "paragraph", text: asText(route.data.description) },
          ]}
          tourBookingUrl={tour?.uid ? `/agenda/${tour.uid}` : undefined}
          googleMapsUrl={asLink(route.data.share_url) || ""}
        />
        <div className="mt-12 grid w-full grid-cols-1 gap-12 lg:grid-cols-[1fr_350px]">
          <div className="order-2 h-full min-h-[400px] w-full lg:order-1">
            <RouteMap embedUrl={asLink(route.data.embed_url) || ""} />
          </div>

          <div className="order-1 w-full lg:order-2 lg:w-[350px]">
            <RouteSteps steps={route.data.steps} />
          </div>
        </div>
      </div>
    </div>
  );
}
