/*
 * main
 *
 * name: xiaojia
 * date: 16/5/30
 */

Simple.Module({
    name: 'blog:store/home/detail'
}, function (require, module, exports, Simple) {

    var utils = Simple.Utils;
    var ajax = Simple.Tools.ajax;

    var markdownParse = new markdownit();

    var parser = function (data, res, context, dtd, response) {

        var detail;

        var text = data;

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
            detail = {
                title: title,
                author: author,
                date: date,
                id: context.url,
                originalUrl: context.originalUrl,
                content: markdownParse.render(content.slice(3).join('\n'))
            };
        }

        dtd.resolve(detail, response);

    };

    module.exports = Simple.Store.extend({

        url: 'article/list.json',

        cache: true,

        /**
         * 解析文章
         */
        format: function (dtd, params, data, response) {

            var detail;

            utils.each(data, function (value) {
                if (value.url === params.id) {
                    var url = Simple.Module.path.source(value.url, null);
                    detail = ajax.get(url, {
                        dataType: 'HTML',
                        context: {
                            url: value.url,
                            originalUrl: url,
                            cache: true
                        }
                    });
                    return false;
                }
            });

            detail.done(function (data, res, context) {
                parser(data, res, context, dtd, response);
            });

            return false;

        }

    });

    module.exports.setName(module.id);

});