"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configService = void 0;
require('dotenv').config();
class ConfigService {
    constructor(env) {
        this.env = env;
    }
    getValue(key, throwOnMissing = true) {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            throw new Error(`config error - missing env.${key}`);
        }
        return value ?? undefined;
    }
    ensureValues(keys) {
        keys.forEach((k) => this.getValue(k, true));
        return this;
    }
    getPort() {
        return this.getValue('PORT', true);
    }
    isProduction() {
        const mode = this.getValue('ENV', false);
        return mode != 'DEV';
    }
    getTypeOrmConfig() {
        let ssl = {};
        if (this.getValue('POSTGRES_SSL', false)) {
            ssl = {
                ssl: this.getValue('POSTGRES_SSL', false) ?? false,
                extra: {
                    ssl: {
                        rejectUnauthorized: false,
                    }
                }
            };
        }
        return {
            type: 'postgres',
            host: this.getValue('POSTGRES_HOST'),
            port: parseInt(this.getValue('POSTGRES_PORT')),
            username: this.getValue('POSTGRES_USER'),
            password: this.getValue('POSTGRES_PASSWORD'),
            database: this.getValue('POSTGRES_DB'),
            entities: ['dist/**/entities/*.entity.{ts,js}'],
            migrations: ['dist/**/migrations/*.{ts,js}'],
            migrationsTableName: 'migrations_typeorm',
            migrationsRun: false,
            cli: {
                migrationsDir: 'src/database/migrations',
            },
            synchronize: false,
            ...ssl,
        };
    }
}
const configService = new ConfigService(process.env).ensureValues([
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_USER',
    'POSTGRES_PASSWORD',
    'POSTGRES_DB'
]);
exports.configService = configService;
//# sourceMappingURL=db-config.service.js.map