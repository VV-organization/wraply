'use client';

import {categoryLabel} from "@/lib/catalog-labels";
import {MotionButton} from '@/components/motion-button';
import { useState } from 'react';
import Image from 'next/image';
import Link from '@/components/motion-button';
import type { Product } from '@/lib/types';
import { formatMinor, wrapsToRub } from '@/lib/money';
import { useShop } from './shop-provider';
import { Icon } from './icon';
import styles from './finish-edits.module.css';

const editions = [
  {
    name:'Кобальт',theme:'blue',description:'Синие покрытия с камуфляжем и геометрическим рисунком.',
    slots:[['ref-cs2-5f74be50-1f0f-4eee-bca5-7043169df47c','ref-cs2-e51bca0d-ef7b-4802-9aed-93e2bd3d9271'],['ref-cs2-4bed6f47-969b-45f6-b08e-5ecbdf867a79','ref-cs2-8241fd48-2611-4a7b-85c0-b6ac5ecffb2b']],
  },
  {
    name:'Градиент',theme:'pink',description:'Розовые и фиолетовые переливы на клинках и оружии.',
    slots:[['ref-cs2-75a13ee6-218d-487a-aea2-3f68b18fd01a','ref-cs2-037eea09-9892-4ac2-b7be-bdd8da465c59'],['ref-cs2-03ebbfb8-eaf9-4a9a-9702-a7d5ce4ebfca','ref-cs2-5a409367-4cc0-4f34-ad65-3e28f117741a']],
  },
  {
    name:'Медь',theme:'orange',description:'Золотистые клинки и разноцветные рисунки на пистолетах.',
    slots:[['ref-cs2-cb211601-3e0e-41bf-aceb-aeb1933a04c0','ref-cs2-d394c77b-e46e-41a5-b9c3-f60cc02b2443'],['ref-cs2-653a47b0-044c-4f59-8f45-47411e83b0be','ref-cs2-84493726-e056-4728-9459-109e3afcad51']],
  },
] as const;

export function FinishEdits({products}: {products: Product[]}) {
  const shop = useShop();
  const [selected, setSelected] = useState(1);
  const [variants, setVariants] = useState<Record<string, number>>({});
  const [message, setMessage] = useState('');
  const inventory = new Map(products.map(product => [product.id, product]));
  const available = editions.map(edition => ({
    ...edition,
    slots: edition.slots.map(ids => ids.flatMap(id => inventory.get(id) ?? [])),
  })).filter(edition => edition.slots.every(slot => slot.length));
  const edition = available[selected] ?? available[0];
  if (!edition) return null;

  const pair = edition.slots.map((slot, index) => slot[(variants[edition.theme + index] ?? 0) % slot.length]);
  const missing = pair.filter(product => !shop.cart.some(item => item.id === product.id));
  const total = pair.reduce((sum, item) => sum + item.priceMinor, 0);

  function swap(index: number) {
    const key = edition.theme + index;
    const slot = edition.slots[index];
    const next = ((variants[key] ?? 0) + 1) % slot.length;
    setVariants(current => ({...current, [key]: next}));
    setMessage('В паре теперь ' + slot[next].name);
  }

  return (
    <section className={styles.edits} id="edits" aria-labelledby="finish-edits-title">
      <div className={styles.heading}>
        <h2 id="finish-edits-title">Скины <em>в пару к ножу</em></h2>
        <p>Выберите цвет пары. Нож и оружие можно менять по отдельности.</p>
      </div>
      <div className={styles.picker} role="group" aria-label="Палитра пары">
        {available.map((option, index) => (
          <MotionButton key={option.theme} data-tone={option.theme} aria-pressed={edition === option}
            onClick={() => {setSelected(index); setMessage('');}}>
            <i aria-hidden="true"/>{option.name}
          </MotionButton>
        ))}
      </div>
      <div className={styles.stack} data-tone={edition.theme}>
        <article key={edition.theme} className={styles.poster} aria-label={edition.name}>
          <div className={styles.caption}><h3>{edition.name}</h3><p>{edition.description}</p></div>
          <div className={styles.slots}>
            {pair.map((product, index) => (
              <div className={styles.slot} key={index}>
                <MotionButton className={styles.art} aria-label={'Рассмотреть ' + product.name}
                  onClick={() => shop.setPreviewProduct(product)}>
                  <Image key={product.id} src={product.imageUrl} alt="" width={640} height={420}
                    sizes="(max-width: 680px) 85vw, 36vw"/>
                  <span className={styles.eye}><Icon name="eye" size={18}/></span>
                </MotionButton>
                <div className={styles.itemLine}>
                  <span><small>{categoryLabel(product.weapon)}</small><strong>{product.finish}</strong></span>
                  {edition.slots[index].length > 1 && (
                    <MotionButton onClick={() => swap(index)} aria-label={'Заменить ' + product.name}>
                      <Icon name="swap" size={16}/> Заменить
                    </MotionButton>
                  )}
                </div>
              </div>
            ))}
          </div>
          <footer className={styles.checkout}>
            <div><small>Стоимость пары</small><strong>{formatMinor(total)} Wraps</strong>
              <span>≈ {formatMinor(wrapsToRub(total))} ₽</span></div>
            {missing.length ? (
              <MotionButton className="button primary" onClick={() => shop.addMany(missing)}>
                {missing.length === pair.length ? 'Добавить пару' : 'Добавить второй предмет'}<Icon name="plus"/>
              </MotionButton>
            ) : (
              <Link className="button primary" href="/cart" onClick={shop.dismissNotice}>
                Перейти в корзину<Icon name="arrow"/>
              </Link>
            )}
          </footer>
        </article>
      </div>
      <p className={styles.more}><Link href="/discovery">Попробовать выбор вслепую <Icon name="diagonal" size={17}/></Link></p>
      <p className="sr-only" role="status">{message}</p>
    </section>
  );
}
