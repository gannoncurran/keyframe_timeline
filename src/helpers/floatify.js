module.exports = function(testValue) {
  var testValue = parseFloat(testValue);
  if (testValue !== testValue) {
    throw "Error: Timeline Position value wasn't a number or coerceable string.";
  };
  return testValue;
};