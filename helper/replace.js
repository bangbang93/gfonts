/**
 * Created by bangbang93 on 16/9/12.
 */
'use strict';

const host = 'libs.bangbang93.com';

exports.replaceBody = function (body) {
  body = body.replace(new RegExp('ajax.googleapis.com', 'g'), host);
  body = body.replace(new RegExp('ajax.gstatic.com', 'g'), host);
  body = body.replace(new RegExp('fonts.googleapis.com', 'g'), host);
  body = body.replace(new RegExp('fonts.gstatic.com', 'g'), host);
  return body;
};