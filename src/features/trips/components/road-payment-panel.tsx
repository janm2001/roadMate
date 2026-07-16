import { ExternalLink } from "lucide-react";

import { roadPaymentGuides } from "../constants/road-payment-guides";

export function RoadPaymentPanel({ countryCodes }: { countryCodes: string[] }) {
  const relevant = new Set(countryCodes);

  return (
    <section aria-labelledby="road-payments-heading">
      <h2 id="road-payments-heading" className="text-xl font-semibold">
        Tolls & vignettes
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Official guidance for the supported region. Confirm requirements for all
        countries crossed before departure.
      </p>
      <div className="mt-4 divide-y border-y">
        {roadPaymentGuides.map((guide) => (
          <article className="py-4" key={guide.countryCode}>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">{guide.country}</h3>
              {relevant.has(guide.countryCode) ? (
                <span className="rounded-md bg-[#e9f1eb] px-2 py-1 text-xs font-semibold text-[#315c44]">
                  Trip stop
                </span>
              ) : null}
            </div>
            <p className="mt-1 text-sm font-medium">{guide.paymentModel}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {guide.guidance}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold">
              <a href={guide.officialInfoUrl} target="_blank" rel="noreferrer">
                Official information <ExternalLink className="inline size-3.5" />
              </a>
              {guide.purchaseUrl && guide.purchaseLabel ? (
                <a href={guide.purchaseUrl} target="_blank" rel="noreferrer">
                  {guide.purchaseLabel} <ExternalLink className="inline size-3.5" />
                </a>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
