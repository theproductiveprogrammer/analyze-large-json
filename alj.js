'use strict'
const fs = require('fs');

function loadRecords(fname, cb) {
  const stream = fs.createReadStream(fname, {flags: 'r', encoding: 'utf-8' })
  stream.on('data', data => {
    console.log(data);
  });
}

module.exports = {
  loadRecords,
}
