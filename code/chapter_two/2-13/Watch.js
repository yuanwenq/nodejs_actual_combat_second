/*
 * @Date: 2021-02-03
 * @Desc: 
 */
const fs = require('fs');
const events = require('events');

// 扩展 EventEmitter 添加处理文件的文法
class Watcher extends events.EventEmitter {
  constructor (watchDir, processedDir) {
    super();
    this.watchDir = watchDir;
    this.processedDir = processedDir;
  }

  watch() {
    // 处理 watch 目录中的所有文件
    fs.readdir(this.watchDir, (err, files) => {
      if (err) throw err;
      for (var index in files) {
        this.emit('process', files[index]);
      }
    });
  }

  start() {
    // 添加开始监控的方法
    fs.watchFile(this.watchDir, () => {
      this.watch();
    })
  }
}

module.exports = Watcher;