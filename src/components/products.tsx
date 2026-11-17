"use client";
import {MotionButton} from '@/components/motion-button';
import {useEffect,useState} from "react";
import {categoryLabel} from "@/lib/catalog-labels";
import {ProductImage} from "./product-image";
import {gameName,hasWear,productHref} from "@/lib/games";
import {loadDescription} from "@/lib/reference-catalog";
import Link from "@/components/motion-button";
import type {Product} from "@/lib/types";
import {conditionCode} from "@/lib/filters";
import {CartNotice,useShop} from "./shop-provider";
import {Icon} from "./icon";
import {Price} from "./price";
import {Modal} from "./modal";
import {SkinInspection} from "./skin-inspection";
/** A finish keeps its paper colour across catalog, preview and product page. */
function posterTone(product:Product){
  const key=product.finish || product.name;
  return [...key].reduce((sum,char)=>(sum*31+char.charCodeAt(0))%997,0)%4;
}
export function ProductCard({product, imagePriority=false}:{product:Product;imagePriority?:boolean}){
  const shop=useShop();const added=shop.cart.some(p=>p.id===product.id);
  const favorite=shop.favorites.includes(product.id);
  return <article className={`product-card wrap-poster poster-tone-${posterTone(product)}`}>
    <div className="poster-art">
      <div className="product-meta"><span>{gameName(product)}</span>{product.stattrak&&<span>StatTrak™</span>}{hasWear(product)&&<abbr title={product.condition}>{conditionCode(product.condition)}</abbr>}</div>
      <MotionButton className="favorite-button" aria-label={`${favorite?"Убрать из избранного":"В избранное"}: ${product.name}`} aria-pressed={favorite} onClick={()=>shop.toggleFavorite(product.id)}><Icon name="heart" size={20}/></MotionButton>
      <h3 className="poster-title"><Link href={productHref(product)}>{product.finish}</Link></h3>
      <MotionButton className="product-image-button" aria-label={`Быстрый просмотр: ${product.name}`} onClick={()=>shop.setPreviewProduct(product)}>
        <ProductImage src={product.imageUrl.replace(/\/1024fx768f$/, "/1024x768")} alt={product.name} width={600} height={450} loading={imagePriority?"eager":"lazy"} fetchPriority={imagePriority?"high":"auto"}/>
        <span className="quick-label"><Icon name="eye" size={16}/> Рассмотреть</span>
      </MotionButton>
    </div>
    <div className="product-info">
      <div className="poster-caption"><Link className="weapon-name" href={productHref(product)}>{categoryLabel(product.weapon || product.categoryName || "")}<Icon name="diagonal" size={18}/></Link><p className="card-float">{hasWear(product)?product.condition:categoryLabel(product.rarity) || (product.categoryName!==product.weapon?categoryLabel(product.categoryName??""):'')}</p></div>
      <div className="product-bottom"><Price minor={product.priceMinor}/><CartAction product={product} compact added={added}/></div>
    </div>
  </article>;
}
export function ProductDetails({product,quick=false}:{product:Product;quick?:boolean}){
  const shop=useShop();const category=categoryLabel(product.categoryName??shop.categories.find(c=>c.id===product.categoryId)?.name??"");
  const splitTitle=product.name.includes(" | ");
  const [description,setDescription]=useState(product.description);
  useEffect(()=>{let active=true;if(product.referenceId)loadDescription(product).then(text=>{if(active)setDescription(text);}).catch(()=>{if(active)setDescription("");});return()=>{active=false;};},[product]);
  return <div className={`product-detail poster-detail poster-tone-${posterTone(product)} ${quick?"quick-detail":"full-detail"}`}>{!quick?<SkinInspection product={product}/>:<div className="detail-visual"><span className="preview-game">{gameName(product)}{hasWear(product)?` / ${conditionCode(product.condition)}`:""}</span><strong className="preview-title">{product.finish}</strong><ProductImage src={product.imageUrl.replace(/\/1024fx768f$/, "/1024x768")} alt={product.name} width={900} height={700} loading="eager"/><span className="detail-image-note">{categoryLabel(product.weapon)} <Icon name="diagonal" size={24}/></span></div>}<div className="detail-content"><span className="eyebrow pink">{category} {product.stattrak?" / STATTRAK™":""}</span>{quick?<h2>{splitTitle?<>{categoryLabel(product.weapon)}<span>{product.finish}</span></>:product.finish}</h2>:<h1>{splitTitle?<>{categoryLabel(product.weapon)}<span>{product.finish}</span></>:product.finish}</h1>}{product.condition&&<p className="muted">{product.condition}</p>}{!quick&&<div className="skin-specs"><div><span>Категория</span><strong>{category}</strong></div>{(product.stattrak||product.rarity)&&<div><span>Качество</span><strong>{product.stattrak?"StatTrak™":product.rarity}</strong></div>}</div>}{hasWear(product)&&<div className="float-block"><div><span>Степень износа / Float</span><strong>{product.float===null?"Не указан":product.float.toFixed(6)}</strong></div><div className="float-track">{product.float!==null&&<span style={{left:`${Math.min(100,product.float*100)}%`}}/>}</div><div className="float-labels"><span>FN</span><span>MW</span><span>FT</span><span>WW</span><span>BS</span></div></div>}<div className="detail-price-block"><span className="eyebrow">СТОИМОСТЬ</span><Price minor={product.priceMinor} large/></div><CartAction product={product} added={shop.cart.some(p=>p.id===product.id)}/>{quick&&<Link className="text-link" href={productHref(product)} onClick={()=>shop.setPreviewProduct(null)}>Подробнее о предмете <Icon name="diagonal" size={16}/></Link>}{description&&<p className="product-description">{description}</p>}</div></div>;
}
export function QuickView(){
  const shop=useShop();return shop.previewProduct?<Modal wide title={shop.previewProduct.name} onClose={()=>shop.setPreviewProduct(null)} footer={<CartNotice/>}><ProductDetails key={shop.previewProduct.id} product={shop.previewProduct} quick/></Modal>:null;
}

export function CartAction({product,added,compact=false}:{product:Product;added:boolean;compact?:boolean}){
 const shop=useShop();
 const className=compact?`add-button ${added?"added":""}`:"button primary full";
 return added?<Link className={className} href="/cart" aria-label={compact?`Перейти в корзину: ${product.name}`:undefined} onClick={()=>{shop.setPreviewProduct(null);shop.dismissNotice();}}>{compact?<><span>Перейти в корзину</span><Icon name="arrow" size={18}/></>:<><Icon name="cart"/>Перейти в корзину<Icon name="arrow"/></>}</Link>:<MotionButton className={className} onClick={()=>shop.add(product)} aria-label={compact?`В корзину: ${product.name}`:undefined}><Icon name={compact?"plus":"cart"}/>{compact?<span>В корзину</span>:<>В корзину<Icon name="arrow"/></>}</MotionButton>;
}
