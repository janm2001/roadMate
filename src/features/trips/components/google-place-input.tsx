"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { useEffect, useRef } from "react";

import { Input } from "@/components/ui/input";

type PlaceValue = {
  googlePlaceId: string;
  placeLabel: string;
  countryCode: string;
};

type GooglePlaceInputProps = {
  apiKey: string | null;
  disabled: boolean;
  id: string;
  value: PlaceValue;
  onChange: (value: PlaceValue) => void;
};

function createManualPlaceId(label: string, countryCode: string): string {
  return `manual:${label.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}-${countryCode.toLowerCase()}`;
}

export function GooglePlaceInput({
  apiKey,
  disabled,
  id,
  onChange,
  value,
}: GooglePlaceInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!apiKey || !inputRef.current) {
      return;
    }

    let listener: google.maps.MapsEventListener | undefined;
    let cancelled = false;

    const initialize = async () => {
      setOptions({ key: apiKey, v: "weekly" });
      const { Autocomplete } = (await importLibrary(
        "places",
      )) as google.maps.PlacesLibrary;

      if (cancelled || !inputRef.current) {
        return;
      }

      const autocomplete = new Autocomplete(inputRef.current, {
        types: ["(cities)"],
        fields: ["place_id", "name", "address_components"],
      });
      listener = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        const country = place.address_components?.find((component) =>
          component.types.includes("country"),
        );

        if (place.place_id && place.name && country?.short_name) {
          onChangeRef.current({
            googlePlaceId: place.place_id,
            placeLabel: place.name,
            countryCode: country.short_name,
          });
        }
      });
    };

    void initialize();

    return () => {
      cancelled = true;
      listener?.remove();
    };
  }, [apiKey]);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_72px] gap-2">
      <Input
        ref={inputRef}
        id={id}
        className="h-11 bg-white"
        value={value.placeLabel}
        placeholder="City or place"
        autoComplete="off"
        disabled={disabled}
        onChange={(event) => {
          const placeLabel = event.target.value;
          onChange({
            ...value,
            placeLabel,
            googlePlaceId: createManualPlaceId(
              placeLabel,
              value.countryCode,
            ),
          });
        }}
      />
      <Input
        aria-label="Country code"
        className="h-11 bg-white uppercase"
        value={value.countryCode}
        maxLength={2}
        disabled={disabled}
        onChange={(event) => {
          const countryCode = event.target.value.toUpperCase();
          onChange({
            ...value,
            countryCode,
            googlePlaceId: createManualPlaceId(
              value.placeLabel,
              countryCode,
            ),
          });
        }}
      />
    </div>
  );
}
