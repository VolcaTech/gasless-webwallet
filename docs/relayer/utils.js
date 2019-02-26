"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.waitToBeMined = undefined;

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var sleep = function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
};

var waitToBeMined = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(provider, transactionHash) {
    var tick = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1000;
    var receipt;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return provider.getTransactionReceipt(transactionHash);

          case 2:
            receipt = _context.sent;

          case 3:
            if (!(!receipt || !receipt.blockNumber)) {
              _context.next = 11;
              break;
            }

            _context.next = 6;
            return sleep(tick);

          case 6:
            _context.next = 8;
            return provider.getTransactionReceipt(transactionHash);

          case 8:
            receipt = _context.sent;
            _context.next = 3;
            break;

          case 11:
            return _context.abrupt("return", receipt);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function waitToBeMined(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

exports.waitToBeMined = waitToBeMined;