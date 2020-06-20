// TODO

const arrToMap = (items = []) =>
  items.reduce((res, item) => {
    res[item.key] = item.value;
    return res;
  }, {});

const parseStr = (str) => {
  try {
    return str ? JSON.parse(str) : null;
  } catch {
    return {};
  }
};

module.exports = { arrToMap, parseStr };
