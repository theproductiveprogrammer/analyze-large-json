'use strict'
const fs = require('fs');
const unzipper = require('unzipper');

function loadRecords(fname, cb) {
  const stream = fs.createReadStream(fname, {flags: 'r'})
  if(fname.toLowerCase().endsWith(".zip")) {
    stream.pipe(unzipper.Parse())
      .on('entry', entry => handle_(entry));
  } else {
    handle_(stream);
  }

  function handle_(stream) {
    /*    way/
     * Walk forward till we find the starting '{'
     * Push the buffer from that point onto the
     * chunk list. Walk the last buffer from the chunk list
     * until we find the terminating '}' then parse and return the record.
     * Continue till end.
     */
    let chunks;
    let sz;
    let stopped;
    stream.on('close', () => cb());
    stream.on('data', data => {
      if(stopped) return;
      if(!chunks) {
        initChunks(data);
        if(!chunks) return;
      } else {
        sz += data.length;
        chunks.push(data);
      }
      const last = chunks[chunks.length-1];
      for(let a of last.entries()) {
        if(stopped) return;
        const c = a[1];
        if(c == '}'.charCodeAt()) {
          const len_left = (last.length - (a[0] + 1));
          sz -= len_left;
          const buf = Buffer.concat(chunks, sz)
          try {
            const rec = JSON.parse(buf);
            if(cb(null, rec)) {
              stopped = true;
              stream.destroy();
            }
          } catch(e) {
            if(cb("Failed to parse json: " + buf.toString('utf8'))) {
              stopped = true;
              stream.destroy();
            }
          }
          chunks = null;
          sz = null;
          if(len_left) {
            initChunks(last.slice(a[0]+1));
          }
        }
      }
    });

    function initChunks(data) {
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

}

module.exports = {
  loadRecords,
}
