import type {Catalog} from '@/lib/types';
import {Hero} from './hero';
import {Topups} from './topups';
import {FinishEdits} from './finish-edits';
import {HelpDesk} from './help-desk';
import {SkinCompare} from './skin-compare';
import {CategoryDossiers} from './category-dossiers';
import {ArsenalBuilder} from './arsenal-builder';
import {Converter} from './converter';

export function Home({catalog}:{catalog:Catalog}){
  const {products}=catalog;
  return <div className="home">
    <Hero products={products}/>
    <Topups/>
    <FinishEdits products={products}/>
    <SkinCompare products={products}/>
    <CategoryDossiers catalog={catalog}/>
    <ArsenalBuilder products={products}/>
    <Converter/>
    <HelpDesk/>
  </div>;
}
