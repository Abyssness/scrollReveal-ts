/// <reference path="./../interface/interface.ts" />
/// <reference path="./../scrollReveal-core/scrollReveal.ts" />

class ScrollRevealDefault extends ScrollReveal{
    private defaultOptions: scrollRevealOptions = {
        after:   '0s',
        enter:   'bottom',
        move:    '24px',
        over:    '0.66s',
        easing:  'ease-in-out',
        opacity: 0,
        complete: function(el?: HTMLElement) {},

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
    public options: scrollRevealOptions = {};
    public coreInstance: ScrollRevealCore;
    private pluginFunObject: pluginFunObject;
    constructor(options?: scrollRevealOptions) {
        super();
        this.coreInstance = super.getInstance();
        this.options = options ? this.coreInstance.extend(this.defaultOptions, options) : this.defaultOptions;
        this.pluginFunObject = {
          init: this.animInit,
          animated: this.animAnimated,
          reset: this.animReset,
          clear: this.animClear,
          animatedTimes: this.animatedTimes,
        }
        super.setCore();
    }
    getOptions(): scrollRevealOptions {
        return this.options;
    }
    update(el: HTMLElement): void {
        // let css = this.genCSS(el);
        // let style = this.coreInstance.getStyleBank[el.getAttribute(`${this.options.queryCondition}-id`) as string];
        // if (style != null) style += ";"; else style = "";
        if (!el.getAttribute(`${this.options.queryCondition}-initialized`)) {
            // el.setAttribute('style', style + css.initial);
            this.animInit(el);
            el.setAttribute(`${this.options.queryCondition}-initialized`, "true");
        }
        if (!this.coreInstance.isElementInViewport(el, this.options.viewportFactor)) {
            if (this.options.reset) {
                // el.setAttribute('style', style + css.initial + css.reset);
                this.animReset(el);
            }
            return;
        }
        if (el.getAttribute(`${this.options.queryCondition}-complete`)) return;

        if (this.coreInstance.isElementInViewport(el, this.options.viewportFactor)) {
            // el.setAttribute('style', style + css.target + css.transition);
            this.animAnimated(el);
            //  Without reset enabled, we can safely remove the style tag
            //  to prevent CSS specificy wars with authored CSS.
            //  在不启用重置的情况下，我们可以安全地删除样式标签
            //  防止CSS与编辑过的CSS发生冲突。
            if (!this.options.reset) {
                let css = this.init(el);
                setTimeout(() => {
                  // if (style != "") {
                  //     el.setAttribute('style', style as string);
                  // } else {
                  //     el.removeAttribute('style');
                  // }
                  this.animClear(el);
                  el.setAttribute(`${this.options.queryCondition}-complete`,"true");
                  (this.options as {complete: (el?: HTMLElement) => void}).complete(el);
                }, css.css.totalDuration);
            }
            return;
        }
    }
    getPluginFunObject(el?: HTMLElement): pluginFunObject {
      return this.pluginFunObject;
    }
    private init(el: HTMLElement): {css: getCss, style: string} {
      let css = this.genCSS(el);
      let style = this.coreInstance.getStyleBank[el.getAttribute(`${this.options.queryCondition}-id`) as string];
      if (style != null) style += ";"; else style = "";
      return {css, style};
    }
    private animInit(el: HTMLElement): void {
      let css = this.init(el);
      el.setAttribute('style', css.style + css.css.initial);
    }
    private animAnimated(el: HTMLElement): void {
      let css = this.init(el);
      el.setAttribute('style', css.style + css.css.target + css.css.transition);
    }
    private animReset(el: HTMLElement): void {
      let css = this.init(el);
      el.setAttribute('style', css.style + css.css.initial + css.css.reset);
    }
    private animClear(el: HTMLElement): void {
      let css = this.init(el);
      if (css.style != "") {
          el.setAttribute('style', css.style as string);
      } else {
          el.removeAttribute('style');
      }
    }
    private animatedTimes(el: HTMLElement): number {    
      return this.init(el).css.totalDuration;;
    }
    private parseLanguage(el: HTMLElement): parsed {
        //  Splits on a sequence of one or more commas or spaces.
        let words: string[] = (<string>el.getAttribute(this.options.queryCondition as string)).split(/[, ]+/),
          parsed: parsed = {};
    
        let filter = (words: Array<string>): Array<string> =>  {
          let ret: Array<string> = [],
            blacklist = [
              "from",
              "the",
              "and",
              "then",
              "but",
              "with"
            ];
    
          words.forEach((word: string, i: number) => {
            if (blacklist.indexOf(word) > -1) {
              return;
            }
            ret.push(word);
          });
          return ret;
        }
    
        words = filter(words);
    
        words.forEach(function (word: string, i: number) {
    
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
    }
    private genCSS(el: HTMLElement): getCss {
        let parsed = this.parseLanguage(el),
          enter,
          axis;
        if (parsed.enter) {
          if (parsed.enter == "top" || parsed.enter == "bottom") {
            enter = parsed.enter;
            axis = "y";
          }
          if (parsed.enter == "left" || parsed.enter == "right") {
            enter = parsed.enter;
            axis = "x";
          }
        } else {
          if (this.options.enter == "top" || this.options.enter == "bottom") {
            enter = this.options.enter
            axis = "y";
          }
          if (this.options.enter == "left" || this.options.enter == "right") {
            enter = this.options.enter
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
    
        let dist = parsed.move || this.options.move,
          dur = parsed.over || this.options.over,
          delay = parsed.after || this.options.after,
          easing = parsed.easing || this.options.easing,
          opacity = parsed.opacity || this.options.opacity;
          
        let transition = `-webkit-transition: -webkit-transform ${dur} ${easing} ${delay} ,  opacity ${dur} ${easing} ${delay};
          transition: transform ${dur} ${easing} ${delay} ,  opacity ${dur} ${easing} ${delay};
          -webkit-perspective: 1000;
          -webkit-backface-visibility: hidden;`; 
          
        //  The same as transition, but removing the delay for elements fading out.
        //  与过渡相同，只是消除了元素淡出的延迟。
        let reset = `-webkit-transition: -webkit-transform ${dur} ${easing} 0s,  opacity ${dur} ${easing} ${delay};
          transition: transform ${dur} ${easing} 0s,  opacity ${dur} ${easing} ${delay};
          -webkit-perspective: 1000;
          -webkit-backface-visibility: hidden;`;
    
        let initial = `-webkit-transform: translate${axis}(${dist});
          transform: translate${axis}(${dist});
          opacity: ${opacity};`;
    
        let target = `-webkit-transform: translate${axis}(0);
          transform: translate${axis}(0);
          opacity: 1;`;
    
        return {
          transition: transition,
          initial: initial,
          target: target,
          reset: reset,
          totalDuration: ((parseFloat(dur as string) + parseFloat(delay as string)) * 1000)
        }
    
    }
}