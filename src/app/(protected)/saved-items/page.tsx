"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import {
  getUserSavedContent,
  removeSavedEvent,
  removeSavedPlace,
} from "@/lib/user-actions";
import type { SavedEvent, SavedPlace } from "@/lib/user-actions";
import { useSession } from "@/lib/auth-client";

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
  const [activeTab, setActiveTab] = useState<"events" | "places">("events");
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
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <div className="py-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Mis favoritos
          </h1>
          <p className="text-gray-600">
            {savedContent?.totalSaved || 0} favoritos guardados
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 rounded-lg bg-white shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab("events")}
                className={`border-b-2 px-6 py-4 text-sm font-medium ${
                  activeTab === "events"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Eventos ({savedContent?.events.length || 0})
              </button>
              <button
                onClick={() => setActiveTab("places")}
                className={`border-b-2 px-6 py-4 text-sm font-medium ${
                  activeTab === "places"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                Lugares ({savedContent?.places.length || 0})
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === "events" && (
          <div className="space-y-4">
            {!savedContent?.events.length ? (
              <div className="rounded-lg bg-white py-12 text-center shadow-sm">
                <svg
                  className="mx-auto mb-4 h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No tienes eventos guardados
                </h3>
                <p className="text-gray-600">
                  Explora la agenda y guarda los eventos que te interesen.
                </p>
              </div>
            ) : (
              savedContent.events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm"
                >
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-medium text-gray-900">
                      {event.event_title}
                    </h3>
                    {event.event_date && (
                      <p className="mb-2 text-sm text-gray-600">
                        {formatDate(event.event_date)}
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
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
        )}

        {activeTab === "places" && (
          <div className="space-y-4">
            {!savedContent?.places.length ? (
              <div className="rounded-lg bg-white py-12 text-center shadow-sm">
                <svg
                  className="mx-auto mb-4 h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No tienes lugares guardados
                </h3>
                <p className="text-gray-600">
                  Explora la guía y guarda los lugares que quieras visitar.
                </p>
              </div>
            ) : (
              savedContent.places.map((place) => (
                <div
                  key={place.id}
                  className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm"
                >
                  <div className="flex-1">
                    <h3 className="mb-1 text-lg font-medium text-gray-900">
                      {place.place_name}
                    </h3>
                    {place.place_category && (
                      <span className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-800">
                        {place.place_category}
                      </span>
                    )}
                    <p className="text-sm text-gray-500">
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
        )}

        {/* Action buttons */}
        <div className="mt-8 space-y-4 text-center">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link href="/agenda">
              <Button variant="outline" className="w-full">
                Explorar Eventos
              </Button>
            </Link>
            <Link href="/guia">
              <Button variant="outline" className="w-full">
                Explorar Lugares
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
