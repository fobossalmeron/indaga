import { RouteHeader } from "./RouteHeader";
import { RouteMap } from "./RouteMap";
import { RouteSteps } from "./RouteSteps";

interface RouteFullProps {
  route: any;
}

export default function RouteFull({ route }: RouteFullProps) {
  return (
    <div className="mx-auto flex w-full flex-col items-center">
      {/* Imagen de cabecera */}
      <img
        src="https://vidauniversitaria.uanl.mx/wp-content/uploads/2020/09/gentrificacion-centro-monterrey-nuevo-leon-8.jpg"
        alt="Centro de Monterrey"
        className="h-[180px] w-full object-cover"
      />
      <div className="mx-auto flex w-full max-w-[1020px] flex-col items-center pb-24">
        <RouteHeader
          title={route.data.title}
          subtitle={route.data.subtitle}
          description={route.data.description}
          tourBookingUrl={route.data.tour_booking_url?.url}
          googleMapsUrl={route.data.google_maps_url.url}
        />
        <div className="mt-12 grid w-full grid-cols-1 gap-12 lg:grid-cols-[1fr_350px]">
          <div className="order-2 h-full min-h-[400px] w-full lg:order-1">
            <RouteMap embedUrl={route.data.map_embed_url.url} />
          </div>

          <div className="order-1 w-full lg:order-2 lg:w-[350px]">
            <RouteSteps steps={route.data.steps} />
          </div>
        </div>
      </div>
    </div>
  );
}
