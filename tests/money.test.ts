import test from 'node:test';
import assert from 'node:assert/strict';
import {parseAmount,wrapsToRub,rubToWraps,steamQuote,sumPrices} from '../src/lib/money.ts';

test('decimal parsing and bounds',()=>{
  assert.equal(parseAmount('1 000,50'),100050);
  assert.equal(parseAmount('0.01'),1);
  for(const v of ['', '-1','NaN','Infinity','1e8','1.001','999999999999999']) assert.equal(parseAmount(v),null);
});

test('one Wraps costs 1.80 RUB, including reciprocal conversion',()=>{
  assert.equal(wrapsToRub(100),180);
  assert.equal(rubToWraps(180),100);
  assert.equal(wrapsToRub(100000),180000);
  assert.equal(rubToWraps(100000),55556);
});

test('amounts round to the nearest hundredth and reject invalid input',()=>{
  assert.equal(rubToWraps(5),3);
  assert.equal(wrapsToRub(1),2);
  assert.equal(wrapsToRub(17),31);
  assert.throws(()=>wrapsToRub(-1));
  assert.throws(()=>rubToWraps(NaN));
});

test('cart rounds its combined price once',()=>{
  assert.deepEqual(sumPrices([1,1,1]),{wraps:3,rub:5});
  assert.deepEqual(sumPrices([100000,200000]),{wraps:300000,rub:540000});
});

test('Steam fee stays separate',()=>{
  assert.deepEqual(steamQuote(100000),{amount:100000,fee:5000,total:105000});
  assert.deepEqual(steamQuote(10),{amount:10,fee:1,total:11});
});
