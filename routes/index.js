var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(`
    <script>
    const baseUrl = location.origin
    </script>
    <h1>Google Fonts Proxy</h1>
    <p>Usage:</p>
    <ul>
      <li><script> document.write(baseUrl) </script>/css?family=Roboto</li>
      <li><script> document.write(baseUrl) </script>/css?family=Roboto:400,700</li>
      <li><script> document.write(baseUrl) </script>/css?family=Roboto:400,700|Material+Icons</li>
      <li><script> document.write(baseUrl) </script>/icon?family=Material+Icons</li>
    </ul>
    <hr>
    <p>Source code: <a href="https://github.com/bangbang93/gfonts"> https://github.com/bangbang93/gfonts </a></p>
  `);
});

module.exports = router;
