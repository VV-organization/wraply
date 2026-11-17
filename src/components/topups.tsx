"use client";
import {InkArrow} from './ink';
import {MotionButton} from '@/components/motion-button';
import {MotionHeading} from './motion';
import {useId,useRef,useState} from "react";
import {parseAmount,wrapsToRub,steamQuote,formatMinor} from "@/lib/money";
import {Icon} from "./icon";
type Profile={steamId:string;name:string;profileUrl:string};
export function BalanceForm(){
  const id=useId();const [amount,setAmount]=useState("1 000");const [method,setMethod]=useState("card");const [message,setMessage]=useState("");const minor=parseAmount(amount);
  return <form onSubmit={async e=>{e.preventDefault();if(!minor){setMessage("Введите сумму больше нуля, до двух знаков после запятой.");return;}setMessage("Пополнение баланса недоступно.");}}>
    <div className="topup-form-body"><div className="topup-amount"><label className="field-label" htmlFor={id}>Сколько Wraps зачислить</label><div className="money-input"><input id={id} value={amount} inputMode="decimal" maxLength={12} onChange={e=>{setAmount(e.target.value);setMessage("");}} required/><span>Wraps</span></div></div>
    <div className="amount-presets">{[500,1000,2500,5000].map(n=><MotionButton type="button" key={n} className={minor===n*100?"selected":""} onClick={()=>{setAmount(String(n));setMessage("");}}>{n.toLocaleString("ru-RU")}</MotionButton>)}</div>
    <fieldset className="payment-choice topup-options"><legend>Способ оплаты</legend><label className={method==="card"?"selected":""}><input type="radio" name={id+"method"} checked={method==="card"} onChange={()=>setMethod("card")}/>Банковская карта</label><label className={method==="sbp"?"selected":""}><input type="radio" name={id+"method"} checked={method==="sbp"} onChange={()=>setMethod("sbp")}/>СБП</label></fieldset>
    </div><div className="topup-total"><span>К оплате</span><strong>{minor===null?"—":formatMinor(wrapsToRub(minor))} ₽</strong></div>
    <div className="topup-form-action"><MotionButton className="button primary full wraps-topup-button" type="submit">Пополнить баланс <Icon name="arrow"/></MotionButton>{message&&<p className="form-message" role="status">{message}</p>}</div>
  </form>;
}
export function SteamForm(){
  const id=useId();const [amount,setAmount]=useState("1 000");const [steamId,setSteamId]=useState("");const [profile,setProfile]=useState<Profile|null>(null);const [busy,setBusy]=useState(false);const [message,setMessage]=useState("");const generation=useRef(0);
  const minor=parseAmount(amount);const quote=minor!==null?steamQuote(minor):null;
  function invalidate(){generation.current++;setProfile(null);setBusy(false);setMessage("");}
  async function submit(){
    setMessage("");if(!minor){setMessage("Введите сумму зачисления больше нуля.");return;}
    if(profile){setMessage("Оплата пополнения Steam недоступна.");return;}
    if(!/^\d{17}$/.test(steamId)){setMessage("Steam ID должен содержать 17 цифр.");return;}
    if(process.env.NEXT_PUBLIC_STATIC_EXPORT==="true"){setMessage("Проверка Steam ID недоступна.");return;}
    const request=++generation.current;setBusy(true);
    try{
      const response=await fetch("/api/steam/check",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({steamId})});
      const data=await response.json();if(request!==generation.current)return;
      if(!response.ok)throw new Error(data.error??"Не удалось проверить аккаунт.");
      setProfile(data);
    }catch(error){if(request===generation.current)setMessage(error instanceof Error?error.message:"Проверка Steam ID недоступна.");}
    finally{if(request===generation.current)setBusy(false);}
  }
  return <form onSubmit={e=>{e.preventDefault();void submit();}}>
    <div className="topup-form-body"><div className="steam-fields"><div><label className="field-label" htmlFor={id+"amount"}>На баланс Steam</label><div className="money-input"><input id={id+"amount"} value={amount} inputMode="decimal" maxLength={12} onChange={e=>{invalidate();setAmount(e.target.value);}} required/><span>₽</span></div></div><div><label className="field-label" htmlFor={id+"steam"}>Steam ID <span>17 цифр</span></label><input className="text-input" id={id+"steam"} value={steamId} inputMode="numeric" maxLength={17} placeholder="7656119…" onChange={e=>{invalidate();setSteamId(e.target.value);}} required/></div></div>
    <div className="amount-presets">{[500,1000,2000,5000].map(n=><MotionButton type="button" key={n} className={minor===n*100?"selected":""} onClick={()=>{invalidate();setAmount(String(n));}}>{n.toLocaleString("ru-RU")} ₽</MotionButton>)}</div>
    <div className="topup-options"><dl className="steam-summary"><div><dt>На Steam</dt><dd>{quote?formatMinor(quote.amount):"—"} ₽</dd></div><div><dt>Комиссия <span className="pink">5%</span></dt><dd>{quote?formatMinor(quote.fee):"—"} ₽</dd></div></dl>
    {profile&&<p className="profile-found"><Icon name="check" size={17}/>{profile.name} · аккаунт найден</p>}</div>
    </div><div className="topup-total"><span>К оплате</span><strong>{quote?formatMinor(quote.total):"—"} ₽</strong></div>
    <div className="topup-form-action"><MotionButton className="button primary full" disabled={busy} type="submit">{busy?"Проверяем аккаунт…":profile?"Перейти к оплате":"Проверить Steam ID"}<Icon name="arrow"/></MotionButton>{message&&<p className="form-message" role="status">{message}</p>}</div>
  </form>;
}
export function Topups(){
  const [kind,setKind]=useState("steam");
  return <section className="section topup-section" id="topups" aria-labelledby="topup-heading"><div className="section-heading"><div><MotionHeading as="h2" id="topup-heading">Пополнение баланса</MotionHeading></div><p>Узнайте стоимость пополнения Steam или баланса Wraps. Оплата недоступна.</p></div><div className="topup-tabs" role="group" aria-label="Выберите баланс">{[["steam","Steam"],["balance","Wraps"]].map(([id,label])=><MotionButton key={id} aria-pressed={kind===id} onClick={()=>setKind(id)}>{label}</MotionButton>)}</div><div className="topup-grid" data-selected={kind}><article className="topup-panel steam-panel" id="steam"><div className="topup-title"><Icon name="steam" size={24}/></div><h3>Steam<span className="topup-ink" aria-hidden="true"><InkArrow/></span></h3><p className="muted">Укажите сумму и Steam ID. Комиссия за пополнение составляет 5%.</p><SteamForm/></article><article className="topup-panel" id="balance"><div className="topup-title"><Icon name="wallet" size={24}/></div><h3>Wraps<span className="topup-ink" aria-hidden="true"><InkArrow/></span></h3><p className="muted">Введите количество Wraps, чтобы узнать стоимость в рублях.</p><BalanceForm/></article></div></section>;
}
