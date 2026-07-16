export type CityImageAsset = {
  alt: string;
  src: string;
};

const cityImages: Record<string, CityImageAsset> = {
  graz: {
    src: "/images/graz.webp",
    alt: "Graz historic centre and the Uhrturm on Schlossberg hill",
  },
  ljubljana: {
    src: "/images/ljubljana.webp",
    alt: "Ljubljana riverfront and castle above the old town",
  },
  zagreb: {
    src: "/images/zagreb.webp",
    alt: "Zagreb Upper Town and its red-tiled skyline",
  },
};

export function getCityImage(placeLabel: string): CityImageAsset | null {
  const cityName = placeLabel.split(",")[0]?.trim().toLowerCase();
  return cityName ? (cityImages[cityName] ?? null) : null;
}
