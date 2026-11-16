import type {Catalog} from '@/lib/types';
export function CatalogIntro({catalog,category}:{catalog:Catalog;category:string}){return <div className="catalog-intro"><h1>{catalog.categories.find(c=>c.id===category)?.name??'Каталог игровых предметов'}</h1><p>Ищите по названию покрытия или модели оружия.</p></div>;}
