'use strict';

var FileSizeWatcher = require('../src/FileSizeWatcher');
var exec = require('child_process').exec;

describe('FileSizeWatcher', function() {

    var watcher;

    afterEach(function() {
        watcher.stop();
    });

    it('should fire a grew event when the file grew in size', function(done) {

        var path = '/var/tmp/filesizewatcher.test';
        exec('rm -f ' + path + ' ; touch ' + path, function() {
            watcher = new FileSizeWatcher(path);

            watcher.on('grew', function(gain) {
                expect(gain).toBe(5);
                done();
            });

            exec('echo "test" > ' + path, function() {});

        });
    });

    it('should fire a shrank event when the file shrank in size', function(done) {

        var path = '/var/tmp/filesizewatcher.test';
        exec('rm -f ' + path + ' ; echo "test" > ' + path, function() {
            watcher = new FileSizeWatcher(path);

            watcher.on('shrank', function(loss) {
                expect(loss).toBe(3);
                done();
            });

            exec('echo "a" > ' + path,function() {});

        });
    });

    it('should fire a error event if the path does not star with a slash', function(done) {

        var path = 'var/tmp/filesizewatcher.test';
        watcher = new FileSizeWatcher(path);

        watcher.on('error', function(err) {
            expect(err).toBe('Path does not start with a slash');
            done();
        });
    });
});
