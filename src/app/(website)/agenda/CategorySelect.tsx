"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import type { HappeningDocumentData } from "../../../../prismicio-types";

interface CategorySelectProps {
  categories: readonly NonNullable<HappeningDocumentData["category"]>[];
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
        Categoría
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
