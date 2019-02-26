'use strict';

var _TokenGrantingRelayer = require('./TokenGrantingRelayer');

var _TokenGrantingRelayer2 = _interopRequireDefault(_TokenGrantingRelayer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

require('dotenv').config();
var config = require('./config');

var relayer = new _TokenGrantingRelayer2.default(config);
relayer.addHooks();
relayer.start();