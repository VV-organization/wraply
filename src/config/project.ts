export const project = {
  name:"Wraply",
  rublesPerWrap:1.8,
  steamFeePercent:5,
  preview: process.env.NEXT_PUBLIC_CATALOG_MODE !== "live",
} as const;
