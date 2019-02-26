'use strict';

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _ensRegistrars;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();

module.exports = Object.freeze({
  jsonRpcUrl: process.env.JSON_RPC_URL,
  port: process.env.PORT,
  privateKey: process.env.PRIVATE_KEY,
  chainSpec: {
    ensAddress: process.env.ENS_ADDRESS,
    publicResolverAddress: process.env.PUBLIC_RESOLVER_ADDRESS,
    chainId: 0
  },
  ensRegistrars: (_ensRegistrars = {}, (0, _defineProperty3.default)(_ensRegistrars, process.env.ENS_DOMAIN_1, {
    resolverAddress: process.env.ENS_RESOLVER1_ADDRESS,
    registrarAddress: process.env.ENS_REGISTRAR1_ADDRESS,
    privteKey: process.env.ENS_REGISTRAR1_PRIVATE_KEY
  }), (0, _defineProperty3.default)(_ensRegistrars, process.env.ENS_DOMAIN_2, {
    resolverAddress: process.env.ENS_RESOLVER2_ADDRESS,
    registrarAddress: process.env.ENS_REGISTRAR2_ADDRESS,
    privteKey: process.env.ENS_REGISTRAR2_PRIVATE_KEY
  }), (0, _defineProperty3.default)(_ensRegistrars, process.env.ENS_DOMAIN_3, {
    resolverAddress: process.env.ENS_RESOLVER3_ADDRESS,
    registrarAddress: process.env.ENS_REGISTRAR3_ADDRESS,
    privteKey: process.env.ENS_REGISTRAR3_PRIVATE_KEY
  }), _ensRegistrars),
  tokenContractAddress: process.env.TOKEN_CONTRACT_ADDRESS
});