'use client';
import {MotionButton} from '@/components/motion-button';
import {useMemo,useRef,useSyncExternalStore} from 'react';
import Image from 'next/image';
import Link from '@/components/motion-button';
import type {Product} from '@/lib/types';
import {blindPairs,emptyBlindSession,recommendBlindBundle,traitLabels,visualTraits,type BlindSession} from '@/lib/blind-choice';
import {formatMinor,sumPrices} from '@/lib/money';
import {useShop} from './shop-provider';
import {Price} from './price';
import {Icon} from './icon';

// Lives for this document only: client-side navigation keeps it, reload starts fresh.
let sessionSnapshot=emptyBlindSession;
const listeners=new Set<()=>void>();
function subscribe(notify:()=>void){listeners.add(notify);return()=>{listeners.delete(notify);};}
function save(session:BlindSession){sessionSnapshot=session;listeners.forEach(notify=>notify());}
export function BlindChoice({products}:{products:Product[]}){
 const shop=useShop(),title=useRef<HTMLHeadingElement>(null);
 const session=useSyncExternalStore(subscribe,()=>sessionSnapshot,()=>emptyBlindSession);
 const {step,answers,budget}=session;
 const available=useMemo(()=>new Map(products.map(p=>[p.id,p])),[products]);
 const complete=step===blindPairs.length;
 const recommendation=useMemo(()=>complete?recommendBlindBundle(products,answers,budget):null,[products,answers,budget,complete]);
 const bundle=recommendation?.items,added=!!bundle&&bundle.every(p=>shop.cart.some(c=>c.id===p.id));
 const total=bundle?sumPrices(bundle.map(p=>p.priceMinor)):null;
 const ready=blindPairs.every(pair=>pair.every(id=>available.has(id)));
 function go(next:number){save({...session,step:next});title.current?.focus();}
 function restart(){save({...emptyBlindSession,step:0,budget});title.current?.focus();}
 function choose(id:string){const next=[...answers];next[step]=id;save({...session,answers:next});}
 function reason(p:Product){
  if(recommendation?.profile.chosen.includes(p.id))return 'Вы выбрали этот скин в одном из раундов.';
  const shared=(visualTraits[p.id]??[]).filter(t=>recommendation?.profile.counts[t]).map(t=>traitLabels[t].toLowerCase());
  return shared.length?`В выбранных вами покрытиях встречается ${shared.join(', ')}.`:'Этот предмет укладывается в оставшуюся сумму.';
 }
 const picked=step>=0?answers[step]:undefined;
 return <section className="section blind-choice" id="blind-choice" aria-labelledby="blind-title">
  <header className="blind-heading"><div><h2 id="blind-title">Выбор <em>вслепую</em></h2></div><p>Выберите понравившийся скин в каждой из пяти пар. После последней пары вы увидите названия и цены.</p></header>
  {!ready?<p className="blind-unavailable">Пока не удалось собрать пять пар для раундов. <Link className="text-link" href="/catalog">Посмотреть каталог <Icon name="arrow" size={16}/></Link></p>:<>
   <div className="blind-track" aria-label="Этапы слепого выбора">{blindPairs.map((_,i)=><span key={i} className={`${answers[i]?'is-done':''} ${step===i?'is-current':''}`} aria-current={step===i?'step':undefined}><b>{String(i+1).padStart(2,'0')}</b><i/></span>)}<span className={complete?'is-current':''}><b>↗</b><i/></span></div>
   <div className="blind-stage-heading"><h3 className={step<0?'blind-intro-title':undefined} ref={title} tabIndex={-1}>{step<0?'Как устроен подбор':complete?'Выбранные скины':`Пара ${step+1} из ${blindPairs.length}`}</h3><span className="micro-label">{step<0?'5 ПАР':complete?'НАЗВАНИЯ РАСКРЫТЫ':'ЦЕНЫ И НАЗВАНИЯ СКРЫТЫ'}</span></div>
   <p className="sr-only" role="status" aria-live="polite">{complete?'Выбор раскрыт. Теперь можно посмотреть названия и подобрать комплект.':step>=0?`Пара ${step+1} из 5. ${picked?'Вариант выбран. Можно продолжить.':'Выберите один из двух вариантов.'}`:''}</p>
   {step<0?<div className="blind-intro"><div className="blind-mystery" aria-hidden="true">
    <span className="blind-mystery-caption">ПОКРЫТИЕ СКРЫТО <i/></span>
    {['/art-direction/blind-usp.webp','/art-direction/hero-rifle.webp','/art-direction/hero-knife.webp'].map((image,i)=><div className={`blind-mystery-object blind-mystery-object-${i+1}`} key={image}><Image src={`${process.env.NEXT_PUBLIC_BASE_PATH??''}${image}`} alt="" width={1536} height={1024}/><span className="blind-mystery-mark">?</span></div>)}

   </div><div className="blind-intro-copy"><p>После выбора укажите бюджет. Wraply подберёт нож, пистолет и винтовку с учётом ваших ответов.</p><MotionButton className="button primary" onClick={()=>go(0)}>Открыть первую пару <Icon name="arrow"/></MotionButton><small>Ответы сохраняются до перезагрузки страницы.</small></div></div>:
   !complete?<>
    <div className="blind-duel" role="group" aria-label={`Визуальная пара ${step+1}`}>
     {blindPairs[step].map((id,i)=>{const p=available.get(id)!;const letter=i===0?'A':'B';return <MotionButton key={`${step}-${id}`} className={`blind-option ${picked===id?'is-chosen':''}`} aria-label={`Выбрать вариант ${letter}`} aria-pressed={picked===id} aria-describedby={`blind-description-${i}`} onClick={()=>choose(id)}><span className="blind-option-top"><b>{letter}</b><span>{picked===id?'МОЙ ВЫБОР':'ПОКРЫТИЕ '+letter}</span><Icon name={picked===id?'check':'plus'} size={20}/></span><Image src={p.imageUrl} alt={(visualTraits[id]??[]).map(t=>traitLabels[t]).join(', ')} width={600} height={400} loading="eager"/><span id={`blind-description-${i}`} className="sr-only">{(visualTraits[id]??[]).map(t=>traitLabels[t]).join(', ')}</span><span className="blind-option-bottom">{picked===id?'Оставить этот':'Нравится этот'} <Icon name="diagonal" size={20}/></span></MotionButton>;})}
    </div>
    <div className="blind-round-actions"><MotionButton className="text-link" disabled={step===0} onClick={()=>go(step-1)}>← Предыдущая пара</MotionButton><MotionButton className="button primary" disabled={!picked} onClick={()=>go(step+1)}>{step===4?'Раскрыть мой выбор':'Следующая пара'} <Icon name="arrow"/></MotionButton></div>
   </>:<div className="blind-result" role="region" aria-label="Результаты выбора и подбор комплекта" tabIndex={0}>
    <div className="blind-profile"><p>В вашем выборе чаще встречаются <strong>{recommendation?.profile.ranked.slice(0,2).map(t=>traitLabels[t].toLowerCase()).join(' + ')}.</strong></p><MotionButton className="text-link" onClick={()=>go(4)}>Изменить ответы</MotionButton><MotionButton className="text-link" onClick={restart}>Пройти заново <Icon name="swap" size={15}/></MotionButton></div>
    <div className="blind-reveal">{answers.map((id,i)=>{const p=available.get(id);return p?<MotionButton key={id} onClick={()=>shop.setPreviewProduct(p)} aria-label={`Раскрытый скин ${i+1}: ${p.name}`}><span className="micro-label">ПАРА {i+1}</span><Image src={p.imageUrl} alt={p.name} width={300} height={220}/><span className="weapon-name">{p.weapon}</span><strong>{p.finish}</strong><Price minor={p.priceMinor}/><span className="blind-reveal-link">Рассмотреть ↗</span></MotionButton>:null;})}</div>
    <div className="blind-budget"><div><h3>Комплект по вашим ответам</h3><p>В комплект войдут пистолет, винтовка и нож. Если несколько сочетаний одинаково близки к вашему выбору, покажем самое доступное.</p></div><div><label htmlFor="blind-budget">Бюджет на три предмета</label><div className="money-input"><input id="blind-budget" inputMode="decimal" value={budget} maxLength={12} aria-invalid={recommendation?.invalidBudget} aria-describedby="blind-budget-status" onChange={e=>save({...session,budget:e.target.value})}/><span>₽</span></div><div className="blind-presets">{['10000','30000','100000'].map(value=><MotionButton key={value} onClick={()=>save({...session,budget:value})}>{formatMinor(Number(value)*100)} ₽</MotionButton>)}</div><p id="blind-budget-status" role="status">{recommendation?.invalidBudget?'Укажите бюджет в рублях больше нуля.':!bundle?recommendation?.minimum?`Полный комплект доступен от ${formatMinor(recommendation.minimum)} ₽. Можно изменить бюджет или открыть отдельный скин выше.`:'Сейчас не хватает доступных предметов для полного комплекта.':`Три предмета в бюджете. Остаток ${formatMinor(recommendation!.budget!-total!.rub)} ₽.`}</p></div></div>
    {bundle&&total&&<><div className="blind-bundle">{bundle.map(p=><article key={p.id}><MotionButton className="blind-bundle-image" aria-label={`Рассмотреть рекомендацию: ${p.name}`} onClick={()=>shop.setPreviewProduct(p)}><Image src={p.imageUrl} alt={p.name} width={480} height={320}/></MotionButton><span className="weapon-name">{p.weapon}</span><h4>{p.finish}</h4><p>{reason(p)}</p><Price minor={p.priceMinor}/></article>)}</div><div className="blind-total"><div><span className="micro-label">КОМПЛЕКТ ИЗ ТРЁХ ПРЕДМЕТОВ</span><Price minor={total.wraps} large/></div>{added?<Link className="button primary" href="/cart" onClick={shop.dismissNotice}>Перейти в корзину <Icon name="arrow"/></Link>:<MotionButton className="button primary" onClick={()=>shop.addMany(bundle)}>Добавить подобранный комплект <Icon name="plus"/></MotionButton>}</div></>}
   </div>}
  </>}
 </section>;
}
