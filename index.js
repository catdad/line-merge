/* jshint node: true */

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

function mergeIn(dest, source) {
    function find(token) {
        dest.find(function(destToken) {
            return destToken.line === token.line;
        });
    }
    
    source.forEach(function(token) {
        
    });
}

function mergeRaw() {
    var tokenizedStrings = [].slice.call(arguments);
    
    // TODO validation?
    
    return tokenizedStrings.reduce(mergeIn, []);
}

function merge() {
    var strings = [].slice.call(arguments);
    
    // TODO validate all are strings
    
    var mergedTokens = mergeRaw.apply(undefined, strings.map(tokenize));
    return serialize(mergedTokens);
}

module.exports = {
    merge: merge,
    mergeRaw: mergeRaw,
    tokenize: tokenize,
    serialize: serialize
};
