import type {Product} from './types.ts';
import {parseAmount,sumPrices} from './money.ts';
export const slots=['pistol','rifle','knife'] as const;

export function recombine(products:Product[],chosen:Product[],locked:boolean[],budget:string,categories:readonly string[]=slots):Product[]|null{
 const limit=parseAmount(budget);
 if(limit===null||chosen.length!==3||categories.length!==3)return null;
 const maxBudget=limit;
 const game=chosen[0].game??'cs2';
 const pools=categories.map((category,i)=>locked[i]?[chosen[i]]:products
   .filter(p=>p.categoryId===category&&(p.game??'cs2')===game)
   .sort((a,b)=>a.priceMinor-b.priceMinor));
 if(pools.some(pool=>!pool.length))return null;
 const indices=pools.map((pool,i)=>pool.findIndex(p=>p.id===chosen[i].id));
 const size=pools[1].length*pools[2].length;
 const total=pools[0].length*size;
 const current=indices.every(i=>i>=0)?indices[0]*size+indices[1]*pools[2].length+indices[2]:-1;
 function find(start:number,end:number):Product[]|null{
  for(let a=Math.floor(start/size);a<pools[0].length;a++){
   if(sumPrices([pools[0][a].priceMinor,pools[1][0].priceMinor,pools[2][0].priceMinor]).rub>maxBudget)break;
   const firstB=a===Math.floor(start/size)?Math.floor(start%size/pools[2].length):0;
   for(let b=firstB;b<pools[1].length;b++){
    const offset=a*size+b*pools[2].length;
    if(offset>=end)return null;
    if(sumPrices([pools[0][a].priceMinor,pools[1][b].priceMinor,pools[2][0].priceMinor]).rub>maxBudget)break;
    const c=Math.max(0,start-offset);
    if(c>=pools[2].length||offset+c>=end)continue;
    const set=[pools[0][a],pools[1][b],pools[2][c]];
    if(sumPrices(set.map(p=>p.priceMinor)).rub<=maxBudget)return set;
   }
  }
  return null;
 }
 return find(current+1,total)??find(0,current+1);
}
