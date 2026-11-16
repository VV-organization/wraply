import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {filterDiscovery, curatedColors} from "../src/lib/discovery.ts";
import type {Product} from "../src/lib/types.ts";

const products = [
  {id:curatedColors.orange[0],name:'Orange A',priceMinor:9305},
  {id:curatedColors.orange[1],name:'Orange B',priceMinor:54732},
  {id:curatedColors.orange[2],name:'Orange C',priceMinor:113193},
  {id:curatedColors.blue[0],name:'Blue A',priceMinor:339112},
  {id:curatedColors.pink[0],name:'Pink A',priceMinor:167414},
  {id:'unmarked',name:'Other',priceMinor:100},
] as Product[];

test("curated color groups use explicit catalog IDs", () => {
  assert.ok(curatedColors.orange.some(id=>id===products[0].id));
  assert.ok(curatedColors.blue.some(id=>id===products[3].id));
  assert.ok(curatedColors.pink.some(id=>id===products[4].id));
  assert.equal(Object.values(curatedColors).some(ids=>ids.some(id=>String(id)==="unmarked")), false);
  const catalog=JSON.parse(readFileSync(new URL("../src/data/catalog.json",import.meta.url),"utf8")) as {products:Product[]};
  const showcase=JSON.parse(readFileSync(new URL("../src/data/showcase-products.json",import.meta.url),"utf8")) as Product[];
  const catalogIds=new Set([...catalog.products,...showcase].map(product=>product.id));
  for(const ids of Object.values(curatedColors)) for(const id of ids) assert.ok(catalogIds.has(id),`Missing catalog item: ${id}`);
});

test("RUB budget uses the existing Wraps conversion on minor units", () => {
  const result=filterDiscovery(products,"orange","3 000");
  assert.deepEqual(result.items.map(p=>p.id),[products[0].id,products[1].id,products[2].id]);
  assert.equal(result.count,3);
  assert.equal(result.invalidBudget,false);
});

test("count includes every matching item while cards stop at three", () => {
  const extra=[...products,...[curatedColors.orange[3],curatedColors.orange[4]].map((id,i)=>({id,name:`Extra ${i}`,priceMinor:300000} as Product))];
  const result=filterDiscovery(extra,"orange","");
  assert.equal(result.count,5);
  assert.equal(result.items.length,3);
});

test("invalid budget and unavailable curated products have clear empty results", () => {
  assert.deepEqual(filterDiscovery(products,"blue","abc"),{count:0,items:[],invalidBudget:true});
  assert.deepEqual(filterDiscovery([],"pink",""),{count:0,items:[],invalidBudget:false});
});
