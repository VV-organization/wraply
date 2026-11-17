import Link from 'next/link';
import type {ReactNode} from 'react';
export function LegalPage({title,children}:{title:string;children:ReactNode}){
 return <div className="page-container legal-page"><Link href="/" className="text-link">← На главную</Link><article><header><h1>{title}</h1></header>{children}<nav className="legal-related" aria-label="Юридические документы"><Link href="/terms">Пользовательское соглашение</Link><Link href="/privacy">Политика конфиденциальности</Link></nav></article></div>;
}
