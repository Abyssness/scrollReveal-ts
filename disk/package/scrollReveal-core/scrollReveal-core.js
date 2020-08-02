"use strict";
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
        this.nextId = 1;
        this.styleBank = {};
        this.options = {};
        this.elems = [];
        this.resizeTimeout = null;
        this.update = function (el) { };
        this._this = null;
        this._requestAnimFrame = (window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) { window.setTimeout(callback, 1000 / 60); }).bind(window);
        this._scrollRevealOptions = function (options, update, _this) {
            _this_1.options = _this_1.extend(_this_1.defaultOptions, options);
            _this_1.docElem = _this_1.options.elem;
            _this_1.elems = _this_1.getElemSet("[" + _this_1.options.queryCondition + "]");
            _this_1.update = update;
            _this_1._this = _this;
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
            _this_1.update.call(_this_1._this, el);
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
            _this_1.update.call(_this_1._this, el);
            ;
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
            return ScrollRevealCore.instance;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollRevealCore.prototype, "scrollRevealOptions", {
        get: function () {
            return ScrollRevealCore.instance._scrollRevealOptions;
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
    ScrollRevealCore.instance = new ScrollRevealCore();
    return ScrollRevealCore;
}());
