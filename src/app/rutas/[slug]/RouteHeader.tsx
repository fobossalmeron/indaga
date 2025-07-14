"use client";
import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface RouteHeaderProps {
  title: string;
  subtitle: string;
  description: Array<{ type: string; text: string }>;
  tourBookingUrl: string;
  googleMapsUrl: string;
}

export function RouteHeader({
  title,
  subtitle,
  description,
  tourBookingUrl,
  googleMapsUrl,
}: RouteHeaderProps) {
  const descriptionText = description?.[0]?.text || "";

  return (
    <div className="space-y-6">
      {/* Botón Volver */}
      <Link 
        href="/rutas"
        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a rutas
      </Link>

      {/* Contenido principal */}
      <div className="space-y-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {title}
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            {subtitle}
          </p>
          <p className="text-base text-gray-700 leading-relaxed max-w-3xl">
            {descriptionText}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            asChild 
            size="lg" 
            className="flex items-center gap-2"
          >
            <a 
              href={tourBookingUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Calendar className="h-4 w-4" />
              Agendar tour
            </a>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            asChild
            className="flex items-center gap-2"
          >
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir en Google Maps
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}