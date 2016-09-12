/**
 * Created by bangbang93 on 16/9/12.
 */
'use strict';

const host = 'libs.bangbang93.com';

exports.replaceBody = function (body) {
  body = body.replace('ajax.googleapis.com', host);
  body = body.replace('fonts.googleapis.com', host);
  return body;
};