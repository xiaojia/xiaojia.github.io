/*
 * xml-http-request
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'simple:tools/ajax/http/request/xml-http-request'
}, function (require, module, exports, Simple) {

    "use strict";

    module.exports = function () {

        var xmlHttp;

        try {
            if (window.XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            } else if (self.ActiveXObject) {
                try {
                    xmlHttp = new self.ActiveXObject("Microsoft.XMLHTTP");
                } catch (e) {
                    try {
                        xmlHttp = new self.ActiveXObject("MSXML2.XMLHTTP");
                    } catch (e) {
                        xmlHttp = new XMLHttpRequest();
                    }
                }
            }
        } catch (e) {
            throw new TypeError('CreateXmlHttpRequest error ' + e.message);
        }

        return xmlHttp;

    };

});