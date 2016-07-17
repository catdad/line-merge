/* jshint node: true, mocha: true */

var expect = require('chai').expect;

var mod = require('../');

describe('[index]', function() {
    describe('#merge', function() {
        it('merged two string together');
        
        it('merged three strings together');
        
        it('detects and merges comments');
        
        it('converts crlf lines to ln in the output');
        
        it('always ends with one new line');
        
        it('adds one new line before every comment block');
    });
    
    describe('#mergeRaw', function() {
        var ONE = [{ line: 'thing' }];
        var TWO = [{ line: 'stuff' }];
        
        var ONEC1 = [{ line: 'thing', comments: ['# thing comment 1'] }];
        var ONEC2 = [{ line: 'thing', comments: ['# thing comment 2'] }];
        
        it('merges two arrays into one', function() {
            var merged = mod.mergeRaw(ONE, TWO);
            
            expect(merged).to.be.an('array').and.to.have.lengthOf(2);
            expect(merged[0]).to.deep.equal(ONE[0]);
            expect(merged[1]).to.deep.equal(TWO[0]);
        });
        
        it('merges three arrays into one');
        
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
