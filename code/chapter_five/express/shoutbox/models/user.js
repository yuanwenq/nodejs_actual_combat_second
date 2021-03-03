/*
 * @Date: 2021-03-02
 * @Desc: 
 */
const client = require('./index');
const bcrypt = require('bcrypt');

class User {
  constructor(obj) {
    for (let key in obj) {
      this[key] = obj[key];
    }
  }

  save(cb) {
    if (this.id) {
      this.update(cb);
    } else {
      client.incr('user:ids', (err, id) => {
        if (err) return cb(err);
        this.id = id;
        this.hashPassword((err) => {
          if (err) return cb(err);
          this.update(cb);
        })
      })
    }
  }

  update(cb) {
    const id = this.id;
    client.set(`user:id${this.name}`, id, (err) => {
      if (err) return cb(err);
      client.hmset(`user:${id}`, this, (err) => {
        cb(err);
      })
    })
  }

  hashPassword(cb) {
    // 生成12个字符的盐
    bcrypt.genSalt(12, (err, salt) => {
      if (err) return cb(err);
      this.salt = salt;
      bcrypt.hash(this.pass, salt, (err, hash) => {
        if (err) return cb(err);
        this.pass = hash;
        cb();
      })
    })
  }

  static getByName(name, cb) {
    User.getId(name, (err, id) => {
      if (err) return cb(err);
      User.get(id, cb);
    })
  }

  static getId(name, cb) {
    client.get(`user: id${name}`, cb);
  }

  static get(id, cb) {
    client.hgetall(`user:${id}`, (err, user) => {
      if (err) return cb(err);
      cb(null, new User(user));
    })
  }

  static authenticate(name, pass, cb) {
    User.getByName(name, (err, user) => {
      if (err) return cb(err);
      if (!user.id) return cb();
      bcrypt.hash(pass, user.salt, (err, hash) => {
        if (err) return cb(err);
        if (hash == user.pass) return cb(null, user);
        cb();
      })
    })
  }
}

const user = new User({ name: 'Example', pass: 'test'})

user.save((err) => {
  if (err) console.log(err);
  console.log('user id %d', user.id);
})

module.exports = User;