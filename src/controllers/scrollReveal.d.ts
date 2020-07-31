declare global {
  interface window { mozRequestAnimationFrame: any; }
}

interface HTMLElement {
  currentStyle: CSSStyleDeclaration;
}

interface scrollRevealOptions {
  [index: string]: any;
  after?: string;
  enter?: string;
  move?: string;
  over?: string;
  easing?: string;
  opacity?: number;
  complete?: (el?: HTMLElement) => void;

//  if 0, the element is considered in the viewport as soon as it enters
//  if 1, the element is considered in the viewport when it's fully visible
  viewportFactor?: number;

// if false, animations occur only once
// if true, animations occur each time an element enters the viewport
  reset?: boolean;

// if true, scrollReveal.init() is automaticaly called upon instantiation
  init?: boolean;
  elem?: HTMLElement;
}

interface parsed {
  enter?: string;
  after?: string;
  wait?: string;
  move?: string;
  ease?: string;
  easing?: string;
  over?: string;
  opacity?: number;
}

interface getCss {
  transition: string;
  initial: string;
  target: string;
  reset: string;
  totalDuration: number;
}

interface styleBank {
  [index: string]: string | null;
}

interface scrollReveal {
  // 默认配置
  // defaultOptions: scrollRevealOptions;
  // // init: () => void;
  // _scrollPage: () => void;
  // parseLanguage: (el: HTMLElement) => void;
  // update: (el: HTMLElement) => void;
  // genCSS: (el: HTMLElement) => void;
  // getViewportH: () => void;
  // getOffset: (el: HTMLElement) => {top: number, left: number};
  // isElementInViewport: (el: HTMLElement, height?: number) => void;
  // extend: (a: object, b: object) => void;
}
