// TODO

const arrToMap = (items = []) =>
  items.reduce((res, item) => {
    res[item.key] = item.value;
    return res;
  }, {});

module.exports = { arrToMap };
