'use client';

import Link from '@/components/motion-button';
import {useState} from 'react';
import {Icon} from './icon';

const marks = [
  'M5 27 C50 26 108 13 156 13 C164 13 133 31 145 30 C179 28 231 6 295 7',
  'M5 22 C59 14 99 14 139 15 S237 11 295 9',
  'M5 24 C52 29 89 7 127 15 S199 27 229 17 S274 8 295 12',
];

export function Ink({wide=false, mark}:{wide?:boolean; mark?:number}){
  const drawn = mark !== undefined;
  return <svg className={`ink${wide?' ink-wide':''}${drawn?' ink-drawn':''}`} aria-hidden="true" viewBox={drawn?'0 0 300 36':'0 0 300 20'} preserveAspectRatio="none" fill="none">
    <path key={mark} pathLength="100" d={drawn?marks[mark % marks.length]:'M4 14 C76 8 189 5 296 8'} stroke="currentColor" strokeWidth={drawn?8:3.5} strokeLinecap="round" strokeLinejoin="round"/>
  </svg>;
}
export function ActionLink({href,children,draw=false,collage=true}:{href:string;children:React.ReactNode;draw?:boolean;collage?:boolean}){
  const [mark,setMark]=useState(0);
  if(collage)return <Link href={href} className="collage-action">{children}</Link>;
  return <Link href={href} className="ink-action"
    onPointerEnter={draw?event=>{if(event.pointerType==='mouse')setMark(n=>n+1);}:undefined}
    onFocus={draw?event=>{if(event.currentTarget.matches(':focus-visible'))setMark(n=>n+1);}:undefined}
  ><span>{children}<Ink mark={draw?mark:undefined}/></span><i aria-hidden="true"><Icon name="diagonal"/><Icon name="diagonal"/></i></Link>;
}
