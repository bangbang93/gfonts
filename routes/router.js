/**
 * Created by bangbang93 on 16/9/12.
 */
'use strict';
const router = require('express').Router();
const request = require('co-request');
const co = require('co');
const fs = require('co-fs');
const path = require('path');
const mkdirp = require('co-mkdirp');
const publicDir = path.resolve(__dirname, '../public');
const helper = require('../helper/replace');

router.get('/css', function (req, res, next) {
  let url = req.url;
  let https = Boolean(req.get('isHttps'));
  let file = path.join(publicDir, `css/${https?'https':'http'}/${encodeURIComponent(url.substr(5))}`);
  co(function*(){
    if (yield fs.exists(file)){
      res.type('css').sendFile(file);
    } else {
      let response = yield request.get('https://fonts.googleapis.com' + url);
      if (response.statusCode != 200){
        return res.status(response.statusCode).send(response.body);
      }
      let style = helper.replaceBody(response.body);
      res.type('css').send(style);
      if (! (yield fs.exists(path.dirname(file)))){
        yield mkdirp(path.dirname(file));
      }
      yield fs.writeFile(file, style);
    }
  })
    .catch(next);
});

router.get('/s/*', function (req, res, next) {
  let url = req.url;
  let file = path.join(publicDir, url);
  co(function*(){
    if (yield fs.exists(file)){
      res.type('font').sendFile(file);
    } else {
      let response = yield request.get('https://fonts.gstatic.com' + url, {encoding: null});
      if (response.statusCode != 200){
        return res.status(response.statusCode).send(response.body);
      }
      let font = response.body;
      res.type('font').send(font);
      if (! (yield fs.exists(path.dirname(file)))){
        yield mkdirp(path.dirname(file));
      }
      yield fs.writeFile(file, font);
    }
  })
    .catch(next);
});

router.get('/ajax/*', function (req, res, next) {
  let url = req.url;
  let file = path.join(publicDir, url);
  co(function*(){
    if (yield fs.exists(file)){
      res.type('js').sendFile(file);
    } else {
      let response = yield request.get('https://ajax.googleapis.com' + url);
      if (response.statusCode != 200){
        return res.status(response.statusCode).send(response.body);
      }
      let font = response.body;
      res.type('js').send(font);
      if (! (yield fs.exists(path.dirname(file)))){
        yield mkdirp(path.dirname(file));
      }
      yield fs.writeFile(file, font);
    }
  })
    .catch(next);
});

module.exports = router;