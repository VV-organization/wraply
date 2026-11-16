import Link from "@/components/motion-button";
export default function NotFound(){return <div className="page-container empty-state error-page"><span className="eyebrow pink">404</span><h1>Страница не найдена</h1><p>Проверьте адрес или поищите предмет в каталоге.</p><Link className="button primary" href="/catalog">Вернуться в каталог ↗</Link></div>;}
