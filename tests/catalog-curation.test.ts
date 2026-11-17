import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {curateCatalog} from '../src/lib/catalog-curation.ts';
import {expandSnapshot,type ReferenceSnapshot} from '../src/lib/reference-catalog.ts';
import {emptyFilters,filterProducts} from '../src/lib/filters.ts';
for(const game of ['cs2','rust','tf2'] as const)test(`${game}: editorial order preserves inventory and source prices, explicit price sort wins`,()=>{
 const snapshot=JSON.parse(readFileSync(new URL(`../public/catalog-data/${game}.json`,import.meta.url),'utf8')) as ReferenceSnapshot;
 const products=expandSnapshot(snapshot).products;
 const before=products.map(p=>p.id);
 const result=curateCatalog(products,game);
 assert.notEqual(result[0].id,products[0].id,'an actual editorial selection leads');
 assert.equal(result.length,products.length);
 assert.deepEqual(new Set(result),new Set(products),'preserve the original product objects and their facts');
 assert.deepEqual(products.map(p=>p.id),before,'do not mutate shared catalog');
 assert.deepEqual(filterProducts(result,{...emptyFilters,sort:'price-asc'}).map(p=>p.priceMinor),filterProducts(products,{...emptyFilters,sort:'price-asc'}).map(p=>p.priceMinor));
 assert.deepEqual(curateCatalog([],game),[]);
});
