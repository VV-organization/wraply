'use client';

import {useEffect,useRef,type ReactNode} from 'react';

const base=process.env.NEXT_PUBLIC_BASE_PATH??'';
const stickers=[
  ['stickers/rush-b.svg',false],
  ['art-direction/hero-gloves.webp',true],
  ['stickers/raid-time.svg',false],
  ['art-direction/rust-category-0.webp',true],
  ['stickers/medic.svg',false],
  ['art-direction/tf2-category-0.webp',true],
  ['art-direction/builder-knife.webp',true],
  ['art-direction/rust-category-1.webp',true],
  ['art-direction/tf2-builder-0.webp',true],
] as const;

// Sample the reference's elastic.out(2, .6) so WAAPI can animate on the
// compositor without adding a second motion library to the storefront.
const settle=Array.from({length:61},(_,index)=>{
  const t=index/60;
  const progress=t===0?0:t===1?1:2*2**(-10*t)*Math.sin((t-.05)*2*Math.PI/.6)+1;
  return {offset:t,transform:`scale(${1.3-.3*progress})`};
});

export function CatalogStickerTrail({children}:{children:ReactNode}){
  const root=useRef<HTMLDivElement>(null);
  const layer=useRef<HTMLDivElement>(null);

  useEffect(()=>{
    const area=root.current,canvas=layer.current;
    if(!area||!canvas)return;
    const disabled=matchMedia('(prefers-reduced-motion: reduce), (hover: none), (pointer: coarse)');
    const active=new Map<HTMLElement,Animation[]>();
    let previous:{x:number;y:number}|null=null,distance=0,next=0;
    let sources:HTMLImageElement[]=[];
    const prepare=()=>{
      if(disabled.matches||sources.length)return;
      sources=stickers.map(([src])=>{const image=new Image();image.src=`${base}/${src}`;image.decode().catch(()=>{});return image;});
    };
    const remove=(node:HTMLElement)=>{
      active.get(node)?.forEach(animation=>animation.cancel());
      active.delete(node);node.remove();
    };
    const clear=()=>{previous=null;distance=0;for(const node of active.keys())remove(node);};
    const observer=new IntersectionObserver(entries=>{
      if(entries.some(entry=>entry.isIntersecting))prepare();else clear();
    },{rootMargin:'400px'});
    observer.observe(area);

    function stamp(x:number,y:number,dx:number,dy:number){
      const index=next++%stickers.length;
      const source=sources[index];
      if(!source?.complete||!source.naturalWidth)return;
      // Bound the layer even when a high-frequency pointer traverses it quickly.
      if(active.size>=18)remove(active.keys().next().value!);
      const node=document.createElement('span');
      node.className='catalog-sticker';
      const scale=document.createElement('span');
      scale.className='catalog-sticker-scale';
      const image=source.cloneNode() as HTMLImageElement;
      image.alt='';image.draggable=false;
      image.className=stickers[index][1]?'catalog-sticker-cutout':'';
      scale.append(image);node.append(scale);canvas!.append(node);
      const offsetX=-50+(Math.random()-.5)*80;
      const offsetY=-50+(Math.random()-.5)*10;
      const transform=(px:number,py:number,rotation:number)=>`translate(${px}px,${py}px) translate(${offsetX}%,${offsetY}%) rotate(${rotation}deg)`;
      const fromRotation=(Math.random()-.5)*20,toRotation=(Math.random()-.5)*20;
      const drift=node.animate(Array.from({length:61},(_,i)=>{
        const progress=1-(1-i/60)**5; // power4.out
        return {offset:i/60,transform:transform(x+dx*4*progress,y+dy*4*progress,fromRotation+(toRotation-fromRotation)*progress)};
      }),{duration:1500,fill:'forwards'});
      const pop=scale.animate(settle,{duration:600,fill:'forwards'});
      // Hold until 1.6 s, then back.in(1.5): a small anticipation before shrink.
      const exit=scale.animate(Array.from({length:31},(_,i)=>{
        const t=i/30,progress=t*t*(2.5*t-1.5);
        return {offset:t,transform:`scale(${1-.5*progress})`};
      }),{delay:1600,duration:300,fill:'forwards'});
      active.set(node,[drift,pop,exit]);
      exit.onfinish=()=>remove(node);
    }
    function move(event:PointerEvent){
      if(disabled.matches||event.pointerType!=='mouse')return;
      prepare();
      const {clientX:x,clientY:y}=event;
      if(!previous){previous={x,y};return;}
      const dx=x-previous.x,dy=y-previous.y;
      distance+=Math.abs(dx)+Math.abs(dy);
      if(distance>innerWidth/8){
        distance=0;
        const bounds=area!.getBoundingClientRect();
        stamp(x-bounds.left,y-bounds.top,dx,dy);
      }
      previous={x,y};
    }
    const leave=()=>{previous=null;distance=0;};
    const visibility=()=>{if(document.hidden)clear();};
    const preference=()=>{clear();prepare();};
    area.addEventListener('pointermove',move,{passive:true});
    area.addEventListener('pointerleave',leave);
    disabled.addEventListener('change',preference);
    document.addEventListener('visibilitychange',visibility);
    return()=>{
      observer.disconnect();clear();
      area.removeEventListener('pointermove',move);
      area.removeEventListener('pointerleave',leave);
      disabled.removeEventListener('change',preference);
      document.removeEventListener('visibilitychange',visibility);
      sources=[];
    };
  },[]);

  return <div ref={root} className="wrap-footer-intro catalog-sticker-area">
    <div className="catalog-sticker-content">{children}</div>
    <div ref={layer} className="catalog-sticker-layer" aria-hidden="true"/>
  </div>;
}
