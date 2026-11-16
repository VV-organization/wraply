import type {Product} from './types.ts';
import {parseAmount, sumPrices} from './money.ts';

export const traitLabels = {mono:'Монохром',cool:'Холодные оттенки',warm:'Тёплые оттенки',clean:'Лаконичное покрытие',pattern:'Выразительный рисунок'};
export type Trait=keyof typeof traitLabels;
// Deliberate editorial tags describe the visible finish, never its price or rarity.
const groups: {tags:Trait[];ids:string[]}[]=[
 {tags:["cool", "clean"],ids:["ref-cs2-4bed6f47-969b-45f6-b08e-5ecbdf867a79", "ref-cs2-8241fd48-2611-4a7b-85c0-b6ac5ecffb2b", "ref-cs2-5f74be50-1f0f-4eee-bca5-7043169df47c", "ref-cs2-e51bca0d-ef7b-4802-9aed-93e2bd3d9271", "ref-cs2-d686f4fe-ae98-41a6-8097-282f40f5a239", "ref-cs2-d9c63058-72a2-43ae-951c-1cd77c8e77e1"]},
 {tags:["cool", "pattern"],ids:["ref-cs2-b6731ad5-d48c-415c-a9e6-b345ba0c4203", "ref-cs2-d02d287d-b8fc-4d9c-b810-632a7d4af6dd", "ref-cs2-afe01a05-535f-431c-aad1-c6d3a6872343", "ref-cs2-b1d023df-05d5-450d-851b-71caca0e7220", "ref-cs2-1cec11dd-7341-4ba4-b1f7-7c615ea61a00", "ref-cs2-ba8ee685-a94d-4f3a-9ef7-50505fbf8182"]},
 {tags:["warm", "pattern"],ids:["ref-cs2-653a47b0-044c-4f59-8f45-47411e83b0be", "ref-cs2-84493726-e056-4728-9459-109e3afcad51", "ref-cs2-b16db14e-9368-4f08-98fe-56320ab20078", "ref-cs2-2a61bd3b-1dea-42e1-b352-50081f74c80d", "ref-cs2-43be6b62-fe5c-4d61-980d-06dd72afc8fb", "ref-cs2-eacc941f-a04f-4438-b217-1cdd4d5d2b73", "ref-cs2-b1533a61-f958-4ce1-879d-ad0314b13998"]},
 {tags:["warm", "clean"],ids:["ref-cs2-cb211601-3e0e-41bf-aceb-aeb1933a04c0", "ref-cs2-d394c77b-e46e-41a5-b9c3-f60cc02b2443", "ref-cs2-21c3eb4a-4dee-43b2-b399-66f2afec39ae"]},
 {tags:["cool", "clean"],ids:["ref-cs2-75a13ee6-218d-487a-aea2-3f68b18fd01a", "ref-cs2-037eea09-9892-4ac2-b7be-bdd8da465c59", "ref-cs2-03ebbfb8-eaf9-4a9a-9702-a7d5ce4ebfca", "ref-cs2-5a409367-4cc0-4f34-ad65-3e28f117741a", "ref-cs2-01483978-1e42-4a9e-92ad-a20e4b421404"]},
];
export const visualTraits:Record<string,Trait[]>=Object.fromEntries(groups.flatMap(g=>g.ids.map(id=>[id,g.tags])));
export const blindPairs = [
 [
  "ref-cs2-4bed6f47-969b-45f6-b08e-5ecbdf867a79",
  "ref-cs2-2a61bd3b-1dea-42e1-b352-50081f74c80d"
 ],
 [
  "ref-cs2-b16db14e-9368-4f08-98fe-56320ab20078",
  "ref-cs2-653a47b0-044c-4f59-8f45-47411e83b0be"
 ],
 [
  "ref-cs2-b6731ad5-d48c-415c-a9e6-b345ba0c4203",
  "ref-cs2-d02d287d-b8fc-4d9c-b810-632a7d4af6dd"
 ],
 [
  "ref-cs2-75a13ee6-218d-487a-aea2-3f68b18fd01a",
  "ref-cs2-d9c63058-72a2-43ae-951c-1cd77c8e77e1"
 ],
 [
  "ref-cs2-8241fd48-2611-4a7b-85c0-b6ac5ecffb2b",
  "ref-cs2-43be6b62-fe5c-4d61-980d-06dd72afc8fb"
 ]
] as const;
export function tasteProfile(answers:string[]) {
 const valid=[...new Set(answers.filter((id,i)=>blindPairs[i]?.some(option=>option===id)))];
 const counts=Object.fromEntries(Object.keys(traitLabels).map(t=>[t,0])) as Record<Trait,number>;
 for(const id of valid)for(const tag of visualTraits[id]??[])counts[tag]++;
 const ranked=(Object.keys(counts) as Trait[]).filter(t=>counts[t]>0).sort((a,b)=>counts[b]-counts[a]);
 return {counts,ranked,chosen:valid};
}
export function recommendBlindBundle(products:Product[],answers:string[],budgetText:string){
 const budget=parseAmount(budgetText),profile=tasteProfile(answers);
 const pools=['pistol','rifle','knife'].map(category=>products.filter(p=>p.categoryId===category&&visualTraits[p.id]));
 const score=(p:Product)=>(visualTraits[p.id]??[]).reduce((n,t)=>n+profile.counts[t],0)+(profile.chosen.includes(p.id)?3:0);
 let minimum:number|null=null,best:Product[]|null=null,bestScore=-1,bestCost=Infinity;
 for(const p of pools[0])for(const r of pools[1])for(const k of pools[2]){
  const items=[p,r,k],cost=sumPrices(items.map(item=>item.priceMinor)).rub;
  minimum=minimum===null?cost:Math.min(minimum,cost);
  if(budget===null||budget<=0||cost>budget||profile.chosen.length!==blindPairs.length)continue;
  const fit=items.reduce((n,item)=>n+score(item),0);
  if(fit>bestScore||(fit===bestScore&&cost<bestCost)){best=items;bestScore=fit;bestCost=cost;}
 }
 return {items:best,minimum,budget,profile,invalidBudget:budget===null||budget<=0};
}
export type BlindSession={step:number;answers:string[];budget:string};
export const emptyBlindSession:BlindSession={step:-1,answers:[],budget:'30 000'};
