"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";
import {
  getUserSavedContent,
  removeSavedEvent,
  removeSavedPlace,
} from "@/lib/user-actions";
import type { SavedEvent, SavedPlace } from "@/lib/user-actions";
import { useSession } from "@/lib/auth-client";
import { Loader2, Calendar, MapPin } from "lucide-react";

interface UserSavedContent {
  events: SavedEvent[];
  places: SavedPlace[];
  totalSaved: number;
}

export default function SavedItemsPage() {
  const [savedContent, setSavedContent] = useState<UserSavedContent | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  const { data: session, isPending } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (!isPending && userId) {
      loadSavedContent();
    }
  }, [isPending, userId]);

  const loadSavedContent = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const content = await getUserSavedContent(userId);
      setSavedContent(content);
    } catch (error) {
      console.error("Error loading saved content:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveEvent = async (eventId: string) => {
    if (removingItems.has(eventId) || !userId) return;

    setRemovingItems((prev) => new Set(prev).add(eventId));

    try {
      const result = await removeSavedEvent(userId, eventId);
      if (result.success) {
        // Reload content to update the UI
        await loadSavedContent();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error removing event:", error);
      alert("Error al eliminar el evento");
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  const handleRemovePlace = async (placeId: string) => {
    if (removingItems.has(placeId) || !userId) return;

    setRemovingItems((prev) => new Set(prev).add(placeId));

    try {
      const result = await removeSavedPlace(userId, placeId);
      if (result.success) {
        // Reload content to update the UI
        await loadSavedContent();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error removing place:", error);
      alert("Error al eliminar el lugar");
    } finally {
      setRemovingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(placeId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  if (isPending || loading || !userId) {
    return (
      <div className="min-h-screen py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="py-8 text-center">
            <Loader2 className="text-primary mx-auto mb-4 h-12 w-12 animate-spin" />
            <p>
              {isPending
                ? "Verificando sesión..."
                : "Cargando elementos guardados..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-foreground mb-2 text-3xl">Mis favoritos</h1>
          <p className="text-foreground">
            {savedContent?.totalSaved || 0} favoritos guardados
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="events" className="mb-6">
          <TabsList className="grid w-full grid-cols-2 bg-white">
            <TabsTrigger value="events">
              Eventos ({savedContent?.events.length || 0})
            </TabsTrigger>
            <TabsTrigger value="places">
              Lugares ({savedContent?.places.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-6">
            <div className="space-y-4">
              {!savedContent?.events.length ? (
                <div className="rounded-lg bg-white py-12 text-center shadow-sm">
                  <Calendar
                    className="text-primary mx-auto mb-4 h-16 w-16"
                    strokeWidth={1.3}
                  />
                  <h3 className="text-foreground mb-2 text-lg font-medium">
                    No tienes eventos guardados
                  </h3>
                  <p className="text-foreground">
                    Explora la agenda y guarda los eventos que te interesen.
                  </p>
                  <Link href="/agenda">
                    <Button variant="outline" className="mt-4 w-fit">
                      Explorar Agenda
                    </Button>
                  </Link>
                </div>
              ) : (
                savedContent.events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm"
                  >
                    <div className="flex-1">
                      <h3 className="text-foreground mb-1 text-lg font-medium">
                        {event.event_title}
                      </h3>
                      {event.event_date && (
                        <p className="text-foreground mb-2 text-sm">
                          {formatDate(event.event_date)}
                        </p>
                      )}
                      <p className="text-foreground text-sm">
                        Guardado el {formatDate(event.saved_at)}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleRemoveEvent(event.event_id)}
                      disabled={removingItems.has(event.event_id)}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      {removingItems.has(event.event_id)
                        ? "Eliminando..."
                        : "Eliminar"}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="places" className="mt-6">
            <div className="space-y-4">
              {!savedContent?.places.length ? (
                <div className="rounded-lg bg-white py-12 text-center shadow-sm">
                  <MapPin
                    className="text-primary mx-auto mb-4 h-16 w-16"
                    strokeWidth={1.3}
                  />
                  <h3 className="text-foreground mb-2 text-lg font-medium">
                    No tienes lugares guardados
                  </h3>
                  <p className="text-foreground">
                    Explora la guía y guarda los lugares que quieras visitar.
                  </p>
                  <Link href="/guia">
                    <Button variant="outline" className="mt-4 w-fit">
                      Explorar Guía
                    </Button>
                  </Link>
                </div>
              ) : (
                savedContent.places.map((place) => (
                  <div
                    key={place.id}
                    className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm"
                  >
                    <div className="flex-1">
                      <h3 className="text-foreground mb-1 text-lg font-medium">
                        {place.place_name}
                      </h3>
                      {place.place_category && (
                        <span className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                          {place.place_category}
                        </span>
                      )}
                      <p className="text-foreground text-sm">
                        Guardado el {formatDate(place.saved_at)}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleRemovePlace(place.place_id)}
                      disabled={removingItems.has(place.place_id)}
                      variant="outline"
                      className="border-red-600 text-red-600 hover:bg-red-50"
                    >
                      {removingItems.has(place.place_id)
                        ? "Eliminando..."
                        : "Eliminar"}
                    </Button>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
