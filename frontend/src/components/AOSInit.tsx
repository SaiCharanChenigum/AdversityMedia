"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function AOSInit() {
  const pathname = usePathname();

  useEffect(() => {
    // Poll for AOS since it might load asynchronously
    if (typeof window !== 'undefined') {
        let aosCheckCount = 0;
        const checkAOS = setInterval(() => {
            aosCheckCount++;
            if ((window as any).AOS) {
                clearInterval(checkAOS);
                (window as any).AOS.init({
                    duration: 800,
                    easing: 'ease-in-out',
                    once: true,
                    mirror: false
                });
            } else if (aosCheckCount > 50) {
                clearInterval(checkAOS);
            }
        }, 100);
    }
    
    // Also initialize typed.js if present
    if (typeof window !== 'undefined') {
        let typedCheckCount = 0;
        const checkTyped = setInterval(() => {
            typedCheckCount++;
            if ((window as any).Typed) {
                clearInterval(checkTyped);
                const typedElement = document.querySelector('.hero-typed-text');
                if (typedElement && typedElement.innerHTML === '') {
                    new (window as any).Typed('.hero-typed-text', {
                        strings: [
                            'DREAM DESIGNS COME TO LIFE.',
                            'VISION BECOMES REALITY.',
                            'IDEAS TRANSFORM INTO SUCCESS.',
                            'BRAND STANDS OUT.'
                        ],
                        typeSpeed: 100,
                        backSpeed: 40,
                        loop: true,
                        showCursor: false
                    });
                }
            } else if (typedCheckCount > 50) {
                clearInterval(checkTyped); // Give up after ~5 seconds
            }
        }, 100);
    }
  }, [pathname]);

  return null;
}
