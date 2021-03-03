/*
 * @Date: 2021-03-01
 * @Desc: 
 */

const client = require('./index');
class Entry {
  constructor (obj) {
    for (let key in obj) {
      this[key] = obj[key];
    }
  }

  static getRange(from, to, cb) {
    client.lrange('entries', from, to, (err, items) => {
      if (err) return cb(err);
      let entries = [];
      items.forEach((item) => {
        entries.push(JSON.parse(item));
      });
      cb(null, entries);
    });
  }

  save(cb) {
    const entryJSON = JSON.stringify(this);
    client.lpush('entries', entryJSON, (err) => {
      if (err) return cb(err);
      cb();
    });
  }
}

module.exports = Entry;