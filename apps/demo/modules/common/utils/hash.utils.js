const convertKeyToId = (items) => {
  return items.map(({ key, ...rest }) => ({
    id: key,
    ...rest,
  }));
};

const atob = (str) => Buffer.from(str).toString("base64");
const btoa = (b64) => Buffer.from(b64, "base64").toString();

module.exports = {
  atob,
  btoa,
  convertKeyToId,
};
