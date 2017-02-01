var mongoose = require('mongoose'),
    assert = require('assert');

var Leaders = require('./models/leadership');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");

    // create a new leadership
    Leaders.create({
        name: 'Peter Pan',
        image: 'images/alberto.png',
        designation: 'Chief Epicurious Officer',
        abbr: 'CEO',
        description: 'Our CEO, Peter,...'
    }, function (err, leader) {
        if (err) throw err;
        console.log('Leadership created!');
        console.log(leader);

        var id = leader._id;

        // get all the leaderships
        setTimeout(function () {
            Leaders.findByIdAndUpdate(id, {
                    $set: {
                        designation: 'Janitor',
                        abbr: '',
                        description: 'Our janitor, Peter,...'
                    }
                }, {
                    new: true
                })
                .exec(function (err, leader) {
                    if (err) throw err;
                    console.log('Updated Leaders!');
                    console.log(leader);

                    db.collection('leadership').drop(function () {
                        db.close();
                    });
                });
        }, 3000);
    });
});
