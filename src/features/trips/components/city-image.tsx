import Image from "next/image";

import { cn } from "@/lib/utils";

import { getCityImage } from "../constants/city-images";

type CityImageProps = {
  city: string;
  className?: string;
  priority?: boolean;
  sizes: string;
};

export function CityImage({
  city,
  className,
  priority = false,
  sizes,
}: CityImageProps) {
  const image = getCityImage(city);

  if (!image) {
    return null;
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}
