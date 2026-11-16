import type {Product} from "./types.ts";
import {wrapsToRub, parseAmount} from "./money.ts";

export const curatedColors = {
  "orange": [
    "ref-cs2-653a47b0-044c-4f59-8f45-47411e83b0be",
    "ref-cs2-84493726-e056-4728-9459-109e3afcad51",
    "ref-cs2-cb211601-3e0e-41bf-aceb-aeb1933a04c0",
    "ref-cs2-d394c77b-e46e-41a5-b9c3-f60cc02b2443",
    "ref-cs2-9aa0d2f9-38fe-4112-956b-8d86042c41df"
  ],
  "blue": [
    "ref-cs2-4bed6f47-969b-45f6-b08e-5ecbdf867a79",
    "ref-cs2-8241fd48-2611-4a7b-85c0-b6ac5ecffb2b",
    "ref-cs2-5f74be50-1f0f-4eee-bca5-7043169df47c",
    "ref-cs2-e51bca0d-ef7b-4802-9aed-93e2bd3d9271",
    "ref-cs2-1cec11dd-7341-4ba4-b1f7-7c615ea61a00"
  ],
  "pink": [
    "ref-cs2-03ebbfb8-eaf9-4a9a-9702-a7d5ce4ebfca",
    "ref-cs2-eacc941f-a04f-4438-b217-1cdd4d5d2b73",
    "ref-cs2-b16db14e-9368-4f08-98fe-56320ab20078",
    "ref-cs2-d686f4fe-ae98-41a6-8097-282f40f5a239",
    "ref-cs2-75a13ee6-218d-487a-aea2-3f68b18fd01a"
  ]
} as const;

export type DiscoveryColor = keyof typeof curatedColors;

export function filterDiscovery(products:Product[], color:DiscoveryColor, budgetRub:string) {
  const budget=budgetRub.trim() ? parseAmount(budgetRub) : null;
  if (budgetRub.trim() && budget===null) return {count:0,items:[] as Product[],invalidBudget:true};
  const available=new Map(products.map(product=>[product.id,product]));
  const matching=curatedColors[color]
    .map(id=>available.get(id))
    .filter((product):product is Product=>Boolean(product))
    .filter(product=>budget===null || wrapsToRub(product.priceMinor)<=budget);
  return {count:matching.length,items:matching.slice(0,3),invalidBudget:false};
}
