/*
 * main
 *
 * name: xiaojia
 * date: 2016/5/3
 */

Simple.Module({
    name: "blog:component/article/view/main",
    require: []
}, function (require, module, exports, Simple) {

    module.exports = Simple.View.create({

        id: module.id,

        template: function(a,i,s,e){"use strict";var l=this,t=(l.$helpers,a.props),c=l.$each,n=(a.$value,a.$index,function(){var a="".concat.apply("",arguments);return 1==this?a:r+=a}),d=l.$escape,r="";return r+='<div class="article">',t?c(t,function(a,i){r+='<div class="item"><div class="title"><a href="">',n.call(!1,d(a.title)),r+='</a><span class="time">',n.call(!1,d(a.date)),r+='</span><span class="name">',n.call(!1,d(a.author)),r+='</span></div><div class="content"><pre>',n.call(!1,a.content),r+='</pre></div><div class="detail"><a href="">\u7ee7\u7eed\u9605\u8bfb</a></div></div>'}):r+='<div class="loading">loading...</div>',r+="</div>",new String(r)},

        style: ["./main"]

    });

});