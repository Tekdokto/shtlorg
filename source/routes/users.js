var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/register', function(req, res, next) {
  console.log("req11",req)
  console.log("ressssss",res)
  res.render('register');
});

router.post('/register', function(req, res, next) {
  console.log("inregisterpage")
});



module.exports = router;
