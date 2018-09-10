/**
 * Created by bangbang93 on 16/9/12.
 */
'use strict';
const router = require('express-promise-router')();
const request = require('request-promise');
const fs = require('fs-extra');
const path = require('path');
const publicDir = path.resolve(__dirname, '../public');
const ReplaceHelper = require('../helper/replace');
const HashHelper = require('../helper/hash')


router.get('/:cssType(css|icon)', async function (req, res) {
  let url = req.url;
  let https = Boolean(req.get('isHttps'));
  let file = path.join(publicDir, `${req.params.cssType}/${https?'https':'http'}/${HashHelper.md5(url.substr(5))}`);
  if (await fs.pathExists(file)){
    res.type('css').sendFile(file);
  } else {
    let response = await request.get('https://fonts.googleapis.com' + url, {resolveWithFullResponse: true});
    if (response.statusCode !== 200){
      return res.status(response.statusCode).type(response.headers['content-type']).send(response.body);
    }

    let style = ReplaceHelper.replaceBody(response.body);
    res.type('css').send(style);

    await fs.outputFile(file, style);
  }
});

router.get('/s/*', async function (req, res) {
  let url = req.url;
  let file = path.join(publicDir, url);
    if (await fs.pathExists(file)){
      res.type('font').sendFile(file);
    } else {
      let response = await request.get('https://fonts.gstatic.com' + url, {encoding: null, resolveWithFullResponse: true});
      if (response.statusCode !== 200){
        return res.status(response.statusCode).type(response.headers['content-type']).send(response.body);
      }

      let font = response.body;
      res.type('font').send(font);

      await fs.outputFile(file, font);
    }
});

router.get('/ajax/*', async function (req, res) {
  let url = req.url;
  let file = path.join(publicDir, url);
  if (await fs.pathExists(file)){
    res.type('js').sendFile(file);
  } else {
    let response = await request.get('https://ajax.googleapis.com' + url, {resolveWithFullResponse: true});
    if (response.statusCode !== 200){
      return res.status(response.statusCode).type(response.headers['content-type']).send(response.body);
    }

    let font = response.body;
    res.type('js').send(font);

    await fs.outputFile(file, font);
  }
});

module.exports = router;
