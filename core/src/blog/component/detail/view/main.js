/*
 * main
 *
 * name: xiaojia
 * date: 2016/5/6
 */

Simple.Module({
    name: "blog:component/detail/view/main",
    require: []
}, function (require, module, exports, Simple) {

    module.exports = Simple.View.create({

        id: module.id,

        template: function(a,l,i,s){"use strict";var n=this,t=n.$helpers,c=a.props,e=function(){var a="".concat.apply("",arguments);return 1==this?a:r+=a},d=n.$escape,o=t.utils,r="";return r+='<div class="detail">',c?(r+='<div class="item"><div class="title clearfix"><a href="#id=',e.call(!1,d(o.decodeURIComponent(c.id))),r+='">',e.call(!1,d(c.title)),r+='</a><span class="time">',e.call(!1,d(c.date)),r+='</span><span class="name">',e.call(!1,d(c.author)),r+='</span><span class="download"><a target="_blank" href="',e.call(!1,d(c.originalUrl)),r+='" download="',e.call(!1,d(c.title)),r+='.md">\u4e0b\u8f7d\u6b64\u6587\u6863</a></span></div><div class="content">',e.call(!1,c.content),r+="</div></div>"):r+='<div class="loading">loading...</div>',r+="</div>",new String(r)},

        style: ["./main"]

    });

});