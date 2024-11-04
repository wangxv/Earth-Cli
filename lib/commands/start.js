"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const webpack_1 = __importDefault(require("webpack"));
const portfinder_1 = require("portfinder");
const address_1 = require("address");
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const constant_1 = require("../constant");
const webpack_doc_dev_1 = __importDefault(require("../config/webpack.doc.dev"));
function logServerInfo(port, PORT) {
    if (port !== PORT) {
        console.log(chalk_1.default.bgYellow.black('WARNING'), chalk_1.default.yellow(`Port ${PORT} is already used, ${port} instead\n`));
    }
    const local = `http://localhost:${port}`;
    const network = `http://${(0, address_1.ip)()}:${port}`;
    console.log('\n doc running at: \n');
    console.log(`  ${chalk_1.default.bold('Local')}:    ${chalk_1.default.hex(constant_1.GREEN)(local)} `);
    console.log(`  ${chalk_1.default.bold('Network')}:  ${chalk_1.default.hex(constant_1.GREEN)(network)}`);
}
// 起一个服务
function runDevServer(port, config) {
    var _a;
    const server = new webpack_dev_server_1.default(config.devServer, (0, webpack_1.default)(config));
    // TODO: 可有可无
    // 禁用无线分布式系统状态日志
    server.showStatus = function () { };
    const host = config.devServer.host || 'localhost';
    console.log('server:', server);
    (_a = server.server) === null || _a === void 0 ? void 0 : _a.listen(port, host, (err) => {
        if (err)
            console.log(err);
    });
}
exports.default = () => {
    const PORT = webpack_doc_dev_1.default.devServer.port || 8080;
    (0, portfinder_1.getPort)({
        port: PORT,
    }, (err, port) => {
        if (err) {
            console.log(err);
            return;
        }
        logServerInfo(port, PORT);
        runDevServer(port, PORT);
    });
};
