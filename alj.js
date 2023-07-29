'use strict'
const fs = require('fs');

function loadRecords(fname, cb) {
  const stream = fs.createReadStream(fname, {flags: 'r'})

  /*    way/
   * Walk forward till we find the starting '{'
   * Push the buffer from that point onto the
   * chunk list. Walk the last buffer from the chunk list
   * until we find the terminating '}' then parse and return the record.
   * Continue till end.
   */
  let chunks;
  let sz;
  stream.on('data', data => {
    if(!chunks) {
      initChunks(data);
      if(!chunks) return;
    } else {
      sz += data.length;
      chunks.push(data);
    }
    const last = chunks[chunks.length-1];
    for(let a of last.entries()) {
      const c = a[1];
      if(c == '}'.charCodeAt()) {
        const len_left = (last.length - (a[0] + 1));
        sz -= len_left;
        const buf = Buffer.concat(chunks, sz)
        try {
          const rec = JSON.parse(buf);
          cb(null, rec);
        } catch(e) {
          cb("Failed to parse json: " + buf.toString('utf8'));
        }
        if(len_left) {
          initChunks(last.slice(a[0]));
        }
      }
    }
  });

  function initChunks(data) {
    chunks = null;
    sz = null;
    for(let a of data.entries()) {
      const c = a[1];
      if(c == '{'.charCodeAt()) {
        chunks = [data.slice(a[0])];
        sz = chunks[0].length;
        break;
      }
    }
  }
}

module.exports = {
  loadRecords,
}
