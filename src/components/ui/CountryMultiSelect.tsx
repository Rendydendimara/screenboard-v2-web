import React, { useState } from "react";
import { Check, X, ChevronDown } from "lucide-react";
import { Button } from "./button";
import { Badge } from "./badge";
import { Checkbox } from "./checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/utils/country";

interface CountryMultiSelectProps {
  value: string[];
  onChange: (countries: string[]) => void;
  placeholder?: string;
}

export const CountryMultiSelect: React.FC<CountryMultiSelectProps> = ({
  value = [],
  onChange,
  placeholder = "Select countries...",
}) => {
  const [open, setOpen] = useState(false);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Ensure value is always an array
  const selectedCountries = Array.isArray(value) ? value : [];

  const handleSelect = (countryName: string) => {
    const newValue = selectedCountries.includes(countryName)
      ? selectedCountries.filter((item) => item !== countryName)
      : [...selectedCountries, countryName];
    onChange(newValue);
  };

  const handleRemove = (countryName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(selectedCountries.filter((item) => item !== countryName));
  };

  const getCountryByName = (name: string) => {
    return COUNTRIES.find((c) => c.name === name);
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange([]);
  };

  const handleSelectAll = () => {
    if (selectedCountries.length === COUNTRIES.length) {
      // If all selected, deselect all
      onChange([]);
    } else {
      // Select all countries
      onChange(COUNTRIES.map(c => c.name));
    }
  };

  const isAllSelected = selectedCountries.length === COUNTRIES.length;

  // Prevent wheel event from bubbling to parent
  React.useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) return;

    const handleWheel = (e: WheelEvent) => {
      e.stopPropagation();
    };

    listElement.addEventListener("wheel", handleWheel, { passive: true });

    return () => {
      listElement.removeEventListener("wheel", handleWheel);
    };
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-[28px] rounded-xl px-3 text-sm font-normal hover:bg-transparent"
          type="button"
        >
          <span className="text-slate-700">
            {selectedCountries.length === 0
              ? placeholder
              : `${selectedCountries.length} selected`}
          </span>
          <ChevronDown className="h-4 w-4 text-slate-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[320px] p-0 rounded-[12px]"
        align="start"
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col">
          {/* Clear all button */}
          {selectedCountries.length > 0 && (
            <div className="flex justify-end px-3 py-2 border-b">
              <button
                onClick={handleClearAll}
                className="text-sm text-slate-600 hover:text-slate-900"
              >
                clear all
              </button>
            </div>
          )}

          <Command className="border-none">
            <div
              ref={listRef}
              className="max-h-[300px] overflow-y-auto overscroll-contain"
              onWheel={(e) => e.stopPropagation()}
            >
              <CommandList className="max-h-full">
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup className="p-0">
                  {/* All Countries Option */}
                  <div
                    onClick={handleSelectAll}
                    className={cn(
                      "cursor-pointer px-3 py-2.5 flex items-center gap-3 border-b",
                      isAllSelected && "bg-purple-50"
                    )}
                  >
                    <Checkbox
                      checked={isAllSelected}
                      className={cn(
                        "h-5 w-5 rounded-full border-2",
                        isAllSelected
                          ? "border-purple-500 bg-purple-500"
                          : "border-slate-300 bg-white"
                      )}
                    />
                    <span className="flex-1 text-sm font-medium text-slate-900">
                      All Countries
                    </span>
                  </div>

                  {/* Individual Countries */}
                  {COUNTRIES.map((country) => {
                    const isSelected = selectedCountries.includes(country.name);
                    return (
                      <CommandItem
                        key={country.code}
                        value={country.name}
                        onSelect={() => handleSelect(country.name)}
                        className={cn(
                          "cursor-pointer px-3 py-2.5 flex items-center gap-3",
                          isSelected && "bg-purple-50"
                        )}
                      >
                        <Checkbox
                          checked={isSelected}
                          className={cn(
                            "h-5 w-5 rounded-full border-2",
                            isSelected
                              ? "border-purple-500 bg-purple-500"
                              : "border-slate-300 bg-white"
                          )}
                        />
                        <span className="flex-1 text-sm text-slate-700">
                          {country.name}
                        </span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </div>
          </Command>
        </div>
      </PopoverContent>
    </Popover>
  );
};
