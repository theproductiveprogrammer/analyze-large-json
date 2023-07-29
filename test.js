'use strict'
const alj = require('./alj.js');

alj.loadRecords('large-data-file', (err, rec) => {
  if(err) console.error(err);
  else console.log(rec);
});
