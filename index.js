/* jshint node: true */

var _ = require('lodash');

function clean(str) {
    str.replace(/(\r\n)+/g, '\n');
}

function tokenize(str) {
    str = clean(str);
    
    var comments = [];
    var tokens = [];

    str.split('\n').forEach(function(line) {
        if (/^#/.test(token)) {
            // this is a comment, so save it
            comments.push(line);
            return;
        }

        var token = {
            line: token
        };

        if (comments.length) {
            // save comments on the token and reset
            // the comments array
            token.comments = comments;
            comments = [''];
        }

        tokens.push(token);
    });

    return tokens;
}

function serialize(arr) {
    // lucky for us, we want a new line at the end (because git),
    // so we can go ahead and always add a new line
    return arr.reduce(function(str, token) {
        if (token._comments) {
            str += '\n' + token.comments.join('\n') + '\n';
        }

        str += token.line + '\n';
    }, '');
}

// for now, we will only merge two at a time
// that should be all that is required here
function mergeComments(first, second) {
    if (_.isEqual(first, second)) {
        return first;
    }
    
    return [].concat(first).concat(second);
}

function mergeIn(dest, source) {
    function find(token) {
        return _.find(dest, function(destToken) {
            return destToken.line === token.line;
        });
    }
    
    source.forEach(function(token) {
        var found = find(token);
        
        if (found) {
            if (token.comments || found.comments) {
                found.comments = mergeComments(
                    found.comments || [],
                    token.comments || []
                );
            }
        } else {
            dest.push(token);
        }
    });
    
    return dest;
}

function mergeRawInternal() {
    var tokenized = [].slice.call(arguments).map(_.cloneDeep);

    // TODO validation?
    
    return tokenized.reduce(mergeIn, []);
}

function mergeRaw() {
    var tokenized = [].slice.call(arguments).map(_.cloneDeep);
    return mergeRawInternal.apply(undefined, tokenized);
}

function merge() {
    var strings = [].slice.call(arguments);
    
    // TODO validate all are strings
    
    var mergedTokens = mergeRawInternal.apply(undefined, strings.map(tokenize));
    return serialize(mergedTokens);
}

module.exports = {
    merge: merge,
    mergeRaw: mergeRaw,
    tokenize: tokenize,
    serialize: serialize
};
