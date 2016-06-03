/*
 * main
 *
 * name: xiaojia
 * date: 2016/5/3
 */

Simple.Module({
    name: "blog:component/navigation/view/main",
    require: []
}, function (require, module, exports, Simple) {

    module.exports = Simple.View.create({

        id: module.id,

        template: function(a,e,i,t){"use strict";var l=this,n=(l.$helpers,l.$each),s=a.props,c=(a.$value,a.$index,function(){var a="".concat.apply("",arguments);return 1==this?a:u+=a}),r=l.$escape,u="";return u+='<div class="navigation"><div class="title"><a href="./">ued<span>.life</span></a></div><div class="menu"><ul class="list-unstyled">',n(s,function(a,e){u+="<li><a ",a.target&&(u+='target="',c.call(!1,r(a.target)),u+='"'),u+=' href="',c.call(!1,a.href),u+='">',c.call(!1,a.title),u+="</a></li>"}),u+="</ul></div></div>",new String(u)},

        style: ["./main"]

    });

});