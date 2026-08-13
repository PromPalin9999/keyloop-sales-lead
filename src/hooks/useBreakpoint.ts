import { useSyncExternalStore } from 'react';

const bp = { sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1600 } as const;

type Snap = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  isExtraLargeDesktop: boolean;
  isExtraExtraLargeDesktop: boolean;
};

let mqls: {
  smUp: MediaQueryList;
  mdUp: MediaQueryList;
  lgUp: MediaQueryList;
  xlUp: MediaQueryList;
  xxlUp: MediaQueryList;
} | null = null;

const subscribers = new Set<() => void>();

function ensureMqls() {
  if (typeof window === 'undefined') return null;
  if (mqls) return mqls;
  mqls = {
    smUp: window.matchMedia(`(min-width: ${bp.sm}px)`),
    mdUp: window.matchMedia(`(min-width: ${bp.md}px)`),
    lgUp: window.matchMedia(`(min-width: ${bp.lg}px)`),
    xlUp: window.matchMedia(`(min-width: ${bp.xl}px)`),
    xxlUp: window.matchMedia(`(min-width: ${bp.xxl}px)`),
  };
  const handler = () => maybeUpdateSnapshot();
  add(mqls.smUp, handler);
  add(mqls.mdUp, handler);
  add(mqls.lgUp, handler);
  add(mqls.xlUp, handler);
  add(mqls.xxlUp, handler);
  return mqls;
}

function add(mql: MediaQueryList, cb: () => void) {
  if (mql.addEventListener) mql.addEventListener('change', cb);
  else mql.addListener(cb);
}

let SNAPSHOT: Snap = {
  isMobile: true,
  isTablet: false,
  isDesktop: false,
  isLargeDesktop: false,
  isExtraLargeDesktop: false,
  isExtraExtraLargeDesktop: false,
};

function compute(): Snap {
  const q = ensureMqls();
  const smUp = !!q?.smUp.matches;
  const mdUp = !!q?.mdUp.matches;
  const lgUp = !!q?.lgUp.matches;
  const xlUp = !!q?.xlUp.matches;
  const xxlUp = !!q?.xxlUp.matches;

  return {
    isMobile: !mdUp,
    isTablet: smUp && !mdUp,
    isDesktop: mdUp,
    isLargeDesktop: lgUp,
    isExtraLargeDesktop: xlUp,
    isExtraExtraLargeDesktop: xxlUp,
  };
}

function shallowEqual(a: Snap, b: Snap) {
  return (
    a.isMobile === b.isMobile &&
    a.isTablet === b.isTablet &&
    a.isDesktop === b.isDesktop &&
    a.isLargeDesktop === b.isLargeDesktop &&
    a.isExtraLargeDesktop === b.isExtraLargeDesktop &&
    a.isExtraExtraLargeDesktop === b.isExtraExtraLargeDesktop
  );
}

function maybeUpdateSnapshot() {
  const next = compute();
  if (!shallowEqual(SNAPSHOT, next)) {
    SNAPSHOT = next;
    subscribers.forEach((cb) => cb());
  }
}

if (typeof window !== 'undefined') {
  ensureMqls();
  SNAPSHOT = compute();
}

export const useBreakPoints = () => {
  return useSyncExternalStore(
    (cb) => {
      subscribers.add(cb);

      return () => subscribers.delete(cb);
    },
    () => SNAPSHOT,
    () => SNAPSHOT,
  );
};
