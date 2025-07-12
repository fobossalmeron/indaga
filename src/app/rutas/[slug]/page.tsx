import { notFound } from "next/navigation";
import { RouteHeader } from "./components/RouteHeader";
import { RouteMap } from "./components/RouteMap";
import { RouteSteps } from "./components/RouteSteps";

// Mock data que imita estructura de Prismic
const mockRoutes: Record<string, any> = {
  "centro-historico": {
    data: {
      title: "Ruta Centro Histórico",
      subtitle: "Descubre la historia de Guadalajara",
      description: [
        {
          type: "paragraph",
          text: "Una experiencia única que te llevará por los lugares más emblemáticos del corazón de Guadalajara, donde la historia y la cultura se encuentran en cada rincón.",
        }
      ],
      map_embed_url: {
        url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.8966674057493!2d-103.34459772408628!3d20.676127600928892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b1f0b0b0b0b1%3A0x1234567890abcdef!2sCatedral%20de%20Guadalajara!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx"
      },
      tour_booking_url: {
        url: "https://indaga.mx/agendar-tour/centro-historico"
      },
      google_maps_url: {
        url: "https://maps.google.com/?q=Centro+Histórico+Guadalajara"
      },
      steps: [
        {
          step_title: "Catedral de Guadalajara",
          step_area: "Centro Histórico",
          step_map_link: { url: "https://maps.google.com/?q=Catedral+Guadalajara" },
          step_link: { url: "https://example.com/catedral" },
          step_capsule_link: { url: "https://example.com/capsula-catedral" },
          step_category: "Monumentos Históricos",
          step_description: "Majestuosa catedral barroca que representa el corazón religioso de la ciudad."
        },
        {
          step_title: "Teatro Degollado",
          step_area: "Centro Histórico",
          step_map_link: { url: "https://maps.google.com/?q=Teatro+Degollado" },
          step_link: { url: "https://example.com/teatro" },
          step_capsule_link: { url: "https://example.com/capsula-teatro" },
          step_category: "Espacios de Arte",
          step_description: "Icónico teatro neoclásico, hogar de las mejores producciones artísticas de la ciudad."
        },
        {
          step_title: "Palacio de Gobierno",
          step_area: "Centro Histórico",
          step_map_link: { url: "https://maps.google.com/?q=Palacio+Gobierno+Guadalajara" },
          step_link: { url: "https://example.com/palacio" },
          step_capsule_link: { url: "https://example.com/capsula-palacio" },
          step_category: "Monumentos Históricos",
          step_description: "Sede del poder ejecutivo estatal con murales históricos de José Clemente Orozco."
        },
        {
          step_title: "Plaza de Armas",
          step_area: "Centro Histórico",
          step_map_link: { url: "https://maps.google.com/?q=Plaza+Armas+Guadalajara" },
          step_link: { url: "https://example.com/plaza" },
          step_capsule_link: { url: "https://example.com/capsula-plaza" },
          step_category: "Parques",
          step_description: "Plaza principal de la ciudad, perfecta para disfrutar el ambiente tapatío."
        }
      ]
    }
  },
  "chapultepec": {
    data: {
      title: "Ruta Chapultepec",
      subtitle: "Arte, cultura y gastronomía",
      description: [
        {
          type: "paragraph",
          text: "Explora una de las zonas más vibrantes de Guadalajara, donde convergen galerías de arte, restaurantes innovadores y la vida nocturna más cosmopolita de la ciudad.",
        }
      ],
      map_embed_url: {
        url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.8966674057493!2d-103.34459772408628!3d20.676127600928892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8428b1f0b0b0b0b1%3A0x1234567890abcdef!2sChapultepec%20Guadalajara!5e0!3m2!1ses!2smx!4v1234567890123!5m2!1ses!2smx"
      },
      tour_booking_url: {
        url: "https://indaga.mx/agendar-tour/chapultepec"
      },
      google_maps_url: {
        url: "https://maps.google.com/?q=Chapultepec+Guadalajara"
      },
      steps: [
        {
          step_title: "Café Negro",
          step_area: "Chapultepec",
          step_map_link: { url: "https://maps.google.com/?q=Café+Negro+Chapultepec" },
          step_link: { url: "https://example.com/cafe-negro" },
          step_capsule_link: { url: "https://example.com/capsula-cafe" },
          step_category: "Cafeterías",
          step_description: "Café de especialidad con ambiente acogedor y tostado propio."
        },
        {
          step_title: "Galería Oscar Román",
          step_area: "Chapultepec",
          step_map_link: { url: "https://maps.google.com/?q=Galería+Oscar+Román" },
          step_link: { url: "https://example.com/galeria" },
          step_capsule_link: { url: "https://example.com/capsula-galeria" },
          step_category: "Espacios de Arte",
          step_description: "Galería de arte contemporáneo que promueve artistas locales e internacionales."
        },
        {
          step_title: "Lula Bistro",
          step_area: "Chapultepec",
          step_map_link: { url: "https://maps.google.com/?q=Lula+Bistro" },
          step_link: { url: "https://example.com/lula" },
          step_capsule_link: { url: "https://example.com/capsula-lula" },
          step_category: "Restaurantes",
          step_description: "Restaurante de cocina francesa con toques mexicanos en ambiente romántico."
        }
      ]
    }
  }
};

interface RoutePageProps {
  params: Promise<{ slug: string }>;
}

export default async function RoutePage({ params }: RoutePageProps) {
  const { slug } = await params;
  
  const route = mockRoutes[slug];
  
  if (!route) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <RouteHeader 
          title={route.data.title}
          subtitle={route.data.subtitle}
          description={route.data.description}
          tourBookingUrl={route.data.tour_booking_url.url}
          googleMapsUrl={route.data.google_maps_url.url}
        />
        
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
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

export const revalidate = 3600;