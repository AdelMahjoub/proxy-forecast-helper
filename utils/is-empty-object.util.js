module.exports = function(obj) {
  let props = 0;
  Object.keys(obj).forEach(key => {
    props++;
  });
  return props === 0;
}