import {getCatalog} from '@/lib/catalog';
import {BlindChoice} from '@/components/blind-choice';
import {Spectrum} from '@/components/spectrum';
import {ActionLink} from '@/components/ink';

export const metadata={title:'Выбор вслепую и подбор по цвету'};
export default function DiscoveryPage(){
  const {products}=getCatalog();
  return <div className="home"><header className="discovery-heading">
    <h1>Подбор <em>скинов CS2</em></h1>
    <ActionLink href="#blind-choice">Выбрать вслепую</ActionLink>
  </header><BlindChoice products={products}/><Spectrum products={products}/></div>;
}
