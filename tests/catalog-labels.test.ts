import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {categoryLabel} from '../src/lib/catalog-labels.ts';

test('all imported English categories have Russian display labels', () => {
  for (const game of ['cs2', 'rust', 'tf2']) {
    const snapshot = JSON.parse(readFileSync(new URL(`../public/catalog-data/${game}.json`, import.meta.url), 'utf8'));
    for (const {name} of snapshot.categories as {name:string}[]) {
      const label = categoryLabel(name);
      assert.match(label, /[А-Яа-яЁё]/u, `${game}: ${name}`);
      if (/[А-Яа-яЁё]/u.test(name)) assert.equal(label, name);
    }
  }
});

test('unknown labels remain intact rather than being replaced by a generic category', () => {
  assert.equal(categoryLabel('New category'), 'New category');
});

test('English wear names become Russian attributes rather than part of the finish', async()=>{
 const {expandSnapshot}=await import('../src/lib/reference-catalog.ts');
 const catalog=expandSnapshot({game:'cs2',capturedAt:'2026-10-12',categories:[{id:'rifle',name:'Винтовки'}],rows:[['sample','SCAR-20 | Sirocco Script (Battle-Scarred)','rifle','',100,'SCAR-20','','SCAR-20 | Sirocco Script (Battle-Scarred)']]});
 assert.equal(catalog.products[0].condition,'Закалённое в боях');
 assert.equal(catalog.products[0].finish,'Sirocco Script');
});
