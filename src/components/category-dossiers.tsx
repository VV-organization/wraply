'use client';

import {useState} from 'react';
import Link, {MotionButton} from '@/components/motion-button';
import Image from 'next/image';
import type {Catalog, Category} from '@/lib/types';
import {games, type GameId} from '@/lib/games';
import {categoryLabel} from '@/lib/catalog-labels';
import {Icon} from './icon';
import {Ink} from './ink';
import {GameTabs} from './game-tabs';
import {useGameCatalog} from './use-game-catalog';
import showcase from '@/data/showcase-art.json';
import categoryArt from '@/data/category-art.json';

const tf2Categories = ['Hat', 'Rocket Launcher', 'War Paint', 'Special Taunt', 'Tool'];

function CategoryLinks({catalog, game}: {catalog: Catalog; game: GameId}) {
  const categories = game === 'tf2'
    ? tf2Categories.map(name => catalog.categories.find(category => category.name === name))
      .filter((category): category is Category => Boolean(category))
    : catalog.categories;
  return <div className="class-list">
    {categories.map(category => {
      const sample = catalog.products.find(product => product.id === (showcase.categoryItems[game] as Record<string,string>)[game==='cs2'?category.id:category.name])
        ?? catalog.products.find(product => product.categoryId === category.id);
      return <Link key={category.id} className="class-line"
        href={`/catalog?game=${game}&category=${encodeURIComponent(category.id)}`}>
        {sample && <Image src={categoryArt[sample.id as keyof typeof categoryArt]?(process.env.NEXT_PUBLIC_BASE_PATH??'')+categoryArt[sample.id as keyof typeof categoryArt]:sample.imageUrl} alt="" width={180} height={106}/>}
        <span>{categoryLabel(category.name)}<Ink/></span><Icon name="diagonal"/>
      </Link>;
    })}
    <Link className="text-link category-all" href={`/catalog?game=${game}`}>
      Все предметы {games.find(item => item.id === game)?.name}<Icon name="diagonal" size={16}/>
    </Link>
  </div>;
}

function LoadedCategories({game}: {game: GameId}) {
  const {catalog, error, retry} = useGameCatalog(game);
  if (error) return <div className="category-state" role="alert">
    <p>Категории не загрузились. Попробуйте ещё раз.</p>
    <MotionButton type="button" className="button secondary" onClick={retry}>Повторить</MotionButton>
  </div>;
  if (!catalog) return <p className="category-state" role="status">Загружаем категории…</p>;
  return <CategoryLinks catalog={catalog} game={game}/>;
}

export function CategoryDossiers({catalog}: {catalog: Catalog}) {
  const [game, setGame] = useState<GameId>('cs2');
  return <section className="wrap-categories" id="categories" aria-labelledby="categories-title">
    <h2 id="categories-title">Категории скинов</h2>
    <GameTabs value={game} onChange={setGame} label="Игра для категорий"/>
    {game === 'cs2' ? <CategoryLinks catalog={catalog} game={game}/>
      : <LoadedCategories key={game} game={game}/>}
  </section>;
}
