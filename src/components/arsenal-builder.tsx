'use client';
import {categoryLabel} from "@/lib/catalog-labels";
import {MotionButton} from '@/components/motion-button';
import {useMemo,useState} from 'react';
import Image from 'next/image';
import Link from '@/components/motion-button';
import type {Product} from '@/lib/types';
import {duoQuote} from '@/lib/duo';
import {recombine} from '@/lib/loadout';
import {formatMinor,wrapsToRub} from '@/lib/money';
import {Icon} from './icon';
import {ChoicePanel} from './choice-panel';
import {Price} from './price';
import {useShop} from './shop-provider';
import {GameTabs} from './game-tabs';
import {useGameCatalog} from './use-game-catalog';
import showcase from '@/data/showcase-art.json';
import type {GameId} from '@/lib/games';

const configurations={
 cs2:{categories:['pistol','rifle','knife'],labels:['Пистолет','Винтовка','Нож']},
 rust:{categories:['Weapon','Armor','Clothing'],labels:['Оружие','Броня','Одежда']},
 tf2:{categories:['Hat','Cosmetic Item','War Paint'],labels:['Головной убор','Косметический предмет','Боевая краска']},
};
export function ArsenalBuilder({products}:{products:Product[]}){
 const [game,setGame]=useState<GameId>('cs2');
 return <section className="section arsenal" id="arsenal" aria-labelledby="arsenal-title">
  <div className="section-heading"><div><h2 id="arsenal-title">Конструктор комплекта</h2></div>
   <p>Выберите игру и укажите бюджет. Закрепите предметы, которые хотите оставить, и подберите остальные.</p></div>
  <GameTabs value={game} onChange={setGame} label="Игра для комплекта"/>
  {game==='cs2'?<Builder key={game} products={products} game={game}/>:<GameBuilder key={game} game={game}/>}
 </section>;
}
function GameBuilder({game}:{game:GameId}){
 const {catalog,error,retry}=useGameCatalog(game);
 if(error)return <div role="alert"><p>Предметы не загрузились.</p><MotionButton className="button secondary" onClick={retry}>Повторить</MotionButton></div>;
 if(!catalog)return <p role="status">Загружаем предметы…</p>;
 return <Builder products={catalog.products} game={game}/>;
}
function Builder({products,game}:{products:Product[];game:GameId}){
 const shop=useShop(),[ids,setIds]=useState<string[]>([]),[locked,setLocked]=useState([false,false,false]),[budget,setBudget]=useState('30 000'),[message,setMessage]=useState('');
 const {categories,labels}=configurations[game];
 const pools=useMemo(()=>categories.map(s=>products.filter(p=>(game==='cs2'?p.categoryId:p.categoryName)===s)
   .sort((a,b)=>a.priceMinor-b.priceMinor)),[products,game,categories]);
 const categoryIds=pools.map(pool=>pool[0]?.categoryId??'');
 const chosen=pools.map((pool,i)=>pool.find(p=>p.id===ids[i])??pool.find(p=>p.id===showcase.builderItems[game][i])??pool[0]);if(chosen.some(p=>!p))return null;
 const quote=duoQuote(chosen.map(p=>p.priceMinor),budget),added=chosen.every(p=>shop.cart.some(c=>c.id===p.id));
 function pick(){const next=recombine(products,chosen,locked,budget,categoryIds);if(!next){setMessage('Для такого сочетания нужен больший бюджет. Можно изменить сумму или снять закрепление.');return;}const changed=next.some((p,i)=>p.id!==chosen[i].id);setIds(next.map(p=>p.id));setMessage(changed?'Комплект обновлён.':'При этом бюджете других вариантов нет. Увеличьте сумму или снимите закрепление.');}
 return <div className="arsenal-workspace"><div className="loadout-slots">{chosen.map((p,i)=><article className={`loadout-slot ${locked[i]?'is-pinned':''}`} key={categoryIds[i]}><div className="slot-header"><span>0{i+1} / {labels[i]}</span><MotionButton aria-label={`${locked[i]?'Открепить':'Закрепить'}: ${labels[i]}`} aria-pressed={locked[i]} onClick={()=>{setLocked(locked.map((v,n)=>n===i?!v:v));setMessage('');}}><Icon name={locked[i]?'check':'plus'} size={15}/>{locked[i]?'Закреплён':'Закрепить'}</MotionButton></div><MotionButton className="slot-object" aria-label={`Рассмотреть комплект: ${p.name}`} onClick={()=>shop.setPreviewProduct(p)}><Image src={p.imageUrl} alt={p.name} width={400} height={300}/></MotionButton><span className="weapon-name">{categoryLabel(p.weapon)}</span><h3>{p.finish}</h3><Price minor={p.priceMinor}/><ChoicePanel label={`${labels[i]} в комплекте`} value={p.id} disabled={locked[i]} options={pools[i].map(p=>({value:p.id,label:`${categoryLabel(p.weapon)} · ${p.finish}`,detail:`${formatMinor(wrapsToRub(p.priceMinor))} ₽ · ${p.condition}`,image:p.imageUrl}))} onChange={value=>{setIds(chosen.map((p,n)=>n===i?value:p.id));setMessage('');}}/></article>)}</div><div className="loadout-console"><div className="loadout-budget"><label htmlFor="arsenal-budget">Бюджет комплекта</label><div className="money-input"><input id="arsenal-budget" value={budget} inputMode="decimal" maxLength={12} aria-invalid={quote.budget===null} onChange={e=>{setBudget(e.target.value);setMessage('');}}/><span>₽</span></div><MotionButton className="button secondary" onClick={pick}><Icon name="swap" size={18}/>Подобрать комплект</MotionButton></div><div className="loadout-summary"><div><span className="fine-print">ТРИ ПРЕДМЕТА</span><Price minor={quote.wraps} large/></div><div><div className={`budget-status ${quote.withinBudget?'within':''}`} role="status">{quote.remaining===null?'Введите бюджет в рублях':quote.withinBudget?`В бюджете · остаток ${formatMinor(quote.remaining)} ₽`:`Выше бюджета на ${formatMinor(-quote.remaining)} ₽`}</div>{added?<Link href="/cart" className="button primary full" onClick={shop.dismissNotice}>Перейти в корзину <Icon name="arrow"/></Link>:<MotionButton className="button primary full" disabled={!quote.withinBudget} onClick={()=>shop.addMany(chosen)}>Добавить комплект <Icon name="plus"/></MotionButton>}</div></div></div>{message&&<p className="loadout-message" role="status">{message}</p>}</div>;
}
