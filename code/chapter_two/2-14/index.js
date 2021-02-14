/*
 * @Date: 2021-02-14
 * @Desc: 2-17 在一个简单的程序中实现串行化流程控制
 */
const fs = require('fs');
const request = require('request');
const htmlparser = require('htmlparser');
const { nextTick } = require('process');
const configFilename = './rss_feeds.txt';

/**
 * 任务 1: 确保包含 RSS 预顶源 URL 列表的文件存在
 */
function checkForRSSFile() {
  fs.access(configFilename, fs.constants.F_OK, (err) => {
    if (err) 
      return next(new Error(`Missing RSS file: ${configFilename}`));
    next(null, configFilename);
  })
}

/**
 * 任务 2: 读取并解析包含预顶源 URL 的文件
 * @param {*} configFilename 
 */
function readRSSFile(configFilename) {
  fs.readFile(configFilename, (err, feedList) => {
    if (err) return next(err);
    // 将预顶源 URL 列表转换成字符串，然后分割成一个数组
    feedList = feedList
      .toString()
      .replace(/^\s+|\s+$/g, '')
      .split('\n');
    // 从预顶源 URL 数组中随机选择一个预顶源 URL
    const random = Math.floor(Math.random() * feedList.length);
    next(null, feedList[random]);
  })
}

/**
 * 任务 3: 向选定的预顶源发送 HTTP 请求以获取数据
 * @param {*} feedUrl 
 */
function downloadRSSFeed(feedUrl) {
  request({ uri: feedUrl }, (err, res, body) => {
    if (err) return next(err);
    if (res.statusCode !== 200) return next(new Error('Abnormal response status code'));
    next(null, body);
  });
}

/**
 * 任务 4: 将预顶源数据解析到一个条目数组中
 * @param {*} rss 
 */
function parseRSSFeed(rss) {
  const handler = new htmlparser.RssHandler();
  const parser = new htmlparser.Parser(handler);
  parser.parseComplete(rss);
  if (!handler.dom.items.length)
    return next(new Error('No Rss items found'));
  const item = handler.dom.items.shift();
  // 如果有数组，显示第一个预顶源条目的标题和 URL
  console.log(item.title);
  console.log(item.link);
}

const tasks = [
  checkForRSSFile,
  readRSSFile,
  downloadRSSFeed,
  parseRSSFeed
]

function next(err, result) {
  if (err) throw err;
  const currentTask = tasks.shift();
  if (currentTask) {
    currentTask(result);
  }
}

next();