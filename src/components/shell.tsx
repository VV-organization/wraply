'use client';
import {MotionButton} from '@/components/motion-button';
import Link from '@/components/motion-button';
import {usePathname} from 'next/navigation';
import {project} from '@/config/project';
import {useRef,useState} from 'react';
import {Icon} from './icon';
import {Ink,ActionLink} from './ink';
import {useShop} from './shop-provider';

function Wordmark(){
  return <span className="wrap-word"><svg aria-hidden="true" viewBox="0 0 38 31"><g fill="none" stroke="currentColor" strokeWidth="4.8" strokeLinejoin="round"><path d="m3 4 5.5 23 9-17 4 17L35 4"/><path d="m9 4 3.1 12M23 4l2.1 10"/></g></svg>wraply</span>;
}
const nav=[['/catalog','Каталог'],['/#edits','Подборки'],['/#topups','Пополнение'],['/#arsenal','Конструктор']];
export function Header(){
  const shop=useShop(),path=usePathname();
  const [open,setOpen]=useState(false);
  const toggle=useRef<HTMLButtonElement>(null);
  return <><a className="skip-link" href="#main">К содержимому</a>
    <header className="wrap-header" onKeyDown={e=>{if(open&&e.key==='Escape'){setOpen(false);toggle.current?.focus();}}}>
      <Link href="/" aria-label="Wraply — главная" onClick={()=>setOpen(false)}><Wordmark/></Link>
      <nav id="wrap-nav" aria-label="Основная навигация" className={open?'open':''}>
        {nav.map(([href,label])=><Link key={href} href={href} onClick={()=>setOpen(false)} aria-current={path===href?'page':undefined}>{label}<Ink/></Link>)}
        <Link href="/catalog?saved=1" className="mobile-saved" onClick={()=>setOpen(false)}>Избранное<Ink/></Link>
      </nav>
      <div className="wrap-tools">
        <Link className="wrap-favorites" href="/catalog?saved=1" aria-label="Избранное"><Icon name="heart"/></Link>
        <Link className="wrap-cart" href="/cart" onClick={()=>setOpen(false)} aria-label={`Корзина, товаров: ${shop.cart.length}`}><Icon name="cart"/><span>{shop.cart.length}</span></Link>
        {shop.loggedIn?<Link className="wrap-login" href="/account">Кабинет<Icon name="user" size={17}/></Link>:<MotionButton className="wrap-login" onClick={()=>{setOpen(false);shop.login();}}>Войти<Icon name="diagonal" size={16}/></MotionButton>}
        <MotionButton ref={toggle} className="wrap-toggle" aria-controls="wrap-nav" aria-expanded={open} aria-label={open?'Закрыть меню':'Открыть меню'} onClick={()=>setOpen(!open)}><Icon name={open?'close':'menu'}/></MotionButton>
      </div>
    </header></>;
}
export function Footer(){
  return <footer className="wrap-footer"><div className="wrap-footer-intro"><h2>Каталог <em>Wraply</em></h2><div className="footer-catalog-action"><span className="footer-action-measure" aria-hidden="true">{project.coverTitle}</span><ActionLink href="/catalog">Открыть каталог</ActionLink></div></div>
    <nav aria-label="Внизу страницы">{[...nav,['/discovery','Выбор вслепую'],['/account','Кабинет'],['/#faq','Помощь']].map(([url,label])=><Link key={url} href={url}>{label}</Link>)}</nav>
    <div className="wrap-footer-base"><Link href="/" aria-label="Главная Wraply"><Wordmark/></Link><span>1 Wraps = 1,8 ₽</span><a href="#main">Наверх ↑</a></div>
  </footer>;
}
