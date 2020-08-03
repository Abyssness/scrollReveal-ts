/// <reference path="./../interface/interface.ts" />
class ScrollRevealCore {
    private static _instance = new ScrollRevealCore();
    /**
     * RequestAnimationFrame polyfill
     * @function
     */
    private _requestAnimFrame: animationFrame;
    private _scrollRevealOptions: scrollOptionFun;
    
    public docElem: HTMLElement = window.document.documentElement;
    
    
    protected scrolled: boolean = false;
    protected nextId: number = 0;
    protected styleBank: styleBank = {};

    public options: scrollRevealOptions = {};
    private static _optionsSet: Set<scrollRevealOptions> = new Set();
    protected elems: Array<HTMLElement> = [];
    protected elemSet: HTMLElement[] = [];
    protected resizeTimeout: ReturnType<typeof setTimeout> | null = null; 
    private __this: scrollReveal | null = null;
    private pluginFun: (el?: HTMLElement) => pluginFunObject = () => <pluginFunObject>{};
    private pluginFunObject: pluginFunObject = <pluginFunObject>{};
    private static _pluginFunMap: Map<string, pluginFunObject> = new Map();
    constructor() {
        this._requestAnimFrame = (window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) { window.setTimeout(callback, 1000 / 60); }).bind(window);
        this._scrollRevealOptions = (options: scrollRevealOptions, pluginFun: (el?: HTMLElement) => pluginFunObject, __this: any): void => {
            this.options = options;
            ScrollRevealCore._optionsSet.add(options);
            this.docElem = this.options.elem as HTMLElement;
            this.elems = this.getElemSet(`[${this.options.queryCondition}]`);
            this.elemSet = [...this.elemSet, ...this.elems];
            this.pluginFun = pluginFun;
            this.pluginFunObject = pluginFun.call(__this);
            ScrollRevealCore._pluginFunMap.set(this.options.queryCondition as string, this.pluginFunObject)
            this.__this = __this;
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
            let id = el.getAttribute(`${this.options.queryCondition}-id`);
            if (!id) {
                id = (this.nextId++).toString();
                el.setAttribute(`${this.options.queryCondition}-id`, id);
            }
            if (!this.styleBank[id]) {
              this.styleBank[id] = el.getAttribute('style');
            }
            // this.update.call(this.__this, el);
            this.updateDom(el);
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
        this.elemSet.forEach((el, i) => {
            this.updateDom(el);
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
    private getElemQueryCond(el: HTMLElement): scrollRevealOptions | null {
      let _optionsSet = Array.from(ScrollRevealCore._optionsSet);
      for(let value of _optionsSet) {
        if (el.getAttribute(`${value.queryCondition}`) !== null) return value;
      }
      return null;
    }
    private updateDom(el: HTMLElement): void {
        let _options: scrollRevealOptions | null = this.getElemQueryCond(el);
        if (_options === null) return;
        _options = <scrollRevealOptions>_options;
        let _pluginFunObject: pluginFunObject = <pluginFunObject>ScrollRevealCore._pluginFunMap.get(_options.queryCondition as string);
        if (!el.getAttribute(`${_options.queryCondition}-initialized`)) {
            _pluginFunObject.init.call(this.__this, el);
            el.setAttribute(`${_options.queryCondition}-initialized`, "true");
        }
        if (!this.isElementInViewport(el, _options.viewportFactor)) {
            if (_options.reset) {
                if(_pluginFunObject.reset) _pluginFunObject.reset.call(this.__this, el);
            }
            return;
        }
        if (el.getAttribute(`${_options.queryCondition}-complete`)) return;

        if (this.isElementInViewport(el, _options.viewportFactor)) {
            _pluginFunObject.animated.call(this.__this, el);
            //  Without reset enabled, we can safely remove the style tag
            //  to prevent CSS specificy wars with authored CSS.
            //  在不启用重置的情况下，我们可以安全地删除样式标签
            //  防止CSS与编辑过的CSS发生冲突。
            if (!_options.reset) {
                let time = _pluginFunObject.animatedTimes.call(this.__this, el);
                let setTimeFun = (el: HTMLElement, _opt: scrollRevealOptions) => {
                  if(_pluginFunObject.clear) _pluginFunObject.clear.call(this.__this, el);
                  el.setAttribute(`${_opt.queryCondition}-complete`,"true");
                  if("complete" in _opt) (_options as {complete: (el?: HTMLElement) => void}).complete(el);
                  }
                setTimeout(setTimeFun, time, el, _options);
            }
            return;
        }
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
        return ScrollRevealCore._instance;
    }
    
    public get scrollRevealOptions (): scrollOptionFun {
        return ScrollRevealCore._instance._scrollRevealOptions;
    }

    public get getStyleBank (): styleBank {
        return this.styleBank;
    }
}