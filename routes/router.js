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

router.get(['/css/*', '/css'], function (req, res, next) {
  let url = req.url;
  let https = Boolean(req.get('isHttps'));
  let file = path.join(publicDir, `css/${https?'https':'http'}/${encodeURIComponent(url.substr(5))}`);
  co(function*(){
    if (yield fs.exists(file)){
      res.type('css').sendFile(file);
    } else {
      try{
        let response = yield request.get('https://fonts.googleapis.com' + url);
        let style = helper.replaceBody(response.text);
        res.type('css').send(style);
        if (! (yield fs.exists(path.dirname(file)))){
          yield mkdirp(path.dirname(file));
        }
        yield fs.writeFile(file, style);
      } catch(e){
        if (e.status){
          return res.status(e.status).send(e.response.text);
        }
        throw e;
      }
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
      try {
        let response = yield request.get('https://fonts.googleapis.com' + url);
        let font = response.text;
        res.type('font').send(font);
        if (! (yield fs.exists(path.dirname(file)))){
          yield mkdirp(path.dirname(file));
        }
        yield fs.writeFile(file, font);
      } catch(e){
        if (e.status){
          return res.status(e.status).send(e.response.text);
        }
        throw e;
      }
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
      try {
        let response = yield request.get('https://ajax.googleapis.com' + url);
        if (response.statusCode != 200){
          return res.sendStatus(404);
        }
        let font = response.text;
        res.type('js').send(font);
        if (! (yield fs.exists(path.dirname(file)))){
          yield mkdirp(path.dirname(file));
        }
        yield fs.writeFile(file, font);
      } catch(e){
        if (e.status){
          return res.status(e.status).send(e.response.text);
        }
        throw e;
      }
    }
  })
    .catch(next);
});

module.exports = router;