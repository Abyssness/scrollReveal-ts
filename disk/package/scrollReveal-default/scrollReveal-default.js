"use strict";
/// <reference path="./../interface/interface.ts" />
/// <reference path="./../scrollReveal-core/scrollReveal.ts" />
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ScrollRevealDefault = /** @class */ (function (_super) {
    __extends(ScrollRevealDefault, _super);
    function ScrollRevealDefault(options) {
        var _this = _super.call(this) || this;
        _this.defaultOptions = {
            after: '0s',
            enter: 'bottom',
            move: '24px',
            over: '0.66s',
            easing: 'ease-in-out',
            opacity: 0,
            complete: function (el) { },
            //  if 0, the element is considered in the viewport as soon as it enters
            //  如果为0，则在该元素进入时立即在视窗中考虑
            //  if 1, the element is considered in the viewport when it's fully visible
            //  如果是1，则在元素完全可见时在视口中考虑它
            viewportFactor: 0.33,
            // if false, animations occur only once
            // 如果为false，则只会出现一次动画
            // if true, animations occur each time an element enters the viewport
            // 如果为真，则每当一个元素进入视窗时，动画就会出现
            reset: false,
            // if true, scrollReveal.init() is automaticaly called upon instantiation
            // 如果为真，则在实例化时自动调用scrollReveal.init()
            init: true,
            elem: window.document.documentElement,
            queryCondition: "data-scroll-reveal"
        };
        _this.options = {};
        _this.coreInstance = _super.prototype.getInstance.call(_this);
        _this.options = options ? _this.coreInstance.extend(_this.defaultOptions, options) : _this.defaultOptions;
        _super.prototype.setCore.call(_this);
        return _this;
    }
    ScrollRevealDefault.prototype.getOptions = function () {
        return this.options;
    };
    ScrollRevealDefault.prototype.update = function (el) {
        var _this = this;
        var css = this.genCSS(el);
        var style = this.coreInstance.getStyleBank[el.getAttribute("data-scroll-reveal-id")];
        if (style != null)
            style += ";";
        else
            style = "";
        if (!el.getAttribute('data-scroll-reveal-initialized')) {
            el.setAttribute('style', style + css.initial);
            el.setAttribute('data-scroll-reveal-initialized', "true");
        }
        if (!this.coreInstance.isElementInViewport(el, this.options.viewportFactor)) {
            if (this.options.reset) {
                el.setAttribute('style', style + css.initial + css.reset);
            }
            return;
        }
        if (el.getAttribute('data-scroll-reveal-complete'))
            return;
        if (this.coreInstance.isElementInViewport(el, this.options.viewportFactor)) {
            el.setAttribute('style', style + css.target + css.transition);
            //  Without reset enabled, we can safely remove the style tag
            //  to prevent CSS specificy wars with authored CSS.
            //  在不启用重置的情况下，我们可以安全地删除样式标签
            //  防止CSS与编辑过的CSS发生冲突。
            if (!this.options.reset) {
                setTimeout(function () {
                    if (style != "") {
                        el.setAttribute('style', style);
                    }
                    else {
                        el.removeAttribute('style');
                    }
                    el.setAttribute('data-scroll-reveal-complete', "true");
                    _this.options.complete(el);
                }, css.totalDuration);
            }
            return;
        }
    };
    ScrollRevealDefault.prototype.parseLanguage = function (el) {
        //  Splits on a sequence of one or more commas or spaces.
        var words = el.getAttribute(this.options.queryCondition).split(/[, ]+/), parsed = {};
        var filter = function (words) {
            var ret = [], blacklist = [
                "from",
                "the",
                "and",
                "then",
                "but",
                "with"
            ];
            words.forEach(function (word, i) {
                if (blacklist.indexOf(word) > -1) {
                    return;
                }
                ret.push(word);
            });
            return ret;
        };
        words = filter(words);
        words.forEach(function (word, i) {
            switch (word) {
                case "enter":
                    parsed.enter = words[i + 1];
                    return;
                case "after":
                    parsed.after = words[i + 1];
                    return;
                case "wait":
                    parsed.after = words[i + 1];
                    return;
                case "move":
                    parsed.move = words[i + 1];
                    return;
                case "ease":
                    parsed.move = words[i + 1];
                    parsed.ease = "ease";
                    return;
                case "ease-in":
                    parsed.move = words[i + 1];
                    parsed.easing = "ease-in";
                    return;
                case "ease-in-out":
                    parsed.move = words[i + 1];
                    parsed.easing = "ease-in-out";
                    return;
                case "ease-out":
                    parsed.move = words[i + 1];
                    parsed.easing = "ease-out";
                    return;
                case "over":
                    parsed.over = words[i + 1];
                    return;
                default:
                    return;
            }
        });
        return parsed;
    };
    ScrollRevealDefault.prototype.genCSS = function (el) {
        var parsed = this.parseLanguage(el), enter, axis;
        if (parsed.enter) {
            if (parsed.enter == "top" || parsed.enter == "bottom") {
                enter = parsed.enter;
                axis = "y";
            }
            if (parsed.enter == "left" || parsed.enter == "right") {
                enter = parsed.enter;
                axis = "x";
            }
        }
        else {
            if (this.options.enter == "top" || this.options.enter == "bottom") {
                enter = this.options.enter;
                axis = "y";
            }
            if (this.options.enter == "left" || this.options.enter == "right") {
                enter = this.options.enter;
                axis = "x";
            }
        }
        //  After all values are parsed, let’s make sure our our
        //  pixel distance is negative for top and left entrances.
        //  ie. "move 25px from top" starts at 'top: -25px' in CSS.
        //  在所有的值都被解析之后，让我们确保我们的上方和左侧入口的像素距离为负值。
        //  ie。在CSS中，“从顶部移动25px”从“顶部:-25px”开始。
        if (enter == "top" || enter == "left") {
            if (parsed.move) {
                parsed.move = "-" + parsed.move;
            }
            else {
                parsed.move = "-" + this.options.move;
            }
        }
        var dist = parsed.move || this.options.move, dur = parsed.over || this.options.over, delay = parsed.after || this.options.after, easing = parsed.easing || this.options.easing, opacity = parsed.opacity || this.options.opacity;
        var transition = "-webkit-transition: -webkit-transform " + dur + " " + easing + " " + delay + " ,  opacity " + dur + " " + easing + " " + delay + ";\n          transition: transform " + dur + " " + easing + " " + delay + " ,  opacity " + dur + " " + easing + " " + delay + ";\n          -webkit-perspective: 1000;\n          -webkit-backface-visibility: hidden;";
        //  The same as transition, but removing the delay for elements fading out.
        //  与过渡相同，只是消除了元素淡出的延迟。
        var reset = "-webkit-transition: -webkit-transform " + dur + " " + easing + " 0s,  opacity " + dur + " " + easing + " " + delay + ";\n          transition: transform " + dur + " " + easing + " 0s,  opacity " + dur + " " + easing + " " + delay + ";\n          -webkit-perspective: 1000;\n          -webkit-backface-visibility: hidden;";
        var initial = "-webkit-transform: translate" + axis + "(" + dist + ");\n          transform: translate" + axis + "(" + dist + ");\n          opacity: " + opacity + ";";
        var target = "-webkit-transform: translate" + axis + "(0);\n          transform: translate" + axis + "(0);\n          opacity: 1;";
        return {
            transition: transition,
            initial: initial,
            target: target,
            reset: reset,
            totalDuration: ((parseFloat(dur) + parseFloat(delay)) * 1000)
        };
    };
    return ScrollRevealDefault;
}(ScrollReveal));
