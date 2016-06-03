/*
 * simple-project-compile
 *
 * name: xiaojia
 * date: 16/5/5
 */

var path = require('path');

Simple.Tools.compile({
    name: 'blog',
    type: 'core',
    compress: true,
    skip: ['server'],
    apps: {
        'index.html': 'blog:application/home/main'
    },
    packages: {
        blog: path.normalize(__dirname + '/src/blog/'),
        common: path.normalize(__dirname + '/src/common/'),
        simple: path.normalize(__dirname + '/../../simple-framework/simple/src/')
    }
});