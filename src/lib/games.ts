import type {Product} from './types.ts';
export const games = [
  {id:'cs2',name:'CS2',fullName:'Counter-Strike 2',description:'Ножи, наклейки и покрытия оружия'},
  {id:'rust',name:'Rust',fullName:'Rust',description:'Одежда, броня и предметы для базы'},
  {id:'tf2',name:'Team Fortress 2',fullName:'Team Fortress 2',description:'Оружие и аксессуары для классов TF2'},
] as const;
export type GameId = typeof games[number]['id'];
export function gameId(value:string|null|undefined):GameId{return value==='rust'||value==='tf2'?value:'cs2';}
export function gameName(product:Product){return games.find(g=>g.id===(product.game??'cs2'))!.fullName;}
export function productHref(product:Product){return product.referenceId?`/item?game=${product.game}&id=${encodeURIComponent(product.referenceId)}`:`/catalog/${product.id}`;}
export function hasWear(product:Product){return (product.game??'cs2')==='cs2'&&Boolean(product.condition);}
export function itemNoun(count:number){const last=count%10,hundred=count%100;return last===1&&hundred!==11?'предмет':last>=2&&last<=4&&(hundred<12||hundred>14)?'предмета':'предметов';}
