/* jshint node: true, mocha: true */

var util = require('util');
var expect = require('chai').expect;

var mod = require('../');

describe('[index]', function() {
    describe('#merge', function() {
        var ONE = 'thing';
        var TWO = 'stuff';
        var THREE = 'pineapples';
        
        var ONEC1 = '# thing comment 1\nthing';
        var ONEC2 = '# thing comment 2\nthing';
        
        var TWOC1 = '# stuff comment 1\nstuff';
        
        var CRLF = util.format('%s\r\n%s\r\n%s', ONE, TWO, THREE);
        
        it('merged two string together', function() {
            var out = mod.merge(ONE, TWO);
            expect(out).to.equal(
                [ONE, TWO].join('\n') + '\n'
            );
        });
        
        it('merged three strings together', function() {
            var out = mod.merge(ONE, TWO, THREE);
            expect(out).to.equal(
                [ONE, TWO, THREE].join('\n') + '\n'
            );    
        });
        
        it('detects and merges comments', function() {
            var out = mod.merge(ONEC1, ONEC2);
            expect(out).to.equal([
                '# thing comment 1',
                '# thing comment 2',
                'thing'
            ].join('\n') + '\n');
        });
        
        it('converts crlf lines to ln in the output', function() {
            var out = mod.merge(CRLF);
            var expectedOut = mod.merge(ONE, TWO, THREE);
            
            expect(out).to.equal(expectedOut);
            expect(/\r\n/.test(out)).to.equal(false);
        });
        
        it('always ends with one new line', function() {
            var out = mod.merge(THREE);
            expect(out).to.equal(THREE + '\n');
        });
        
        it('adds one new line before every comment block', function() {
            var out = mod.merge(THREE, ONEC1, TWOC1);
            
            var matches = out.match(/\n\n#/g);
            expect(matches).to.have.lengthOf(2);
        });
    });
    
    describe('#mergeRaw', function() {
        var ONE = [{ line: 'thing' }];
        var TWO = [{ line: 'stuff' }];
        var THREE = [{ line: 'pineapples' }];
        
        var ONEC1 = [{ line: 'thing', comments: ['# thing comment 1'] }];
        var ONEC2 = [{ line: 'thing', comments: ['# thing comment 2'] }];
        
        it('merges two arrays into one', function() {
            var merged = mod.mergeRaw(ONE, TWO);
            
            expect(merged).to.be.an('array').and.to.have.lengthOf(2);
            expect(merged[0]).to.deep.equal(ONE[0]);
            expect(merged[1]).to.deep.equal(TWO[0]);
        });
        
        it('merges three arrays into one', function() {
            var merged = mod.mergeRaw(ONE, TWO, THREE);
            
            expect(merged).to.be.an('array').and.to.have.lengthOf(3);
            expect(merged[0]).to.deep.equal(ONE[0]);
            expect(merged[1]).to.deep.equal(TWO[0]);
            expect(merged[2]).to.deep.equal(THREE[0]);
        });
        
        it('removes duplicates', function() {
            var merged = mod.mergeRaw(ONE, ONE);
            
            expect(merged).to.be.an('array').and.to.have.lengthOf(1);
            expect(merged[0]).to.deep.equal(ONE[0]);
        });
        
        it('removes duplicates with comments', function() {
            var merged = mod.mergeRaw(ONEC1, ONEC1);
            
            expect(merged).to.be.an('array').and.to.have.lengthOf(1);
            expect(merged[0]).to.deep.equal(ONEC1[0]);
        });
        
        it('merged comments', function() {
            var merged = mod.mergeRaw(ONEC1, ONEC2);
            
            expect(merged).to.be.an('array').and.to.have.lengthOf(1);
            
            expect(merged[0]).to.have.property('line')
                .and.to.equal(ONEC1[0].line);
            
            expect(merged[0]).to.have.property('comments')
                .and.to.be.an('array')
                .and.to.have.lengthOf(2)
                .and.to.deep.equal(
                    [].concat(ONEC1[0].comments).concat(ONEC2[0].comments)
                );
        });
        
        [{
            name: 'merges a comment line with a non-comment line',
            result: mod.mergeRaw(ONEC1, ONE)
        }, {
            name: 'merges a non-comment line with a comment line',
            result: mod.mergeRaw(ONE, ONEC1)
        }].forEach(function(t) {
            it(t.name, function() {
                var merged = t.result;

                expect(merged).to.be.an('array').and.to.have.lengthOf(1);

                expect(merged[0]).to.have.property('line')
                    .and.to.equal(ONEC1[0].line);

                expect(merged[0]).to.have.property('comments')
                    .and.to.be.an('array')
                    .and.to.have.lengthOf(1)
                    .and.to.deep.equal(ONEC1[0].comments);    
            });
        });
    });
    
    describe('#tokenize', function() {
        it('takes a string an returns an array');
        it('saves comments in the token object');
    });
    
    describe('#serialize', function() {
        it('takes the tokenized array and returns a string');
    });
});
