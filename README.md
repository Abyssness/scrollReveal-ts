# scrollReveal-ts

#### 介绍
scrollReveal.js 滚动动画插件 ts版本

#### 软件架构
基于scrollReveal.js 开发 ts版本


#### 使用说明

#### 只适用版本 ***v1.0.0***
1.  把disk目录下scrollReveal.impl.js放到项目中,使用方式和scrollReveal.js相同
```JavaScript
new scrollRevealImpl({reset: false});
```

#### 版本 ***v2.0.0*** 之后使用方式发生变化
1. 使用 js 版本
``` JavaScript
/**
 * 可以不传参数
 * 参数类型：object
    {
        after:   '0s',
        enter:   'bottom',
        move:    '24px',
        over:    '0.66s',
        easing:  'ease-in-out',
        opacity: 0,
        complete: function(el?: HTMLElement) {},

        //  如果为0，则在该元素进入时立即在视窗中考虑
        //  如果是1，则在元素完全可见时在视口中考虑它
        viewportFactor: 0.33,

        // 如果为false，则只会出现一次动画
        // 如果为真，则每当一个元素进入视窗时，动画就会出现
        reset: false,

        // 如果为真，则在实例化时自动调用scrollReveal.init()
        init: true,
        elem: window.document.documentElement,
        queryCondition: "data-scroll-reveal"
    };
 *
 */
new ScrollRevealDefault();

/* 插件使用方式 */
/**
 * 插件有两个参数：
 * 1. 五个函数 init，animated，reset， clear， animateTimes
 * 2. 配置 配置和默认参数数量不同
    //  如果为0，则在该元素进入时立即在视窗中考虑
    //  如果是1，则在元素完全可见时在视口中考虑它
    viewportFactor: 0.33,

    // 如果为false，则只会出现一次动画
    // 如果为真，则每当一个元素进入视窗时，动画就会出现
    reset: false,

    // 如果为真，则在实例化时自动调用scrollReveal.init()
    init: true,
    elem: window.document.documentElement,
    queryCondition: "data-scroll-reveal-plugin"
 */

new ScrollRevealPlugin({})

```

