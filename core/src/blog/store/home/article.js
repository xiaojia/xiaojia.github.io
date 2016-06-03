/*
 * main
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'blog:store/home/article'
}, function (require, module, exports, Simple) {

    var deferred = Simple.Deferred;
    var utils = Simple.Utils;
    var ajax = Simple.Tools.ajax;

    var parser = function () {

    };

    module.exports = Simple.Store.extend({

        url: 'article/list.json',

        /**
         * 解析文章
         */
        format: function (dtd, params, data, response) {

            var articleRequest = [];
            var markdownParse = new markdownit();

            utils.each(data, function (value) {
                var url = Simple.Module.path.source(value.url, null);
                articleRequest.push(ajax.get(url, null, 'html'));
            });

            deferred.when.apply(deferred.when, articleRequest).done(function () {

                var article = [];

                utils.each(arguments, function (value) {

                    var text = value[0];

                    if (!text) {
                        return;
                    }

                    var content = text.split('\n');
                    var title, time, name;

                    if (content[0]) {
                        title = content[0].replace(/\/\//ig, '');
                    }

                    if (content[1]) {
                        name = content[1].replace(/\/\//ig, '');
                    }

                    if (content[2]) {
                        time = content[2].replace(/\/\//ig, '');
                    }

                    if (title && name && time) {
                        article.push({
                            title: title,
                            name: name,
                            time: time,
                            content: content.slice(3).join('\n')
                        });
                    }
                });

                dtd.resolve(article, response);

            });

            return false;

        }

    });

    module.exports.setName(module.id);

});