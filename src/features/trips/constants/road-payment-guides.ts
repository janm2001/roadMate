export type RoadPaymentGuide = {
  countryCode: "AT" | "HR" | "SI";
  country: string;
  paymentModel: string;
  guidance: string;
  officialInfoUrl: string;
  purchaseUrl: string | null;
  purchaseLabel: string | null;
};

export const roadPaymentGuides: RoadPaymentGuide[] = [
  {
    countryCode: "HR",
    country: "Croatia",
    paymentModel: "Distance-based motorway tolls",
    guidance:
      "Croatia does not use a motorway vignette. Pay by route and vehicle category at toll points or with an eligible ETC device.",
    officialInfoUrl: "https://www.hac.hr/en/toll/toll-rates",
    purchaseUrl: null,
    purchaseLabel: null,
  },
  {
    countryCode: "SI",
    country: "Slovenia",
    paymentModel: "E-vignette for vehicles up to 3.5 t",
    guidance:
      "Buy only from the official DARS shop and verify the registration country, plate number, toll class and validity date.",
    officialInfoUrl: "https://www.dars.si/TOLLING",
    purchaseUrl: "https://evinjeta.dars.si/en",
    purchaseLabel: "Buy from DARS",
  },
  {
    countryCode: "AT",
    country: "Austria",
    paymentModel: "Vignette plus section tolls on selected roads",
    guidance:
      "A vignette is required on most motorways. Some tunnels and Alpine sections use an additional section toll. Check online-purchase validity dates.",
    officialInfoUrl:
      "https://www.asfinag.at/en/toll/vignette-and-section-tolls/",
    purchaseUrl: "https://shop.asfinag.at/en/",
    purchaseLabel: "Buy from ASFINAG",
  },
];
