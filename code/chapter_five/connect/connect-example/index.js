/*
 * @Date: 2021-02-28
 * @Desc: 
 */
const connect  = require("connect");
const env = process.env.NODE_ENV || 'development';
// function logger(req, res, next) {
//   console.log('%s %s', req.method, req.url);
//   next();
// }
console.log(env)
// 可配置中间件
function setup(format) {
  const regexp = /:(\w+)/g;

  return function createLogger(req, res, next) {
    const str = format.replace(regexp, (match, property) => {
      // console.log(property)
      return req[property];
    });
    console.log(str);
    next();
  }
}

function errorHandler(err, req, res, next) {
  res.statusCode = 500;
  switch (env) {
    case 'development':
      console.error('Error');
      console.error(err);
      res.setHeader('Content-type', 'application/json');
      res.end(JSON.stringify(err));
      break;
    default:
      res.end('Server error');
  }
}

function hello(req, res, next) {
  foo()
  res.setHeader('Content-type', 'text/plain')
  res.end('Hello, world!');
}

connect()
  .use(setup(':method :url'))
  .use(hello)
  .use(errorHandler)
  .listen(3000);