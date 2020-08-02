/// <reference path="./../package/interface/interface.ts" />
let scrollReveal: ScrollReveal;

let myAnimated: ScrollReveal;
let funObj: pluginFunObject = {
    init: (el: HTMLElement) => {
        console.log("init")
        el.innerText = "init";
    },
    animated: (el: HTMLElement) => console.log("animated"),
    reset: (el: HTMLElement) => console.log("reset"),
    clear: (el: HTMLElement) => console.log("clear"),
    animatedTimes: (el: HTMLElement) => 6000
};
myAnimated = new ScrollRevealPlugin(funObj,{});
scrollReveal = new ScrollRevealDefault({reset: true});
