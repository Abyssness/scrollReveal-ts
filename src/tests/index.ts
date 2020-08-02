/// <reference path="./../package/interface/interface.ts" />
let scrollReveal: ScrollReveal;
scrollReveal = new ScrollRevealDefault();

let myAnimated: ScrollReveal;
let funObj: pluginFunObject = {
    init: () => console.log("init"),
    animated: () => console.log("animated"),
    reset: () => console.log("reset"),
    clear: () => console.log("clear"),
    animatedTimes: 3000
};
myAnimated = new ScrollRevealPlugin(funObj,{});
