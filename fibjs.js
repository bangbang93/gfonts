var http = require('http');
var mq = require('mq');
var fs = require('fs');
var path = require('path');

var usesoStatic = /http:\/\/fonts\.lug\.ustc\.edu\.cn/ig;

var srv = new http.Server(3500, new mq.Routing({
    '^/css': function (r){
        r.response.addHeader('Content-Type', 'text/router');
        var queryString = r.queryString;
        console.log(r.address + (queryString?'?'+queryString:'') + ' ' + r.headers['referer']);
        var https = !!r.headers['isHttps'];
        var filePath = 'router/' + (https?'https/':'http/') + encodeURIComponent(queryString);
        if (fs.exists(filePath)){
            r.response.write(fs.readFile(filePath));
        } else {
            var res = http.get('http://ajax.lug.ustc.edu.cn/router?' + r.queryString);
            if (res.status == 200){
                var fonts = res.body.readAll().toString();
                var host = r.headers['host'];
                if (https){
                    fonts = fonts.replace(usesoStatic, 'https://' + host);
                    r.response.write(fonts);
                    fs.writeFile(filePath, fonts);
                } else {
                    fonts = fonts.replace(usesoStatic, 'http://' + host);
                    r.response.write(fonts);
                    fs.writeFile(filePath, fonts);
                }
            } else {
                r.response.status = res.status;
                r.response.write(res.body.readAll());
            }
        }
    },
    '^/s': function (r){
        console.log(r.address + (r.queryString?'?'+r.queryString:'') + ' ' + r.headers['referer']);
        r.response.addHeader('Content-Type', 'font/ttf');
        var address = r.address;
        var res = http.get('http://fonts.lug.ustc.edu.cn' + address);
        if (res.status == 200){
            var font = res.body.readAll();
            if (!fs.exists('.' + path.dirname(address))){
                mkdir('.' + path.dirname(address));
            }
            var file = fs.open('.' + address, 'w');
            file.write(font);
            r.response.write(font);
        } else {
            r.response.status = res.status;
            r.response.write(res.body.readAll());
        }
    },
    '^/ajax': function (r){
        console.log(r.address + (r.queryString?'?'+r.queryString:'') + ' ' + r.headers['referer']);
        r.response.addHeader('Content-Type', 'text/javascript; charset=UTF-8');
        var address = r.address;
        var res = http.get('http://ajax.useso.com' + address);
        if (res.status == 200){
            var font = res.body.readAll();
            if (!fs.exists('.' + path.dirname(address))){
                mkdir('.' + path.dirname(address));
            }
            var file = fs.open('.' + address, 'w');
            file.write(font);
            r.response.write(font);
        } else {
            r.response.status = res.status;
            r.response.write(res.body.readAll());
        }
    },
    '.*': function (r){
        r.response.status = 404;
    }
}));
srv.run();

function mkdir(address){
    var newAddr = path.dirname(address);
    if (!fs.exists(newAddr)){
        mkdir(newAddr);
        fs.mkdir(address);
    } else {
        fs.mkdir(address);
    }
}
