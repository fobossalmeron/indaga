interface RouteMapProps {
  embedUrl: string;
}

function cleanMapUrl(url: string): string {
  try {
    console.log("URL original:", url);

    // Si no es una URL de Google Maps, devolverla tal como está
    if (!url.includes("google.com/maps")) {
      console.log("No es una URL de Google Maps, devolviendo original");
      return url;
    }

    const urlObj = new URL(url);

    // Para Google My Maps (/maps/d/), agregar parámetros para vista limpia
    if (url.includes("/maps/d/")) {
      // Ocultar elementos de UI innecesarios
      urlObj.searchParams.set("noprof", "1"); // Sin perfil de usuario
      urlObj.searchParams.set("ehbc", "2E312F"); // Configuración de vista limpia

      // Configurar idioma y región
      urlObj.searchParams.set("hl", "es"); // Idioma español para UI
      urlObj.searchParams.set("gl", "mx"); // Región México

      console.log("URL de My Maps optimizada:", urlObj.toString());
      return urlObj.toString();
    }

    // Para Maps Embed API regular (/maps/embed), agregar parámetros oficiales
    if (url.includes("/maps/embed")) {
      // Establecer maptype a roadmap si no está presente
      if (!urlObj.searchParams.has("maptype")) {
        urlObj.searchParams.set("maptype", "roadmap");
      }

      // Configurar idioma y región (parámetros oficiales documentados)
      urlObj.searchParams.set("language", "en"); // Idioma inglés
      urlObj.searchParams.set("region", "mx"); // Región México

      // Reducir zoom si es muy alto para mostrar más contexto
      const currentZoom = urlObj.searchParams.get("zoom");
      if (currentZoom && parseInt(currentZoom) > 15) {
        urlObj.searchParams.set("zoom", "14");
      }
    }

    console.log("URL limpiada:", urlObj.toString());

    return urlObj.toString();
  } catch (error) {
    console.error("Error limpiando URL:", error);
    return url;
  }
}

export function RouteMap({ embedUrl }: RouteMapProps) {
  return (
    <div className="w-full min-w-0">
      <div className="bg-accent relative h-full min-h-[800px] w-full min-w-0 overflow-hidden rounded-xl lg:h-full">
        <iframe
          src={cleanMapUrl(embedUrl)}
          width="100%"
          height="100%"
          style={{
            border: 0,
            minWidth: 0,
            marginTop: "-50px", // Oculta la barra superior
            height: "calc(100% + 50px)", // Compensa el margin negativo
          }}
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
