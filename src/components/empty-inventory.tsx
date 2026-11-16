"use client";
import Link from "@/components/motion-button";
import {Icon} from "./icon";
export function EmptyInventory(){return <section className="empty-basket"><Icon name="cart" size={32}/><h2>В корзине пока нет предметов</h2><p>Выберите скины в каталоге. В корзине вы увидите их общую стоимость в Wraps и рублях.</p><Link className="button primary" href="/catalog">Выбрать предметы <Icon name="arrow"/></Link></section>;}
