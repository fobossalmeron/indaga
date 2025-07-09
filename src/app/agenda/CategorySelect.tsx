"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface CategorySelectProps {
  categories: readonly string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

export function CategorySelect({
  categories,
  selectedCategory,
  onSelectCategory,
  className,
}: CategorySelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="category-select" className="text-foreground">
        Filtrar por categoría
      </label>
      <Select value={selectedCategory} onValueChange={onSelectCategory}>
        <SelectTrigger id="category-select" className={className}>
          <SelectValue placeholder="Todas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todas">Todas</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
