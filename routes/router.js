/**
 * Created by bangbang93 on 16/9/12.
 */
'use strict';
const router = require('express-promise-router')();
const request = require('co-request');
const fs = require('fs-extra');
const path = require('path');
const mkdirp = require('co-mkdirp');
const publicDir = path.resolve(__dirname, '../public');
const ReplaceHelper = require('../helper/replace');
const HashHelper = require('../helper/hash')


router.get('/css', async function (req, res) {
  let url = req.url.toLowerCase();
  let https = Boolean(req.get('isHttps'));
  let file = path.join(publicDir, `css/${https?'https':'http'}/${HashHelper.md5(url.substr(5))}`);
  if (await fs.exists(file)){
    res.type('css').sendFile(file);
  } else {
    console.log('https://fonts.googleapis.com' + url)
    let response = await request.get('https://fonts.googleapis.com' + url);
    if (response.statusCode !== 200){
      return res.status(response.statusCode).send(response.body);
    }
    let style = ReplaceHelper.replaceBody(response.body);
    res.type('css').send(style);
    if (! (await fs.exists(path.dirname(file)))){
      await mkdirp(path.dirname(file));
    }
    await fs.writeFile(file, style);
  }
});

router.get('/s/*', async function (req, res) {
  let url = req.url;
  let file = path.join(publicDir, url);
    if (await fs.exists(file)){
      res.type('font').sendFile(file);
    } else {
      let response = await request.get('https://fonts.gstatic.com' + url, {encoding: null});
      if (response.statusCode !== 200){
        return res.status(response.statusCode).send(response.body);
      }
      let font = response.body;
      res.type('font').send(font);
      if (! (await fs.exists(path.dirname(file)))){
        await mkdirp(path.dirname(file));
      }
      await fs.writeFile(file, font);
    }
});

router.get('/ajax/*', async function (req, res) {
  let url = req.url;
  let file = path.join(publicDir, url);
  if (await fs.exists(file)){
    res.type('js').sendFile(file);
  } else {
    let response = await request.get('https://ajax.googleapis.com' + url);
    if (response.statusCode !== 200){
      return res.status(response.statusCode).send(response.body);
    }
    let font = response.body;
    res.type('js').send(font);
    if (! (await fs.exists(path.dirname(file)))){
      await mkdirp(path.dirname(file));
    }
    await fs.writeFile(file, font);
  }
});

module.exports = router;
