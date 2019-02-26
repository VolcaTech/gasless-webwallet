'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _utils = require('./utils');

var _Token = require('../../build/Token');

var _Token2 = _interopRequireDefault(_Token);

var _universalLoginRelayer = require('universal-login-relayer');

var _universalLoginRelayer2 = _interopRequireDefault(_universalLoginRelayer);

var _ethers = require('ethers');

var _ethers2 = _interopRequireDefault(_ethers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TokenGrantingRelayer = function (_Relayer) {
  (0, _inherits3.default)(TokenGrantingRelayer, _Relayer);

  function TokenGrantingRelayer(config) {
    var provider = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    (0, _classCallCheck3.default)(this, TokenGrantingRelayer);

    var _this = (0, _possibleConstructorReturn3.default)(this, (TokenGrantingRelayer.__proto__ || Object.getPrototypeOf(TokenGrantingRelayer)).call(this, config, provider));

    _this.deployerPrivateKey = config.privateKey;
    _this.tokenContractAddress = config.tokenContractAddress;
    _this.deployerWallet = new _ethers.Wallet(_this.deployerPrivateKey, _this.provider);
    return _this;
  }

  (0, _createClass3.default)(TokenGrantingRelayer, [{
    key: 'addHooks',
    value: function addHooks() {
      var _this2 = this;

      this.tokenContract = new _ethers2.default.Contract(this.tokenContractAddress, _Token2.default.interface, this.deployerWallet);
      this.hooks.addListener('created', function () {
        var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(transaction) {
          var receipt;
          return _regenerator2.default.wrap(function _callee$(_context) {
            while (1) {
              switch (_context.prev = _context.next) {
                case 0:
                  _context.next = 2;
                  return (0, _utils.waitToBeMined)(_this2.provider, transaction.hash);

                case 2:
                  receipt = _context.sent;

                  if (receipt.status) {
                    _this2.tokenContract.transfer(receipt.contractAddress, _ethers.utils.parseEther('100'));
                  }

                case 4:
                case 'end':
                  return _context.stop();
              }
            }
          }, _callee, _this2);
        }));

        return function (_x2) {
          return _ref.apply(this, arguments);
        };
      }());

      this.addKeySubscription = this.hooks.addListener('added', function () {
        var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(transaction) {
          var receipt;
          return _regenerator2.default.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  _context2.next = 2;
                  return (0, _utils.waitToBeMined)(_this2.provider, transaction.hash);

                case 2:
                  receipt = _context2.sent;

                  if (receipt.status) {
                    _this2.tokenContract.transfer(transaction.to, _ethers.utils.parseEther('5'));
                  }

                case 4:
                case 'end':
                  return _context2.stop();
              }
            }
          }, _callee2, _this2);
        }));

        return function (_x3) {
          return _ref2.apply(this, arguments);
        };
      }());

      this.addKeysSubscription = this.hooks.addListener('keysAdded', function () {
        var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(transaction) {
          var recepit;
          return _regenerator2.default.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  _context3.next = 2;
                  return (0, _utils.waitToBeMined)(_this2.provider, transaction.hash);

                case 2:
                  recepit = _context3.sent;

                  if (recepit.status) {
                    _this2.tokenContract.transfer(transaction.to, _ethers.utils.parseEther('15'));
                  }

                case 4:
                case 'end':
                  return _context3.stop();
              }
            }
          }, _callee3, _this2);
        }));

        return function (_x4) {
          return _ref3.apply(this, arguments);
        };
      }());
    }
  }]);
  return TokenGrantingRelayer;
}(_universalLoginRelayer2.default);

exports.default = TokenGrantingRelayer;