/**
 * Created by bangbang93 on 16/9/12.
 */
'use strict';
const router = require('express-promise-router')();
const got = require('got');
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
    try {
      let response = await got('https://fonts.googleapis.com' + url);

      let style = ReplaceHelper.replaceBody(response.body);
      res.type('css').send(style);

      await fs.outputFile(file, style);
    } catch (e) {
      console.log(e)
      return res.status(e.statusCode).type(e.headers['content-type']).send(e.body);
    }
  }
});

router.get('/s/*', async function (req, res) {
  let url = req.url;
  let file = path.join(publicDir, url);
    if (await fs.pathExists(file)){
      res.type('font').sendFile(file);
    } else {
      try {
        let response = await got('https://fonts.gstatic.com' + url, {encoding: null});


        let font = response.body;
        res.type('font').send(font);

        await fs.outputFile(file, font);
      } catch (e) {
        return res.status(e.statusCode).type(e.headers['content-type']).send(e.body);
      }
    }
});

router.get('/ajax/*', async function (req, res) {
  let url = req.url;
  let file = path.join(publicDir, url);
  if (await fs.pathExists(file)){
    res.type('js').sendFile(file);
  } else {
    try {
      let response = await got('https://ajax.googleapis.com' + url, {resolveWithFullResponse: true});

      let font = response.body;
      res.type('js').send(font);

      await fs.outputFile(file, font);
    } catch (e) {
      return res.status(e.statusCode).type(e.headers['content-type']).send(e.body);
    }
  }
});

module.exports = router;
