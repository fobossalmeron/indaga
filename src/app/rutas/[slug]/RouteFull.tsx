import { RouteHeader } from "./RouteHeader";
import { RouteMap } from "./RouteMap";
import { RouteSteps } from "./RouteSteps";

interface RouteFullProps {
  route: any;
}

export default function RouteFull({ route }: RouteFullProps) {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <RouteHeader
          title={route.data.title}
          subtitle={route.data.subtitle}
          description={route.data.description}
          tourBookingUrl={route.data.tour_booking_url.url}
          googleMapsUrl={route.data.google_maps_url.url}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <RouteMap embedUrl={route.data.map_embed_url.url} />
          </div>

          <div className="order-1 lg:order-2">
            <RouteSteps steps={route.data.steps} />
          </div>
        </div>
      </div>
    </div>
  );
}
