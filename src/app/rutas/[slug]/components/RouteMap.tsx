interface RouteMapProps {
  embedUrl: string;
}

export function RouteMap({ embedUrl }: RouteMapProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Mapa de la ruta
      </h2>
      
      <div className="relative w-full h-96 lg:h-[500px] rounded-xl overflow-hidden shadow-lg">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Mapa de la ruta"
          className="absolute inset-0"
        />
      </div>
    </div>
  );
}