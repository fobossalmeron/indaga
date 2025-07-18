"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import type { LugarDocumentData } from "../../../../prismicio-types";

interface GuideCategorySelectProps {
  categories: readonly NonNullable<LugarDocumentData["categoria"]>[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

export function GuideCategorySelect({
  categories,
  selectedCategory,
  onSelectCategory,
  className,
}: GuideCategorySelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="category-select" className="text-foreground">
        Categoría
      </label>
      <Select value={selectedCategory} onValueChange={onSelectCategory}>
        <SelectTrigger id="category-select" className={className}>
          <SelectValue placeholder="Todas" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Todas">Todas</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat} value={cat}>
              {cat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
