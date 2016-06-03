/*
 * split
 *
 * name: xiaojia
 * date: 16/6/1
 */

Simple.Module({
    name: 'simple:core/utils/split'
}, function (require, module, exports, Simple) {

    "use strict";

    /**
     * 字符串截取
     * @param text 字符串
     * @param lineSplitter 分割
     * @param fieldSplitter 分割
     * @param trim 是否trim
     * @returns {{}}
     */
    module.exports = function (text, lineSplitter, fieldSplitter, trim) {

        var list = {};

        if (text) {

            var parts, keyName, arr, keyValue;

            lineSplitter = lineSplitter || "\n";
            fieldSplitter = fieldSplitter || "\t";

            var pairs = text.split(lineSplitter);

            for (var i = 0, len = pairs.length; i < len; i++) {

                parts = pairs[i].split(fieldSplitter);
                keyName = parts[0];
                keyValue = decodeURIComponent(parts[1]);

                if (trim) {
                    keyName = keyName.trim();
                    keyValue = keyValue.trim();
                }

                if (typeof list[keyName] === "undefined") {
                    list[keyName] = keyValue;
                } else if (typeof list[keyName] === "string") {
                    arr = [list[keyName], keyValue];
                    list[keyName] = arr;
                } else {
                    list[keyName].push(keyValue);
                }

            }

        }

        return list;

    }

});