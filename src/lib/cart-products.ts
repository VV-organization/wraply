import type {Product} from './types.ts';
function validImageUrl(value:string){
 if(/[\u0000-\u001f\u007f\\]/.test(value))return false;
 return value===""||/^https:\/\//.test(value)||/^\/(?:[a-z0-9_-]+\/)*[a-z0-9][a-z0-9._-]*\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(value);
}

export function uniqueProducts(primary:Product[],secondary:Product[]):Product[]{
 const products=new Map<string,Product>();
 for(const product of [...primary,...secondary]){
  if(!products.has(product.id))products.set(product.id,product);
 }
 return [...products.values()];
}

/** Only display metadata is persisted. These preview prices never authorize a payment. */
export function readCartProducts(raw:string):Product[]{
 try{const rows:unknown=JSON.parse(raw);if(!Array.isArray(rows))return [];
 return rows.filter((p):p is Product=>Boolean(p&&typeof p==='object'&&typeof p.id==='string'&&/^ref-(cs2|rust|tf2)-[\da-f-]{36}$/.test(p.id)&&typeof p.referenceId==='string'&&['cs2','rust','tf2'].includes(p.game)&&typeof p.name==='string'&&typeof p.imageUrl==='string'&&validImageUrl(p.imageUrl)&&typeof p.categoryId==='string'&&typeof p.condition==='string'&&typeof p.weapon==='string'&&typeof p.finish==='string'&&typeof p.description==='string'&&Number.isSafeInteger(p.priceMinor)&&p.priceMinor>=0&&p.source));
 }catch{return [];}
}
