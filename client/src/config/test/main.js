/*
 * config
 *
 * name: xiaojia
 * date: 16/3/8
 */

// 项目配置
window.Simple = {
    config: {
        name: 'blog',
        container: document.body,
        root: location.pathname,
        packages: {
            blog: 'core/src/blog/',
            common: 'core/src/common/',
            article: 'article/',
            simple: 'simple-framework/simple/src/'
        }
    }
};