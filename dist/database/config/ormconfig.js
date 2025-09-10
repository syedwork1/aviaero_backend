"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectionSource = void 0;
const typeorm_1 = require("typeorm");
const db_config_service_1 = require("./db-config.service");
exports.connectionSource = new typeorm_1.DataSource(db_config_service_1.configService.getTypeOrmConfig());
//# sourceMappingURL=ormconfig.js.map