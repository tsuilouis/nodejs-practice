module.exports = function() {
    var express = require('express');
    var bodyParser = require('body-parser');
    var router = express.Router();

    router.use(bodyParser.json());

    router.route('/')
    .all(function(req,res,next) {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          next();
    })
    .get(function(req,res,next){
            res.end('Will send all the leaders to you!');
    })
    .post(function(req, res, next){
        res.end('Will add the leader: ' + req.body.name + ' with details: ' + req.body.description);
    })
    .delete(function(req, res, next){
            res.end('Deleting all leaders');
    });

    router.route('/:leaderId')
    .all(function(req,res,next) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        next();
    })
    .get(function(req,res,next){
        res.end('Will send details of the leader: ' + req.params.leaderId +' to you!');
    })
    .put(function(req, res, next){
        res.write('Updating the leader: ' + req.params.leaderId + '\n');
        res.end('Will update the leader: ' + req.body.name +
                ' with details: ' + req.body.description);
    })
    .delete(function(req, res, next){
        res.end('Deleting leader: ' + req.params.leaderId);
    });

    // Express router has been implemented and now should be mounted on appropriate route
    return router;

}
