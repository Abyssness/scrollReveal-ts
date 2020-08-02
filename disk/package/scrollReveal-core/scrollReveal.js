"use strict";
/// <reference path="./../interface/interface.ts" />
/// <reference path="./scrollReveal-core.ts" />
var ScrollReveal = /** @class */ (function () {
    function ScrollReveal() {
        this.scrollreveal = ScrollRevealCore.getInstance;
    }
    // 子类构造器中调用
    ScrollReveal.prototype.setCore = function () {
        this.scrollreveal.scrollRevealOptions(this.getOptions(), this.getPluginFunObject, this);
    };
    ScrollReveal.prototype.getInstance = function () {
        return this.scrollreveal;
    };
    return ScrollReveal;
}());
