class scrollRevealImpl implements scrollReveal {

  private static defaultOptions: scrollRevealOptions = {
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
	  elem: window.document.documentElement
  }
  /**
  * RequestAnimationFrame polyfill
  * @function
  * @private
  */
  private static requestAnimFrame = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  (window as any).mozRequestAnimationFrame ||
  function (callback) {
    window.setTimeout(callback, 1000 / 60);
  };
  private docElem: HTMLElement;
  private options: scrollRevealOptions;
  private styleBank: styleBank = {};
  private scrolled: boolean = false;
  private elems: Array<HTMLElement> | null = null;
  private nextId: number = 1;
  private resizeTimeout: ReturnType<typeof setTimeout> | null = null;
  constructor(options: scrollRevealOptions) {
    this.options = this.extend(scrollRevealImpl.defaultOptions, options);
    this.docElem = this.options.elem as HTMLElement;
    if (this.options.init == true) this.init();
  }
  public init() {
    this.scrolled = false;
    //  Check DOM for the data-scrollReveal attribute
    //  and initialize all found elements.
    //  检查DOM的data-scrollReveal属性并初始化所有找到的元素。
    this.elems = Array.prototype.slice.call(this.docElem.querySelectorAll('[data-scroll-reveal]'));
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
      this.update(el);
    });

    let scrollHandler = () => {
      // No changing, exit
      if (!this.scrolled) {
        this.scrolled = true;
        window.requestAnimationFrame(() => {
          this._scrollPage();
        });
      }
    };

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
  private _scrollPage() {
    this.elems = this.elems as Array<HTMLElement>;
    this.elems.forEach((el, i) => {
      this.update(el);
    });
    this.scrolled = false;
  }
  private parseLanguage(el: HTMLElement): parsed {
    //  Splits on a sequence of one or more commas or spaces.
    let words: string[] = (<string>el.getAttribute('data-scroll-reveal')).split(/[, ]+/),
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
  private update(el: HTMLElement) {
    let css = this.genCSS(el);
    let style = this.styleBank[el.getAttribute("data-scroll-reveal-id") as string];

    if (style != null) style += ";"; else style = "";
    if (!el.getAttribute('data-scroll-reveal-initialized')) {
      el.setAttribute('style', style + css.initial);
      el.setAttribute('data-scroll-reveal-initialized', "true");
    }
    if (!this.isElementInViewport(el, this.options.viewportFactor)) {
      if (this.options.reset) {
        el.setAttribute('style', style + css.initial + css.reset);
      }
      return;
    }
    if (el.getAttribute('data-scroll-reveal-complete')) return;

    if (this.isElementInViewport(el, this.options.viewportFactor)) {
      el.setAttribute('style', style + css.target + css.transition);
      //  Without reset enabled, we can safely remove the style tag
      //  to prevent CSS specificy wars with authored CSS.
      //  在不启用重置的情况下，我们可以安全地删除样式标签
      //  防止CSS与编辑过的CSS发生冲突。
      if (!this.options.reset) {
        setTimeout(() => {
          if (style != "") {
            el.setAttribute('style', style as string);
          } else {
            el.removeAttribute('style');
          }
          el.setAttribute('data-scroll-reveal-complete',"true");
          (this.options as {complete: (el?: HTMLElement) => void}).complete(el);
        }, css.totalDuration);
      }
      return;
    }
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
  public getViewportH() {
    let client = this.docElem['clientHeight'],
      inner = window['innerHeight'];
    if (this.docElem == window.document.documentElement)
      return (client < inner) ? inner : client;
    else
      return client;
  }
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
  public isElementInViewport(el: HTMLElement, viewportFactor?: number) {
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
  private extend(a: scrollRevealOptions, b: scrollRevealOptions): scrollRevealOptions {
    for (let key in b) {
      if (b.hasOwnProperty(key)) {
        a[key] = b[key];
      }
    }
    return a;
  }
}