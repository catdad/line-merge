/* jshint node: true */

var _ = require('lodash');

function validStrings(arr) {
    return arr.every(_.isString);
}

function validArrays(arr) {
    return arr.every(_.isArray);
}

function validObjectArray(arr) {
    return _.isArray(arr) && arr.every(_.isPlainObject);
}

function clean(str) {
    return str.replace(/(\r\n)+/g, '\n');
}

function tokenize(str) {
    if (!_.isString(str)) {
        throw new TypeError('the tokenize parameter must be a string');
    }

    str = clean(str);
    
    var comments = [];
    var tokens = [];

    str.split('\n').forEach(function(line) {
        if (/^#/.test(line)) {
            // this is a comment, so save it
            comments.push(line);
            return;
        }

        var token = {
            line: line
        };

        if (comments.length) {
            // save comments on the token and reset
            // the comments array
            token.comments = comments;
            comments = [];
        }

        tokens.push(token);
    });
    
    return tokens;
}

function serialize(arr) {
    if (!validObjectArray(arr)) {
        throw new TypeError('the serialize parameter must be an array of objects');
    }
    
    // lucky for us, we want a new line at the end (because git),
    // so we can go ahead and always add a new line
    return arr.reduce(function(str, token) {
        if (token.comments) {
            str += '\n' + token.comments.join('\n') + '\n';
        }

        str += token.line + '\n';
        return str;
    }, '').trim() + '\n';
    // in case the file starts with a comment, we will
    // trim and add a new line at the end manually
}

// for now, we will only merge two at a time
// that should be all that is required here
function mergeComments(first, second) {
    if (_.isEqual(first, second)) {
        return first;
    }
    
    return first.concat(second);
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
    var tokenized = [].slice.call(arguments);
    return tokenized.reduce(mergeIn, []);
}

function mergeRaw() {
    var tokenized = [].slice.call(arguments).map(_.cloneDeep);
    
    if (!validArrays(tokenized)) {
        throw new TypeError('all mergeRaw parameters must be arrays');
    }
    // TODO validation?
    
    return mergeRawInternal.apply(undefined, tokenized);
}

function merge() {
    var strings = [].slice.call(arguments);
    
    if (!validStrings(strings)) {
        throw new TypeError('all merge parameters must be strings');
    }
    
    var mergedTokens = mergeRawInternal.apply(undefined, strings.map(tokenize));
    return serialize(mergedTokens);
}

module.exports = {
    merge: merge,
    mergeRaw: mergeRaw,
    tokenize: tokenize,
    serialize: serialize
};
