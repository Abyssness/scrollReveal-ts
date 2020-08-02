"use strict";
/// <reference path="./../package/interface/interface.ts" />
var scrollReveal;
scrollReveal = new ScrollRevealDefault();
var myAnimated;
var funObj = {
    init: function () { return console.log("init"); },
    animated: function () { return console.log("animated"); },
    reset: function () { return console.log("reset"); },
    clear: function () { return console.log("clear"); },
    animatedTimes: 3000
};
myAnimated = new ScrollRevealPlugin(funObj, {});
