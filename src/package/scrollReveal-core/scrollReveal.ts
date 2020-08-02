/// <reference path="./../interface/interface.ts" />
/// <reference path="./scrollReveal-core.ts" />


abstract class ScrollReveal{
    private scrollreveal = ScrollRevealCore.getInstance;
    constructor() {
            
    }
    // 子类构造器中调用
    protected setCore() {
        this.scrollreveal.scrollRevealOptions(this.getOptions(), this.getPluginFunObject, this);
    }
    protected getInstance() {
        return this.scrollreveal;
    }
    abstract getOptions(): scrollRevealOptions;
    abstract getPluginFunObject(el?: HTMLElement): pluginFunObject;
}