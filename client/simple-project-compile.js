/*
 * simple-project-compile
 *
 * name: xiaojia
 * date: 16/5/5
*/

var path = require('path');

Simple.Tools.compile({
    name: 'mcw',
    type: 'client',
    compress: true,
    skip: ['server'],
    apps: {
        'index.html': 'mcw:application/home/main',
        'list.html': 'mcw:application/list/main'
    },
    packages: {
        mcw: path.normalize(__dirname + '/../core/src/mcw/'),
        common: path.normalize(__dirname + '/../core/src/common/'),
        simple: path.normalize(__dirname + '/../simple-framework/simple/src/')
    }
});