/*
 * main
 *
 * name: xiaojia
 * date: 2016/5/6
 */

Simple.Module({
    name: "blog:component/article/view/main",
    require: []
}, function (require, module, exports, Simple) {

    module.exports = Simple.View.create({

        id: module.id,

        template: function(a,i,e,l){"use strict";var c=this,n=c.$helpers,s=a.props,t=c.$each,d=(a.$value,a.$index,function(){var a="".concat.apply("",arguments);return 1==this?a:p+=a}),o=c.$escape,r=n.utils,p="";return p+='<div class="article">',s?t(s,function(a,i){p+='<div class="item"><div class="title"><a href="#id=',d.call(!1,o(r.decodeURIComponent(a.id))),p+='">',d.call(!1,o(a.title)),p+='</a><span class="time">',d.call(!1,o(a.date)),p+='</span><span class="name">',d.call(!1,o(a.author)),p+='</span></div><div class="content"><pre>',d.call(!1,a.content),p+='</pre></div><div class="detail"><a href="#id=',d.call(!1,o(r.decodeURIComponent(a.id))),p+='">\u7ee7\u7eed\u9605\u8bfb</a></div></div>'}):p+='<div class="loading">loading...</div>',p+="</div>",new String(p)},

        style: ["./main"]

    });

});