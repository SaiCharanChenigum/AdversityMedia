'use client';

import React, { useState, useEffect } from 'react';
import Link, { LinkProps } from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface LoadingLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  showSpinner?: boolean;
}

export default function LoadingLink({ children, className, style, onClick, showSpinner = true, ...props }: LoadingLinkProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    // Reset pending state when navigation completes (URL changes)
    setIsPending(false);
  }, [pathname, searchParams]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const hrefStr = props.href.toString();
    
    // Check if it's a purely internal hash link on the same page
    const isSamePageHash = hrefStr.startsWith('/#') && pathname === '/';
    
    // Only show loading if we are actually navigating away
    if (!isSamePageHash && hrefStr !== pathname) {
      setIsPending(true);
    }

    if (onClick) {
      onClick();
    }
  };

  return (
    <Link {...props} className={className} style={style} onClick={handleClick}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'inherit', gap: '8px' }}>
        {isPending && showSpinner && (
          <span 
            className="spinner-border spinner-border-sm" 
            role="status" 
            aria-hidden="true" 
            style={{ width: '1em', height: '1em' }}
          ></span>
        )}
        {children}
      </div>
    </Link>
  );
}
