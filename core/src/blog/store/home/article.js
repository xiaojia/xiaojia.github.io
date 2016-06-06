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

    var markdownParse = new markdownit();

    var parser = function (data, dtd, response) {

        var article = [];

        utils.each(data, function (value) {

            var text = value[0];

            if (!text) {
                return;
            }

            var content = text.split('\n');
            var title, date, author;

            utils.each(content, function (line) {

                if (line.trim().indexOf('//') === 0) {

                    line = line.replace(/\/\//ig, '');
                    line = line.split(':');

                    switch (line[0].trim()) {
                        case 'title':
                            title = line[1].trim();
                            break;
                        case 'author':
                            author = line[1].trim();
                            break;
                        case 'date':
                            date = line[1].trim();
                            break;
                    }

                } else {
                    return false;
                }

            });

            if (title && author && date) {
                article.push({
                    title: title,
                    author: author,
                    date: date,
                    id: value[2],
                    content: content.slice(3).join('\n')
                });
            }
        });

        dtd.resolve(article, response);

    };

    module.exports = Simple.Store.extend({

        url: 'article/list.json',

        /**
         * 解析文章
         */
        format: function (dtd, params, data, response) {

            var articleRequest = [];

            utils.each(data, function (value) {
                var url = Simple.Module.path.source(value.url, null);
                articleRequest.push(ajax.get(url, null, 'html', value.url));
            });

            deferred.when.apply(deferred.when, articleRequest).done(function () {
                parser(arguments, dtd, response);
            });

            return false;

        }

    });

    module.exports.setName(module.id);

});