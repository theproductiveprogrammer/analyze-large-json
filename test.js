'use strict'
const alj = require('./alj.js');

alj.loadRecords('large-data-file', rec => {
  console.log(rec);
});
