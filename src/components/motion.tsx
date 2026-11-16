import type {HTMLAttributes,ReactNode} from 'react';

export function MotionHeading({as='h2',children,...props}:HTMLAttributes<HTMLHeadingElement>&{as?:'h1'|'h2';children:ReactNode}){
  const Tag=as;
  return <Tag {...props}>{children}</Tag>;
}
export function RevealText({text}:{text:string}){return <span>{text}</span>;}
