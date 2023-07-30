'use strict'
const alj = require('./alj.js');

let count = 0;
alj.loadRecords('sample.json', (err, rec) => {
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
