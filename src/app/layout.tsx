import type {Metadata} from 'next';
import localFont from 'next/font/local';
import {getCatalog} from '@/lib/catalog';
import {ShopProvider} from '@/components/shop-provider';
import {Header,Footer} from '@/components/shell';
import {QuickView} from '@/components/products';
import {PageReveals} from '@/components/page-reveals';
import './globals.css';
import './market.css';
import './wraply.css';
import './ui-system.css';

const sans = localFont({src:'../../public/fonts/Inter.ttf',weight:'100 900',variable:'--font-sans',display:'swap'});
export const metadata:Metadata = {
  title:{default:'Wraply — магазин скинов',template:'%s — Wraply'},
  description:'Скины CS2, Rust и Team Fortress 2. В Wraply можно сравнить два покрытия одной модели и подобрать оружие в пару к ножу.',
  icons:{icon:`${process.env.NEXT_PUBLIC_BASE_PATH??''}/favicon.svg`},
};
export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="ru" data-scroll-behavior="smooth" className={sans.variable}>
    <head><link rel="stylesheet" href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/button-motion.css`}/></head>
    <body>
    <ShopProvider catalog={getCatalog()}><Header/><main id="main">{children}</main><Footer/><QuickView/><PageReveals/></ShopProvider>
  </body></html>;
}
