'use strict'
const alj = require('./alj.js');

let count = 0;
alj.loadRecords('large-data-file', (err, rec) => {
  if(err) {
    console.error(err);
    return -1; /* stop */
  }
  console.log(rec);
  count++;
  if(count > 10) return -1; /* stop */
});
