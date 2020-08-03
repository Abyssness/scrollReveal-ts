"use strict";
/// <reference path="./../package/interface/interface.ts" />
var scrollReveal;
var myAnimated;
var funObj = {
    init: function (el) {
        console.log("init");
        el.innerText = "init";
    },
    animated: function (el) { return console.log("animated"); },
    reset: function (el) { return console.log("reset"); },
    clear: function (el) { return console.log("clear"); },
    animatedTimes: function (el) { return 6000; }
};
myAnimated = new ScrollRevealPlugin(funObj, {});
scrollReveal = new ScrollRevealDefault({ reset: false });
