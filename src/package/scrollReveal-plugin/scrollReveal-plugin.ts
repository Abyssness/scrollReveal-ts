/// <reference path="./../interface/interface.ts" />
/// <reference path="./../scrollReveal-core/scrollReveal.ts" />

class ScrollRevealPlugin extends ScrollReveal {
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
        queryCondition: "data-scroll-reveal-plugin"
    };
    public options: scrollRevealOptions = {};
    public coreInstance: ScrollRevealCore;
    private pluginFunObject: pluginFunObject;
    constructor(pluginFunObject: pluginFunObject, options?: scrollRevealOptions) {
        super();
        this.coreInstance = super.getInstance();
        this.options = options ? this.coreInstance.extend(this.defaultOptions, options) : this.defaultOptions;
        this.pluginFunObject = pluginFunObject;
        super.setCore();
    }
    getOptions(): scrollRevealOptions {
        return this.options;
    }
    update(el: HTMLElement): void {
        if (!el.getAttribute(`${this.options.queryCondition}-initialized`)) {
            this.isFun(this.pluginFunObject.init);
            el.setAttribute(`${this.options.queryCondition}-initialized`, "true");
        }
        if (!this.coreInstance.isElementInViewport(el, this.options.viewportFactor)) {
            if (this.options.reset) {
                this.isFun(this.pluginFunObject.reset);
            }
            return;
        }
        if (el.getAttribute(`${this.options.queryCondition}-complete`)) return;

        if (this.coreInstance.isElementInViewport(el, this.options.viewportFactor)) {
            this.isFun(this.pluginFunObject.animated);
            // 不重启安全清除动画
            if (!this.options.reset) {
                setTimeout(() => {
                  this.isFun(this.pluginFunObject.clear);
                  el.setAttribute(`${this.options.queryCondition}-complete`,"true");
                  if (this.options.complete) (this.options as {complete: (el?: HTMLElement) => void}).complete(el);
                //   (this.options as {complete: (el?: HTMLElement) => void}).complete(el);
                }, this.pluginFunObject.animatedTimes);
            }
            return;
        }
    }
    private isFun(literal: any) {
        let result;
        if(typeof literal === "function") result = literal();
        else result = literal;
        return result;
    }
}