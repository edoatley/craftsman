'use strict';

var fs = require('fs');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var FileSizeWatcher = function(path) {
    var self = this;

    self.callbacks = {};

    if(/^\//.test(path) === false) {
        process.nextTick(function() {
            self.emit('error', 'Path does not start with a slash');
        });
        return;
    }

    fs.stat(path, function(err, stats) {
        self.lastfilesize = stats.size;
    });

    self.interval = setInterval(function() {
        fs.stat(path, function(err, stats) {
            if(stats.size > self.lastfilesize) {
                self.emit('grew', stats.size - self.lastfilesize);
                self.lastfilesize = stats.size;
            }
            if(stats.size < self.lastfilesize) {
                self.emit('shrank', self.lastfilesize - stats.size);
                self.lastfilesize = stats.size;
            }
        }, 1000);
    });
};

util.inherits(FileSizeWatcher, EventEmitter);

FileSizeWatcher.prototype.stop = function() {
    clearInterval(this.interval);
};

module.exports = FileSizeWatcher;
