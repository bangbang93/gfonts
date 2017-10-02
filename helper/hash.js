/**
 * Created by bangbang93 on 2017/10/2.
 */
'use strict';
const crypto = require('crypto')

exports.md5 = function (str) {
  return crypto.createHash('md5').update(str).digest('hex')
}
