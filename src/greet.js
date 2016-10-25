'use strict';

var greet = function(name) {
    if(name === undefined) {
        return 'Hello World!';
    }
    else {
        return 'Hello ' + name + '!';
    }
};

module.exports = greet;
