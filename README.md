# Analyze Large JSON Dumps

This is a small utility that helps analyze large JSON dumps that cannot be loaded into most text editors or using
simpler API's (like `var myjson = require('large-file.json').

It also handles zipped files since large JSON files can be zipped.

## Motivation

I wanted to analyze a large MySQL export (in JSON) format. The file size was 35 GB and it was quite difficult getting
any tool to give me effective results quickly so I wrote this one.

## Usage:

The library takes in a large JSON file (in txt or zipped format) and returns you the records one-by-one in a callback.
The last call to the callback will be empty signalling that all records have been read. Return a non-zero value from
the callback if you want the utility to stop processing anytime in between.

```js
const alj = require('analyze-large-json');

let count = 0;
alj.loadRecords('large-json-file.zip', (err, rec) => {
  if(err) {
    console.error(err);
    return -1; /* stop */
  }
  if(!rec) {
    console.log(`Done! Number of records: ${count}`);
  } else {
    console.log(rec);
    count++;
  }
});
```
