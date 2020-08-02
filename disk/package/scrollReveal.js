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
/// <reference path="./../interface/interface.ts" />
var ScrollRevealCore = /** @class */ (function () {
    function ScrollRevealCore() {
        var _this_1 = this;
        this.docElem = window.document.documentElement;
        this.defaultOptions = {
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
        this.scrolled = false;
        this.nextId = 0;
        this.styleBank = {};
        this.options = {};
        this.elems = [];
        this.resizeTimeout = null;
        this.__this = null;
        this.pluginFun = function () { return ({}); };
        this.pluginFunObject = {};
        this._requestAnimFrame = (window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) { window.setTimeout(callback, 1000 / 60); }).bind(window);
        this._scrollRevealOptions = function (options, pluginFun, _this) {
            _this_1.options = _this_1.extend(_this_1.defaultOptions, options);
            _this_1.docElem = _this_1.options.elem;
            _this_1.elems = _this_1.getElemSet("[" + _this_1.options.queryCondition + "]");
            _this_1.pluginFun = pluginFun;
            _this_1.pluginFunObject = pluginFun.call(_this);
            _this_1.__this = _this;
            if (_this_1.options.init == true)
                _this_1.init();
        };
    }
    ScrollRevealCore.prototype.init = function () {
        var _this_1 = this;
        this.scrolled = false;
        //  Check DOM for the data-scrollReveal attribute
        //  and initialize all found elements.
        //  检查DOM的data-scrollReveal属性并初始化所有找到的元素。
        this.elems.forEach(function (el, i) {
            //  Capture original style attribute
            var id = el.getAttribute(_this_1.options.queryCondition + "-id");
            if (!id) {
                id = (_this_1.nextId++).toString();
                el.setAttribute(_this_1.options.queryCondition + "-id", id);
            }
            if (!_this_1.styleBank[id]) {
                _this_1.styleBank[id] = el.getAttribute('style');
            }
            // this.update.call(this.__this, el);
            _this_1.updateDom(el);
        });
        var scrollHandler = function () {
            // No changing, exit
            if (!_this_1.scrolled) {
                _this_1.scrolled = true;
                _this_1._requestAnimFrame(function () {
                    _this_1._scrollPage();
                });
            }
        };
        /**
         * 重置计时器
         */
        var resizeHandler = function () {
            //  If we’re still waiting for settimeout, reset the timer.
            // 如果我们仍然在等待 settimeout，重置计时器。
            if (_this_1.resizeTimeout) {
                clearTimeout(_this_1.resizeTimeout);
            }
            var delayed = function () {
                _this_1._scrollPage();
                _this_1.resizeTimeout = null;
            };
            _this_1.resizeTimeout = setTimeout(delayed, 200);
        };
        // captureScroll
        if (this.docElem == window.document.documentElement) {
            window.addEventListener('scroll', scrollHandler, false);
            window.addEventListener('resize', resizeHandler, false);
        }
        else {
            this.docElem.addEventListener('scroll', scrollHandler, false);
        }
    };
    /**
     * 更新DOM
     */
    ScrollRevealCore.prototype._scrollPage = function () {
        var _this_1 = this;
        this.elems.forEach(function (el, i) {
            // this.update.call(this.__this, el);
            _this_1.updateDom(el);
        });
        this.scrolled = false;
    };
    /**
     * 返回查询的元素集合
     * @param queryCondition
     */
    ScrollRevealCore.prototype.getElemSet = function (queryCondition) {
        return Array.prototype.slice.call(this.docElem.querySelectorAll(queryCondition));
    };
    /**
     * 获取视图高度
     * @param docElem document (默认documnet)
     */
    ScrollRevealCore.prototype.getViewportH = function () {
        var client = this.docElem['clientHeight'], inner = window['innerHeight'];
        if (this.docElem == window.document.documentElement)
            return (client < inner) ? inner : client;
        else
            return client;
    };
    ScrollRevealCore.prototype.updateDom = function (el) {
        var _this_1 = this;
        if (!el.getAttribute(this.options.queryCondition + "-initialized")) {
            // el.setAttribute('style', style + css.initial);
            this.pluginFunObject.init.call(this.__this, el);
            el.setAttribute(this.options.queryCondition + "-initialized", "true");
        }
        if (!this.isElementInViewport(el, this.options.viewportFactor)) {
            if (this.options.reset) {
                // el.setAttribute('style', style + css.initial + css.reset);
                if (this.pluginFunObject.reset)
                    this.pluginFunObject.reset.call(this.__this, el);
            }
            return;
        }
        if (el.getAttribute(this.options.queryCondition + "-complete"))
            return;
        if (this.isElementInViewport(el, this.options.viewportFactor)) {
            // el.setAttribute('style', style + css.target + css.transition);
            this.pluginFunObject.animated.call(this.__this, el);
            //  Without reset enabled, we can safely remove the style tag
            //  to prevent CSS specificy wars with authored CSS.
            //  在不启用重置的情况下，我们可以安全地删除样式标签
            //  防止CSS与编辑过的CSS发生冲突。
            if (!this.options.reset) {
                var time = this.pluginFunObject.animatedTimes.call(this.__this, el);
                setTimeout(function () {
                    // if (style != "") {
                    //     el.setAttribute('style', style as string);
                    // } else {
                    //     el.removeAttribute('style');
                    // }
                    if (_this_1.pluginFunObject.clear)
                        _this_1.pluginFunObject.clear(el);
                    el.setAttribute(_this_1.options.queryCondition + "-complete", "true");
                    _this_1.options.complete(el);
                }, time);
            }
            return;
        }
    };
    /**
     * 获取元素的offsetTop和offsetLeft
     * @param el DOM 元素
     */
    ScrollRevealCore.prototype.getOffset = function (el) {
        var offsetTop = 0, offsetLeft = 0;
        do {
            if (!isNaN(el.offsetTop)) {
                offsetTop += el.offsetTop;
            }
            if (!isNaN(el.offsetLeft)) {
                offsetLeft += el.offsetLeft;
            }
        } while (el = el.offsetParent);
        return {
            top: offsetTop,
            left: offsetLeft
        };
    };
    /**
     * 判断元素是否在可视区间内
     * @param el
     * @param viewportFactor
     */
    ScrollRevealCore.prototype.isElementInViewport = function (el, viewportFactor) {
        var scrolled = this.docElem.scrollTop + this.docElem.offsetTop;
        if (this.docElem == window.document.documentElement)
            scrolled = window.pageYOffset;
        var viewed = scrolled + this.getViewportH(), elH = el.offsetHeight, elTop = this.getOffset(el).top, elBottom = elTop + elH, vf = viewportFactor || 0;
        return (elTop + elH * vf) <= viewed
            && (elBottom) >= scrolled
            || (el.currentStyle ? el.currentStyle : window.getComputedStyle(el, null)).position == 'fixed';
    };
    /**
     * 和并对象
     * @param a
     * @param b
     */
    ScrollRevealCore.prototype.extend = function (a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    };
    Object.defineProperty(ScrollRevealCore, "getInstance", {
        get: function () {
            return ScrollRevealCore._instance;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollRevealCore.prototype, "scrollRevealOptions", {
        get: function () {
            return ScrollRevealCore._instance._scrollRevealOptions;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollRevealCore.prototype, "getStyleBank", {
        get: function () {
            return this.styleBank;
        },
        enumerable: false,
        configurable: true
    });
    ScrollRevealCore._instance = new ScrollRevealCore();
    return ScrollRevealCore;
}());
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
/// <reference path="./../interface/interface.ts" />
/// <reference path="./../scrollReveal-core/scrollReveal.ts" />
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
        _this.pluginFunObject = {
            init: _this.animInit,
            animated: _this.animAnimated,
            reset: _this.animReset,
            clear: _this.animClear,
            animatedTimes: _this.animatedTimes,
        };
        _super.prototype.setCore.call(_this);
        return _this;
    }
    ScrollRevealDefault.prototype.getOptions = function () {
        return this.options;
    };
    ScrollRevealDefault.prototype.update = function (el) {
        var _this = this;
        // let css = this.genCSS(el);
        // let style = this.coreInstance.getStyleBank[el.getAttribute(`${this.options.queryCondition}-id`) as string];
        // if (style != null) style += ";"; else style = "";
        if (!el.getAttribute(this.options.queryCondition + "-initialized")) {
            // el.setAttribute('style', style + css.initial);
            this.animInit(el);
            el.setAttribute(this.options.queryCondition + "-initialized", "true");
        }
        if (!this.coreInstance.isElementInViewport(el, this.options.viewportFactor)) {
            if (this.options.reset) {
                // el.setAttribute('style', style + css.initial + css.reset);
                this.animReset(el);
            }
            return;
        }
        if (el.getAttribute(this.options.queryCondition + "-complete"))
            return;
        if (this.coreInstance.isElementInViewport(el, this.options.viewportFactor)) {
            // el.setAttribute('style', style + css.target + css.transition);
            this.animAnimated(el);
            //  Without reset enabled, we can safely remove the style tag
            //  to prevent CSS specificy wars with authored CSS.
            //  在不启用重置的情况下，我们可以安全地删除样式标签
            //  防止CSS与编辑过的CSS发生冲突。
            if (!this.options.reset) {
                var css = this.init(el);
                setTimeout(function () {
                    // if (style != "") {
                    //     el.setAttribute('style', style as string);
                    // } else {
                    //     el.removeAttribute('style');
                    // }
                    _this.animClear(el);
                    el.setAttribute(_this.options.queryCondition + "-complete", "true");
                    _this.options.complete(el);
                }, css.css.totalDuration);
            }
            return;
        }
    };
    ScrollRevealDefault.prototype.getPluginFunObject = function (el) {
        return this.pluginFunObject;
    };
    ScrollRevealDefault.prototype.init = function (el) {
        var css = this.genCSS(el);
        var style = this.coreInstance.getStyleBank[el.getAttribute(this.options.queryCondition + "-id")];
        if (style != null)
            style += ";";
        else
            style = "";
        return { css: css, style: style };
    };
    ScrollRevealDefault.prototype.animInit = function (el) {
        var css = this.init(el);
        el.setAttribute('style', css.style + css.css.initial);
    };
    ScrollRevealDefault.prototype.animAnimated = function (el) {
        var css = this.init(el);
        el.setAttribute('style', css.style + css.css.target + css.css.transition);
    };
    ScrollRevealDefault.prototype.animReset = function (el) {
        var css = this.init(el);
        el.setAttribute('style', css.style + css.css.initial + css.css.reset);
    };
    ScrollRevealDefault.prototype.animClear = function (el) {
        var css = this.init(el);
        if (css.style != "") {
            el.setAttribute('style', css.style);
        }
        else {
            el.removeAttribute('style');
        }
    };
    ScrollRevealDefault.prototype.animatedTimes = function (el) {
        return this.init(el).css.totalDuration;
        ;
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
/// <reference path="./../interface/interface.ts" />
/// <reference path="./../scrollReveal-core/scrollReveal.ts" />
var ScrollRevealPlugin = /** @class */ (function (_super) {
    __extends(ScrollRevealPlugin, _super);
    function ScrollRevealPlugin(pluginFunObject, options) {
        var _this = _super.call(this) || this;
        _this.defaultOptions = {
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
            queryCondition: "data-scroll-reveal-plugin"
        };
        _this.options = {};
        _this.coreInstance = _super.prototype.getInstance.call(_this);
        _this.options = options ? _this.coreInstance.extend(_this.defaultOptions, options) : _this.defaultOptions;
        _this.pluginFunObject = pluginFunObject;
        _super.prototype.setCore.call(_this);
        return _this;
    }
    ScrollRevealPlugin.prototype.getOptions = function () {
        return this.options;
    };
    ScrollRevealPlugin.prototype.getPluginFunObject = function (el) {
        return this.pluginFunObject;
    };
    return ScrollRevealPlugin;
}(ScrollReveal));
