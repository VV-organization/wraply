'use client';

import {useEffect} from 'react';

// Each control, text block and image is revealed as one readable unit.
const units = 'h1,h2,h3,h4,h5,h6,p,a,button,label,fieldset,summary,dl,table,figure,.product-card,.cart-item,.cart-notice,.skin-print,.class-line,.choice-options>button,.blind-bundle>article,.loadout-slot,.print-credit,.price,.breadcrumbs,.slot-header,.account-section-label,.cart-stage-label,.spectrum-dock,.blind-track,.compare-canvas,.float-block,.skin-specs,.converter-rule,.topup-total,.catalog-loading,.form-message,.history-empty,.dialog-symbol';
const leaves = 'img,svg,input,select,textarea,hr,legend,dt,dd';

export function PageReveals(){
  useEffect(()=>{
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const targets = new Map<HTMLElement,{visible:boolean;played:boolean;animation?:Animation}>();
    let frame = 0;
    let disposed = false;
    const visible = (node:HTMLElement) => node.checkVisibility({visibilityProperty:true});

    function finish(node:HTMLElement){
      const state=targets.get(node);
      if(!state)return;
      state.animation?.cancel();
      state.animation=undefined;
      state.played=true;
      node.dataset.reveal='done';
    }

    function play(node:HTMLElement,delay=0){
      const state=targets.get(node);
      if(!state||state.played||!visible(node))return;
      if(reduced.matches){finish(node);return;}
      state.played=true;
      node.dataset.reveal='running';
      const heading=node.matches('h1,h2,h3,h4,h5,h6');
      const picture=node.matches('img,figure,.skin-print,.product-card,.loadout-slot');
      state.animation=node.animate([
        {opacity:0,translate:heading?'0 0.7em':'0 24px',...(heading?{clipPath:'inset(0 0 100% 0)'}:{}),...(picture?{scale:'0.96'}:{})},
        {opacity:1,translate:'0 0',...(heading?{clipPath:'inset(-12% -5% -18% -5%)'}:{}),...(picture?{scale:'1'}:{})},
      ],{duration:heading?800:picture?700:520,delay,easing:'cubic-bezier(0.16,1,0.3,1)',fill:'both'});
      state.animation.onfinish=()=>finish(node);
    }

    const intersection=new IntersectionObserver(entries=>{
      let index=0;
      entries.forEach(entry=>{
        if(entry.isIntersecting)play(entry.target as HTMLElement,Math.min(index++*45,180));
      });
    },{threshold:0,rootMargin:'0px 0px -12px 0px'});

    function add(node:HTMLElement){
      if(targets.has(node)||node.closest('.catalog-sticker-layer,.legal-page,.product-card,.sr-only,.skip-link,.game-set[aria-hidden="true"],script,style'))return;
      targets.set(node,{visible:visible(node),played:false});
      node.dataset.reveal='pending';
      intersection.observe(node);
    }

    function scan(){
      frame=0;
      if(disposed)return;
      for(const [node,state] of targets){
        if(!node.isConnected){state.animation?.cancel();intersection.unobserve(node);targets.delete(node);continue;}
        const shown=visible(node);
        if(!shown&&state.visible){
          state.animation?.cancel();
          state.played=false;
          node.dataset.reveal='pending';
        }
        state.visible=shown;
      }
      const candidates=new Set<HTMLElement>();
      document.body.querySelectorAll<HTMLElement>(units+','+leaves).forEach(node=>{
        candidates.add(node.closest<HTMLElement>(units)??node);
      });
      // Includes plain status text, numeric readouts and decorative marks.
      const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
      while(walker.nextNode()){
        const text=walker.currentNode;
        if(text.textContent?.trim()&&text.parentElement){
          const parent=text.parentElement;
          if(!parent.closest('script,style,next-route-announcer'))candidates.add(parent.closest<HTMLElement>(units)??parent);
        }
      }
      candidates.forEach(node=>{
        if(!node.parentElement?.closest(units))add(node);
      });
      let index=0;
      for(const [node,state] of targets){
        if(!state.played&&state.visible){
          const rect=node.getBoundingClientRect();
          if(rect.bottom>0&&rect.top<innerHeight-12)play(node,Math.min(index++*45,180));
        }
      }
    }
    function schedule(){if(!frame)frame=requestAnimationFrame(scan);}
    const mutation=new MutationObserver(records=>{
      records=records.filter(record=>!(record.target instanceof Element&&record.target.closest('.catalog-sticker-layer')));
      if(!records.length)return;
      records.forEach(record=>{
        if(record.type==='characterData'||record.type==='childList'||record.attributeName==='src'){
          const element=record.target instanceof HTMLElement?record.target:record.target.parentElement;
          const node=element?.closest<HTMLElement>('[data-reveal]');
          const state=node&&targets.get(node);
          if(node&&state){state.animation?.cancel();state.played=false;node.dataset.reveal='pending';}
        }
      });
      schedule();
    });
    mutation.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['class','hidden','open','aria-expanded','src']});
    function focus(event:FocusEvent){
      if(event.target instanceof HTMLElement){
        for(const [node] of targets)if(node.contains(event.target))finish(node);
      }
    }
    function preference(){if(reduced.matches)for(const [node] of targets)finish(node);}
    document.addEventListener('focusin',focus);
    reduced.addEventListener('change',preference);
    scan();
    return()=>{
      disposed=true;cancelAnimationFrame(frame);mutation.disconnect();intersection.disconnect();
      document.removeEventListener('focusin',focus);reduced.removeEventListener('change',preference);

      for(const [node,state] of targets){state.animation?.cancel();delete node.dataset.reveal;}
    };
  },[]);
  return null;
}
