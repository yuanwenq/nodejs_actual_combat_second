/*
 * @Date: 2021-02-03
 * @Desc: 
 */
const fs = require('fs');
const Watcher = require('./Watch');

const watchDir = './watch';
const processedDir = './done';
const watcher = new Watcher(watchDir, processedDir);

watcher.on('process', (file) => {
  const watchFile = `${watchDir}/${file}`;
  const processedFile = `${processedDir}/${file.toLowerCase()}`;
  fs.rename(watchFile, processedFile, err => {
    if (err) throw err;
  });
});

watcher.start();