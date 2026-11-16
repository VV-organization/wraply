import test from 'node:test';
import assert from 'node:assert/strict';
import {recombine} from '../src/lib/loadout.ts';
import {sumPrices} from '../src/lib/money.ts';
import type {Product} from '../src/lib/types.ts';
const p=(id:string,categoryId:string,priceMinor:number)=>({id,categoryId,priceMinor} as Product);
const products=[p('p1','pistol',10000),p('p2','pistol',20000),p('r1','rifle',10000),p('r2','rifle',20000),p('k1','knife',10000),p('k2','knife',20000)];
const chosen=[products[0],products[2],products[4]];
test('keeps a pinned slot while replacing other slots within budget',()=>{const next=recombine(products,chosen,[true,false,false],'750');assert.ok(next);assert.equal(next[0].id,'p1');assert.notDeepEqual(next.map(p=>p.id),chosen.map(p=>p.id));assert.ok(sumPrices(next.map(p=>p.priceMinor)).rub<=75000);});
test('cannot fit a locked expensive item and rejects invalid budget',()=>{assert.equal(recombine(products,[products[1],products[2],products[4]],[true,false,false],'100'),null);assert.equal(recombine(products,chosen,[false,false,false],'abc'),null);});
test('all pinned stays unchanged',()=>{const next=recombine(products,chosen,[true,true,true],'750');assert.deepEqual(next,chosen);});
test('one feasible combination stays in budget and categories remain distinct',()=>{const next=recombine(products,chosen,[false,false,false],'540');assert.ok(next);assert.deepEqual(next.map(p=>p.categoryId),['pistol','rifle','knife']);assert.equal(sumPrices(next.map(p=>p.priceMinor)).rub,54000);});
test('supports other game categories and excludes items from another game',()=>{
 const rustProducts=[
  {...p('weapon-a','weapon',10000),game:'rust' as const},
  {...p('weapon-b','weapon',11000),game:'rust' as const},
  {...p('armor','armor',10000),game:'rust' as const},
  {...p('clothes','clothing',10000),game:'rust' as const},
  {...p('wrong-game','weapon',1),game:'tf2' as const},
 ];
 const selected=[rustProducts[0],rustProducts[2],rustProducts[3]];
 const result=recombine(rustProducts,selected,[false,true,false],'1000',['weapon','armor','clothing']);
 assert.ok(result);
 assert.deepEqual(result.map(item=>item.id),['weapon-b','armor','clothes']);
 assert.ok(result.every(item=>item.game==='rust'));
 assert.equal(recombine(rustProducts,selected,[false,false,false],'1',['weapon','armor','clothing']),null);
});
