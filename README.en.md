# scrollReveal - ts

#### ScrollReveal.js Scroll animation plug-in VERSION TS

#### Software architecture

Develop TS version based on scrollReveal.js

#### Instructions for use

#### Version ***v1.0.0*** is available only

1. Put ScrollSupport.impl.js in the project under the disk directory in the same way as ScrollSupport.js
```
new scrollRevealImpl({reset: false});
```

#### Usage has changed since version ***V2.0.0***

1. Use js version
``` JavaScript
/**
 * No parameters can be passed
 * Parameter type: object
    {
        after: '0s',
        enter:'bottom',
        move: '24px',
        over: '0.66s',
        easing:'ease-in-out',
        opacity: 0,
        complete: function(el?: HTMLElement) {},

        // if 0, the element is considered in the viewport as soon as it enters
        // if 1, the element is considered in the viewport when it's fully visible
        viewportFactor: 0.33,

        // if false, animations occur only once
        // if true, animations occur each time an element enters the viewport
        reset: false,

        // If it is true, scrollReveal.init() is automatically called upon instantiation
        init: true,
        elem: window.document.documentElement,
        queryCondition: "data-scroll-reveal"
    };
 *
 */
new ScrollRevealDefault();

/* How to use the plugin */
/**
 * The plugin has two parameters:
 * 1. Five functions init, animated, reset, clear, animateTimes
 * 2. Configuration The number of configuration and default parameters are different
 *  // if 0, the element is considered in the viewport as soon as it enters
    // if 1, the element is considered in the viewport when it's fully visible
    viewportFactor: 0.33,

    // if false, animations occur only once
    // if true, animations occur each time an element enters the viewport
    reset: false,

    // if true, scrollReveal.init() is automaticaly called upon instantiation
    init: true,
    elem: window.document.documentElement,
    queryCondition: "data-scroll-reveal-plugin"
 */

new ScrollRevealPlugin({})

```