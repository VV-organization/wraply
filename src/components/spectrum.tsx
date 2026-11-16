'use client';
import {MotionButton} from '@/components/motion-button';
import {useState} from 'react';
import Image from 'next/image';
import Link from '@/components/motion-button';
import type {Product} from '@/lib/types';
import {curatedColors,type DiscoveryColor} from '@/lib/discovery';
import {useShop} from './shop-provider';
import {Price} from './price';
import {CartAction} from './products';
import {Icon} from './icon';
const palettes=[{id:'pink' as const,label:'Розовые оттенки',color:'#ff77cd'},{id:'blue' as const,label:'Холодные оттенки',color:'#70a8d0'},{id:'orange' as const,label:'Тёплые оттенки',color:'#b77b50'}];
export function Spectrum({products}:{products:Product[]}){
 const [color,setColor]=useState<DiscoveryColor>('pink'),[index,setIndex]=useState(0),shop=useShop(),pool=curatedColors[color].flatMap(id=>products.filter(p=>p.id===id)),current=pool[index]??pool[0];if(!current)return null;
 return <section className="section spectrum" id="collection" aria-labelledby="spectrum-title"><div className="spectrum-top"><h2 id="spectrum-title">Скины по цвету</h2><div className="palette-choices" role="group" aria-label="Цветовая подборка">{palettes.map(p=><MotionButton aria-pressed={color===p.id} key={p.id} onClick={()=>{setColor(p.id);setIndex(0);}}><i style={{background:p.color}}/>{p.label}</MotionButton>)}</div></div><div className="spectrum-theatre"><div className="spectrum-caption"><span className="micro-label">{String(index+1).padStart(2,'0')} / {String(pool.length).padStart(2,'0')}</span><span className="weapon-name">{current.weapon}</span><h3><Link href={`/catalog/${current.id}`}>{current.finish}</Link></h3><p>{current.condition}</p><Price minor={current.priceMinor}/><div className="spectrum-actions"><CartAction product={current} added={shop.cart.some(p=>p.id===current.id)}/><MotionButton className="icon-button" aria-label={`${shop.favorites.includes(current.id)?'Убрать из избранного':'В избранное'}: ${current.name}`} aria-pressed={shop.favorites.includes(current.id)} onClick={()=>shop.toggleFavorite(current.id)}><Icon name="heart"/></MotionButton></div></div><MotionButton className="spectrum-object" onClick={()=>shop.setPreviewProduct(current)} aria-label={`Быстрый просмотр: ${current.name}`}><Image src={current.imageUrl} alt={current.name} width={900} height={650}/><span>Рассмотреть ↗</span></MotionButton><div className="spectrum-dock" role="group" aria-label="Предметы подборки">{pool.map((p,i)=><MotionButton key={p.id} aria-label={`Выбрать ${p.name}`} aria-pressed={index===i} onClick={()=>setIndex(i)}><span>{String(i+1).padStart(2,'0')}</span><Image src={p.imageUrl} alt="" width={150} height={100}/></MotionButton>)}</div></div><div className="spectrum-foot"><span>Выберите скин, чтобы рассмотреть его и узнать цену.</span><Link href="/catalog">Весь каталог ↗</Link></div></section>;
}
