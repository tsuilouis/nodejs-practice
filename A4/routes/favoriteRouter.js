var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');

var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    var id = req.decoded._doc._id;
    Favorites.findOne({ postedBy: id })
        .populate('postedBy')
        .populate('dishes')
        .exec(function (err, favorite) {
            if (err) throw err;
            res.json(favorite);
    });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    // property added in verifyOrdinaryUser()
    var id = req.decoded._doc._id;
    // the query runs at the exec()
    Favorites.findOne({ postedBy: id})
        .exec(function (err, favorites) {
            if (err) throw err;
            // null response returned by findOne(), [] by find()
            if (!favorites) {
                console.log('No Favorites document created for user yet!');
                Favorites.create({
                    postedBy: id,
                    dishes: []
                }, function (err, favorite) {
                    if (err) throw err;
                    console.log('Favorites created successfully!');

                    // insert dish into User's newly created Favorites document
                    favorite.dishes.push(req.body._id);
                    favorite.save(function (err, resp) {
                        if (err) throw err;
                        console.log('Added to Favorites dish with id: ' + req.body._id);
                        res.json(resp); // covers writing headers and end
                    });
                });
            } else {
                console.log('Favorites document exists, adding dish');
                // add dish to Favorites if not already inserted
                // simple implementation
                var isDishPresent = false;
                for (var i = (favorites.dishes.length - 1); i >= 0; i--) {
                    // using == instead of === because
                    // favorites.dishes[i] is an object while
                    // req.body._id is a string
                    if (favorites.dishes[i] == req.body._id) {
                        isDishPresent = true;
                        break;
                    }
                }
                if (!isDishPresent) {
                    favorites.dishes.push(req.body._id);
                    favorites.save(function (err, resp) {
                        if (err) throw err;
                        console.log('Added to Favorites dish with id: ' +
                            req.body._id);
                        res.json(resp);
                    });
                } else {
                    console.log('Dish with id: ' + req.body._id +
                        ' already present!');
                    res.json(favorites);
                }

                // wondering about alternative methods to accomplish the above
                // Favorites.update({ postedBy: id},
                //     { $addToSet: {dishes: req.body._id} }
                //     function (err, resp) {
                //         if (err) throw err;
                //          res.json(resp);
                //     });
            }
        });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    // obtain User's ObjectId and delete their Favorites
    var id = req.decoded._doc._id;
    console.log('Deleting favorites of user with id: ' + id);
    Favorites.findOneAndRemove({ postedBy: id }, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
});

favoriteRouter.route('/:dishId')
.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    // obtain User's ObjectId
    var id = req.decoded._doc._id;
    Favorites.findOne({postedBy: id})
        .exec(function (err, favorite) {
            if (err) throw err;
            // if the User can be found, remove the favorited dish
            // incorrect to use Favorites.findByIdAndRemove() as
            // it expects a Favorites _id
            favorite.dishes = favorite.dishes.filter(
                item => item != req.params.dishId);
            favorite.save(function (err, resp) {
                if (err) throw err;
                res.json(resp);
            });
        });
});

module.exports = favoriteRouter;
