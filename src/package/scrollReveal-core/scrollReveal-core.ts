/// <reference path="./../interface/interface.ts" />
class ScrollRevealCore {
    private static instance = new ScrollRevealCore();
    /**
     * RequestAnimationFrame polyfill
     * @function
     */
    private _requestAnimFrame: animationFrame;
    private _scrollRevealOptions: scrollOptionFun;
    
    public docElem: HTMLElement = window.document.documentElement;
    
    private defaultOptions: scrollRevealOptions = {
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
    }
    protected scrolled: boolean = false;
    protected nextId: number = 1;
    protected styleBank: styleBank = {};

    public options: scrollRevealOptions = {};
    protected elems: Array<HTMLElement> = [];   
    protected resizeTimeout: ReturnType<typeof setTimeout> | null = null;
    public update: update = (el: HTMLElement): void => {}; 
    private _this: scrollReveal | null = null;
    constructor() {
        this._requestAnimFrame = (window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) { window.setTimeout(callback, 1000 / 60); }).bind(window);
        this._scrollRevealOptions = (options: scrollRevealOptions, update: update, _this: any): void => {
            this.options = this.extend(this.defaultOptions, options);
            this.docElem = this.options.elem as HTMLElement;
            this.elems = this.getElemSet(`[${this.options.queryCondition}]`);
            this.update = update;
            this._this = _this;
            if (this.options.init == true) this.init();
        }
    }
        
    private init() {
        this.scrolled = false;
        //  Check DOM for the data-scrollReveal attribute
        //  and initialize all found elements.
        //  检查DOM的data-scrollReveal属性并初始化所有找到的元素。
        this.elems.forEach((el, i) => {
            //  Capture original style attribute
            let id = el.getAttribute("data-scroll-reveal-id");
            if (!id) {
                id = (this.nextId++).toString();
                el.setAttribute("data-scroll-reveal-id", id);
            }
            if (!this.styleBank[id]) {
              this.styleBank[id] = el.getAttribute('style');
            }
            this.update.call(this._this, el);
        });
        let scrollHandler = () => {
            // No changing, exit
            if (!this.scrolled) {
                this.scrolled = true;
                this._requestAnimFrame(() => {
                    this._scrollPage();
                });

            }
        };
        /**
         * 重置计时器
         */
        let resizeHandler = () => {
            //  If we’re still waiting for settimeout, reset the timer.
            // 如果我们仍然在等待 settimeout，重置计时器。
            if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
            }
            let delayed = () => {
            this._scrollPage();
            this.resizeTimeout = null;
            }
            this.resizeTimeout = setTimeout(delayed, 200);
        };
        // captureScroll
        if (this.docElem == window.document.documentElement) {
            window.addEventListener('scroll', scrollHandler, false);
            window.addEventListener('resize', resizeHandler, false);
        }
        else {
            this.docElem.addEventListener('scroll', scrollHandler, false);
        }
    }

    
    
    /**
     * 更新DOM
     */
    private _scrollPage() {
        this.elems.forEach((el, i) => {
            this.update.call(this._this, el);;
        });
        this.scrolled = false;
    }

    /**
     * 返回查询的元素集合
     * @param queryCondition 
     */
    public getElemSet(queryCondition: string): Array<HTMLElement> {
        return Array.prototype.slice.call(this.docElem.querySelectorAll(queryCondition));
    }
    /**
     * 获取视图高度
     * @param docElem document (默认documnet)
     */
    public getViewportH(): number {
        let client = this.docElem['clientHeight'],
            inner = window['innerHeight'];
        if (this.docElem == window.document.documentElement)
            return (client < inner) ? inner : client;
        else
            return client;
    }
    /**
     * 获取元素的offsetTop和offsetLeft
     * @param el DOM 元素
     */
    public getOffset(el: HTMLElement): {top: number, left: number} {
        let offsetTop = 0, offsetLeft = 0;
        do {
            if (!isNaN(el.offsetTop)) {
            offsetTop += el.offsetTop;
            }
            if (!isNaN(el.offsetLeft)) {
            offsetLeft += el.offsetLeft;
            }
        } while (el = <HTMLElement>el.offsetParent)
    
        return {
            top: offsetTop,
            left: offsetLeft
        }
    }
    /**
     * 判断元素是否在可视区间内
     * @param el 
     * @param viewportFactor 
     */
    public isElementInViewport(el: HTMLElement, viewportFactor?: number): boolean {
    let scrolled = this.docElem.scrollTop + this.docElem.offsetTop;
        if (this.docElem == window.document.documentElement) scrolled = window.pageYOffset;
        let viewed = scrolled + this.getViewportH(),
        elH = el.offsetHeight,
        elTop = this.getOffset(el).top,
        elBottom = elTop + elH,
        vf = viewportFactor || 0;
    return (elTop + elH * vf) <= viewed
        && (elBottom) >= scrolled
        || (el.currentStyle? el.currentStyle : window.getComputedStyle(el, null)).position == 'fixed';
    }
    /**
     * 和并对象
     * @param a 
     * @param b 
     */
    public extend(a: Object & object, b: Object & object): Object & object {
        for (let key in b) {
          if (b.hasOwnProperty(key)) {
            a[key] = b[key];
          }
        }
        return a;
    }

    public static get getInstance (): ScrollRevealCore {
        return ScrollRevealCore.instance;
    }
    
    public get scrollRevealOptions (): scrollOptionFun {
        return ScrollRevealCore.instance._scrollRevealOptions;
    }

    public get getStyleBank (): styleBank {
        return this.styleBank;
    }
}