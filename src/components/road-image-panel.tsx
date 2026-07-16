import Image from "next/image";

import { cn } from "@/lib/utils";

import { RoadMateBrand } from "./roadmate-brand";

type RoadImagePanelProps = {
  className?: string;
  imageClassName?: string;
  tagline?: string;
};

export function RoadImagePanel({
  className,
  imageClassName,
  tagline,
}: RoadImagePanelProps) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      <Image
        src="/images/auth-road.webp"
        alt="An open road winding through green mountains"
        fill
        priority
        sizes="(min-width: 1024px) 58vw, 100vw"
        className={cn("object-cover", imageClassName)}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/25" />
      <RoadMateBrand className="absolute inset-x-0 top-0 px-5 pt-[max(1.25rem,env(safe-area-inset-top))] text-white sm:px-8" />
      {tagline ? (
        <p className="absolute inset-x-5 bottom-5 max-w-sm text-xl font-medium leading-snug text-white sm:inset-x-8 sm:text-2xl lg:bottom-10">
          {tagline}
        </p>
      ) : null}
    </section>
  );
}
