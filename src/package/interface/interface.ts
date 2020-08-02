type callback = () => void;
type animationFrame = (callback: callback) => void;
type update = (el: HTMLElement) => void;
// type scrollOptionFun = (options: scrollRevealOptions, update: update, _this: any) => void;
type scrollOptionFun = (options: scrollRevealOptions, pluginFun: (el?: HTMLElement) => pluginFunObject, _this: any) => void;

interface Window { 
    mozRequestAnimationFrame: animationFrame; 
    msRequestAnimationFrame: animationFrame;
}
interface HTMLElement {
    currentStyle: CSSStyleDeclaration;
}
interface Object {
    [index: string]: any;
    [index: number]: any;
}
interface scrollRevealOptions {
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
    queryCondition?: string;
    [propName: string]: any;
}

// interface scrollRevealOptions {
//     time?: number;
//     delay?: number;
// }
interface styleBank {
    [index: string]: string | null;
}
interface getCss {
    transition: string;
    initial: string;
    target: string;
    reset: string;
    totalDuration: number;
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
interface pluginFunObject {
    init: (el: HTMLElement) => void;
    animated: (el: HTMLElement) => void;
    animatedTimes: (el: HTMLElement) => number;
    reset?: (el: HTMLElement) => void;
    clear?: (el: HTMLElement) => void;
    [propName: string]: any;
}
interface scrollReveal {
    update(el: HTMLElement): void;
}
