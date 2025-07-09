"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface EventTypeSelectProps {
  eventTypes: readonly string[];
  selectedEventType: string;
  onSelectEventType: (eventType: string) => void;
  className?: string;
}

export function EventTypeSelect({
  eventTypes,
  selectedEventType,
  onSelectEventType,
  className,
}: EventTypeSelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="event-type-select" className="text-foreground">
        Tipo de evento
      </label>
      <Select value={selectedEventType} onValueChange={onSelectEventType}>
        <SelectTrigger id="event-type-select" className={className}>
          <SelectValue placeholder="Todas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todas">Todos</SelectItem>
          {eventTypes.map((eventType) => (
            <SelectItem key={eventType} value={eventType}>
              {eventType}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
