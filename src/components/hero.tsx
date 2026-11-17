'use client';
import {categoryLabel} from "@/lib/catalog-labels";
import {MotionButton} from '@/components/motion-button';
import Image from 'next/image';
import Link from '@/components/motion-button';
import {useState} from 'react';
import {project} from '@/config/project';
import type {Product} from '@/lib/types';
import {useShop} from './shop-provider';
import {Ink,ActionLink} from './ink';
import {Icon} from './icon';

const games=[['cs2','Counter-Strike 2'],['rust','Rust'],['tf2','Team Fortress 2']];
function GameMark({game}:{game:string}){
  if(game==='rust') return <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M2 2h28v28H2z"/><g stroke="var(--bg)" strokeWidth="4"><path d="m9 9 14 14m-1-15-8 12m-6-2 11-2"/></g></svg>;
  if(game==='tf2') return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="currentColor"/><g stroke="var(--bg)" strokeWidth="3"><path d="m3 13 26 6M18 3l-4 26"/></g><circle cx="16" cy="16" r="4" fill="var(--bg)"/></svg>;
  return <svg viewBox="0 0 36 32" aria-hidden="true"><path fill="currentColor" d="m19 5 3 1 1 5 11 1v2h-9l-4 3-4-2-1 4 5 8-3 1-7-7-5 8-4-1 6-13 2-5 6-1z"/></svg>;
}
function GameRail(){
  const [paused,setPaused]=useState(false);
  return <nav aria-label="Каталоги игр" className="game-rail" data-paused={paused}>
    <div className="game-window"><div className="game-track">{[false,true].map(duplicate=>
      <div className="game-set" key={String(duplicate)} aria-hidden={duplicate||undefined}>{games.map(([id,name])=>
        <Link href={`/catalog?game=${id}`} key={id} tabIndex={duplicate?-1:undefined} className={`game-name game-${id}`}>
          <GameMark game={id}/><span>{name}</span><Icon name="diagonal" size={15}/>
        </Link>)}
      </div>)}</div></div>
    <MotionButton type="button" className="rail-pause" aria-label={paused?'Запустить ленту игр':'Остановить ленту игр'} onClick={()=>setPaused(!paused)}>
      <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" fill="currentColor">{paused?<path d="m4 2 9 6-9 6z"/>:<path d="M4 2h3v12H4zm5 0h3v12H9z"/>}</svg>
    </MotionButton>
  </nav>;
}
const coverIds=[
  ['ref-cs2-eacc941f-a04f-4438-b217-1cdd4d5d2b73','ref-cs2-01483978-1e42-4a9e-92ad-a20e4b421404'],
  ['ref-cs2-21c3eb4a-4dee-43b2-b399-66f2afec39ae','ref-cs2-ba8ee685-a94d-4f3a-9ef7-50505fbf8182'],
];
export function Hero({products}:{products:Product[]}){
  const {setPreviewProduct}=useShop();
  const [mark,setMark]=useState(0);
  const [active,setActive]=useState<string|null>(null);
  return <><section className="wrap-cover" aria-labelledby="cover-title">
    <div className="cover-copy">
      <h1 id="cover-title" aria-label="Скины для CS2, Rust и TF2">
        <span className="cover-sans" aria-hidden="true">{project.coverTitle}</span>
        <em aria-hidden="true" onPointerEnter={event=>{if(event.pointerType==='mouse')setMark(n=>n+1);}}>CS2, Rust и TF2<Ink wide mark={mark}/></em>
      </h1>
      <p className="cover-description">Сравните покрытия, подберите пару к ножу или соберите комплект под свой бюджет.</p>
      <ActionLink href="/catalog" collage>Открыть каталог</ActionLink>
    </div>
    {coverIds.map((ids,group)=><div className={`cover-collage collage-${group}`} key={group} data-active={active&&ids.includes(active)?active:undefined} onPointerLeave={()=>setActive(null)}>
      {ids.map((id,index)=>{
        const p=products.find(item=>item.id===id);
        return p&&<MotionButton className={`skin-print print-${group} collage-card-${index}`} key={id}
          data-selected={active===id} data-peer={!!active&&ids.includes(active)&&active!==id}
          onPointerEnter={event=>{if(event.pointerType==='mouse')setActive(id);}}
          onFocus={()=>setActive(id)} onBlur={()=>setActive(null)}
          onClick={()=>setPreviewProduct(p)} aria-label={`Рассмотреть ${p.name}`}>
          <span className="print-photo"><span aria-hidden="true" className="print-type">{p.finish}</span><Image src={p.imageUrl} alt="" width={520} height={400} loading="eager"/></span>
          <span className="print-credit"><span>{categoryLabel(p.weapon)} / {p.finish}</span><Icon name="diagonal" size={14}/></span>
        </MotionButton>;
      })}
      <span className="cover-sticker" aria-hidden="true"><svg viewBox="0 0 110 100" fill="none"><path d="M15 20 40 12 53 4 66 15 95 14 99 39 108 56 95 72 93 90 68 88 51 98 36 86 11 89 13 65 3 49 14 38Z" fill="currentColor"/><path d="m25 28 9 47 20-37 10 37 22-48" stroke="#161116" strokeWidth="8" strokeLinejoin="round"/><path d="m30 21 5 17m32-17 4 15" stroke="#161116" strokeWidth="5"/></svg></span>
    </div>)}
  </section><GameRail/></>;
}
