"use client";
import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/app/components/ui/button";

interface RouteHeaderProps {
  title: string;
  subtitle: string;
  description: Array<{ type: string; text: string }>;
  tourBookingUrl?: string;
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
    <div className="mt-15 w-full space-y-6">
      {/* Botón Volver */}
      <div className="flex flex-col justify-center">
        <Link
          href="/rutas"
          className="text-primary hover:text-primary/80 mb-2 inline-flex items-center transition-colors"
        >
          <Button variant="link" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver a las Rutas
          </Button>
        </Link>

        {/* Contenido principal */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-2 mb-4 text-xl">
              Ruta de <span className="font-medium">{subtitle}</span> x{" "}
              <span className="text-accent font-medium">INDAGA</span>
            </p>
            <p className="text-foreground max-w-2xl text-lg leading-relaxed">
              {descriptionText}
            </p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button variant="outline" asChild className="flex items-center gap-2">
          <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="h-4 w-4" />
            Abrir en Google Maps
          </a>
        </Button>
        {tourBookingUrl && (
          <Button asChild className="flex items-center gap-2">
            <a href={tourBookingUrl} target="_blank" rel="noopener noreferrer">
              <Calendar className="h-4 w-4" />
              Agendar tour
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
