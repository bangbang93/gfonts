/**
 * Created by bangbang93 on 16/9/12.
 */
'use strict';
const router = require('express').Router();
const request = require('superagent');
const co = require('co');
const fs = require('co-fs');
const path = require('path');
const mkdirp = require('co-mkdirp');
const publicDir = path.resolve(__dirname, '../public');
const helper = require('../helper/replace');

router.get('/css', function (req, res, next) {
  let url = req.url;
  let https = Boolean(req.get('isHttps'));
  let file = path.join(publicDir, `${https?'https':'http'}${url}`);
  co(function*(){
    if (yield fs.exists(file)){
      res.type('css').sendFile(file);
    } else {
      let res = yield request.get('http://ajax.googleapis.com' + url);
      if (res.statusCode != 200){
         return res.sendStatus(404);
      }
      let style = helper.replaceBody(res.body);
      if (!fs.exists(path.dirname(file))){
        yield mkdirp(path.dirname(file));
      }
      res.type('css').send(style);
      yield fs.writeFile(file, style);
    }
  })
    .catch(next);
});

router.get('/s', function (req, res, next) {
  let url = req.url;
  let file = path.join(publicDir, url);
  co(function*(){
    if (yield fs.exists(file)){
      res.type('font').sendFile(file);
    } else {
      let res = yield request.get('http://fonts.googleapis.com' + url);
      if (res.statusCode != 200){
        return res.sendStatus(404);
      }
      let font = res.body;
      if (!fs.exists(path.dirname(file))){
        yield mkdirp(path.dirname(file));
      }
      res.type('font').send(font);
      yield fs.writeFile(file, font);
    }
  })
    .catch(next);
});

router.get('/ajax', function (req, res, next) {
  let url = req.url;
  console.log(url);
  let file = path.join(publicDir, url);
  co(function*(){
    if (yield fs.exists(file)){
      res.type('js').sendFile(file);
    } else {
      let res = yield request.get('http://ajax.googleapis.com' + url);
      if (res.statusCode != 200){
        return res.sendStatus(404);
      }
      let font = res.body;
      if (!fs.exists(path.dirname(file))){
        yield mkdirp(path.dirname(file));
      }
      res.type('js').send(font);
      yield fs.writeFile(file, font);
    }
  })
    .catch(next);
});

module.exports = router;