'use client';

import NextLink from 'next/link';
import {Children,Fragment,isValidElement,type ComponentProps,type ReactNode} from 'react';
import {Icon} from './icon';

function ActionIcon({state}: {state: 'default' | 'hover'}) {
  return <span className={`action-swap-icon is-${state}`} aria-hidden="true">
    <span className="action-swap-icon-bg" />
    <svg viewBox="0 0 14 13" fill="currentColor">
      <path d="M5.70413 12.9355L7.98926 9.94463L10.3669 6.89587L12.2298 7.74049L0 7.74049L0 5.19504L12.2298 5.19504L10.3669 6.03967L7.98926 2.99091L5.70413 0L9.04793 0L14 6.46777L9.04793 12.9355H5.70413Z" />
    </svg>
  </span>;
}

function actionLabel(children: ReactNode): ReactNode {
  return Children.map(children, child => {
    if (!isValidElement<{children?: ReactNode}>(child)) return child;
    if (child.type === Fragment) return actionLabel(child.props.children);
    return child.type === Icon ? null : child;
  });
}

function ActionContent({children}: {children: ReactNode}) {
  return <>
    <ActionIcon state="default" />
    <span className="action-swap-text"><span className="action-swap-label">{actionLabel(children)}</span></span>
    <ActionIcon state="hover" />
  </>;
}

function isAction(className = '') {
  return /(?:^|\s)(?:button|wrap-login|collage-action)(?:\s|$)/.test(className);
}

export function MotionButton({className='',children,...props}:ComponentProps<'button'>){
  const action=isAction(className);
  return <button {...props} className={`${className} ${action?'action-swap':'motion-control'}`}>
    {action?<ActionContent>{children}</ActionContent>:children}
  </button>;
}

export default function MotionLink({className='',children,...props}:ComponentProps<typeof NextLink>){
  const action=isAction(className);
  return <NextLink {...props} className={`${className} ${action?'action-swap':''}`}>
    {action?<ActionContent>{children}</ActionContent>:children}
  </NextLink>;
}
