import snapshot from "../data/catalog.json";
import showcaseProducts from "../data/showcase-products.json";
import type { Catalog, Product } from "./types";

export function getCatalog(): Catalog {
  if (process.env.NEXT_PUBLIC_CATALOG_MODE === "live") return {mode:"unavailable",products:[],categories:[],capturedAt:""};
  const basePath=process.env.NEXT_PUBLIC_BASE_PATH??"";
  return {...snapshot,products:[...snapshot.products,...showcaseProducts].map(product=>({...product,imageUrl:basePath+product.imageUrl}))} as Catalog;
}
export const featuredIds = ["ref-cs2-eacc941f-a04f-4438-b217-1cdd4d5d2b73", "ref-cs2-01483978-1e42-4a9e-92ad-a20e4b421404", "ref-cs2-21c3eb4a-4dee-43b2-b399-66f2afec39ae", "ref-cs2-ba8ee685-a94d-4f3a-9ef7-50505fbf8182", "ref-cs2-b16db14e-9368-4f08-98fe-56320ab20078", "ref-cs2-b1d023df-05d5-450d-851b-71caca0e7220", "ref-cs2-1cec11dd-7341-4ba4-b1f7-7c615ea61a00", "ref-cs2-d9c63058-72a2-43ae-951c-1cd77c8e77e1"];
export function featuredProducts(products: Product[]) {
  return featuredIds.map(id => products.find(p=>p.id===id)).filter((p):p is Product => Boolean(p));
}
