/*
 * @Date: 2021-03-02
 * @Desc: 表单校验中间件
 */
// 解析 entry[name] 符号
function parseField(field) {
  return field
    .split(/\[|\]/)
    .filter((s) => s);
}

function getField(req, field) {
  let val = req.body;
  field.forEach((prop) => {
    val = val[prop];
  });
  return val;
}

exports.required = (field) => {
  field = parseField(field);
  return (req, res, next) => {
    if (getField(req, field)) {
      next();
    } else {
      res.statusCode = 500;
      res.send(`${field.join(' ')} is required`);
      res.redirect('back');
    }
  }
}

exports.lengthAbove = (field, len) => {
  field = parseField(field);
  return (req, res, next) => {
    if (getField(req, field).length > len) {
      next();
    } else {
      const fields = field.join(' ');
      res.statusCode = 500;
      res.send(`${fields} must have more than ${len} characters`);
      res.redirect('back');
    }
  }
}