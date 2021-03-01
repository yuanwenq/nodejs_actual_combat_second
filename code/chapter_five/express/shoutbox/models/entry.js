/*
 * @Date: 2021-03-01
 * @Desc: 
 */
const redis = require('redis'),
  RDS_PORT = 15001,
  RDS_HOST = '120.78.190.37',
  RDS_PWD = '123456',
  RDS_OPTS = {},
  client = redis.createClient(RDS_PORT, RDS_HOST, RDS_OPTS);
client.auth(RDS_PWD,function(){  
  console.log('通过认证');  
});  
client.on('connect',function(){  
  client.set('author', 'Wilson',redis.print);  
  client.get('author', redis.print);  
  console.log('connect');  
});  
client.on('ready',function(err){  
  console.log('ready');  
});

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