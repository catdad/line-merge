# line merge

[![Build][1]][2]
[![Test Coverage][3]][4]
[![Code Climate][5]][6]
[![Downloads][7]][8]
[![Version][9]][8]
[![Dependency Status][10]][11]

[1]: https://travis-ci.org/catdad/line-merge.svg?branch=master
[2]: https://travis-ci.org/catdad/line-merge

[3]: https://codeclimate.com/github/catdad/line-merge/badges/coverage.svg
[4]: https://codeclimate.com/github/catdad/line-merge/coverage

[5]: https://codeclimate.com/github/catdad/line-merge/badges/gpa.svg
[6]: https://codeclimate.com/github/catdad/line-merge

[7]: https://img.shields.io/npm/dm/line-merge.svg
[8]: https://www.npmjs.com/package/line-merge
[9]: https://img.shields.io/npm/v/line-merge.svg

[10]: https://david-dm.org/catdad/line-merge.svg
[11]: https://david-dm.org/catdad/line-merge

This kind of weird lib was created for a kind of weird reason. I needed to merge what are essentially list files -- files that have one list item per line. Namely, files like `.gitignore`. This module will merge the contents of such files, resulting in a unique list of item (duplicated will be removed), and it will do its best to preserve comments and new lines.

## Install

```bash
npm install line-merge
```

## Use

The main function you will care about is the `merge` function.

#### **`merge({String} str, ...)`** → `{String}`

Takes any number of strings, and merges all the unique lines in each, resulting in a single string containing all lines from the input strings. It will merge all strings passed into the method in order.

```javascript
var fs = require('fs');
var lines = require('line-merge');

var file1 = fs.readFileSync('location/to/one/.gitignore', 'utf8');
var file2 = fs.readFileSync('location/to/two/.gitignore', 'utf8');
var file3 = fs.readFileSync('location/to/three/.gitignore', 'utf8');

var merged = lines.merge(file1, file2, file3);

fs.writeFileSync('location/to/merged/.gitingore', merged);
```

You can also access the internals:

#### **`tokenize({String} str)`** → `{Array}`

Tokenize a single list string into an array.

```javascript
var tokens = lines.tokenize('pineapples\ncherries');
// [{ line: 'pineapples' }, { line: 'cherries' }]
```

Comments are determined as lines that start with `#`.

```javascript
var tokens = lines.tokenize('# fruits\npineapples\ncherries');
// [{ line: 'pineapples', comments: ['# fruits'] }, { line: 'cherries' }]
```

#### **`serialize({Array} arr)`** → `{String}`

Serialize a tokenized array into a list string.

```javascript
var output = lines.serialize([
    { line: 'pineapples' },
    { line: 'cherries' }
]);
// 'pineapples\ncherries\n'
```

_Note that the output will always end in a new line._

#### **`mergeRaw({Array} arr, ...)`** → `{Array}`

Merges the underlying tokenized array representation of the list files. It will merge all arrays passed into the method in order.

```javascript
var tokens = lines.mergeRaw(
    [{ line: 'pineapples' }, { line: 'apples' }],
    [{ line: 'cherries' }, { line: 'apples', comments: ['# not the company'] }]
);

// [{ line: 'pineapples' }, { line: 'apples', comments: ['# not the company'] }, { line: 'cherries' }]
```
