import { DataSource, DataSourceOptions } from 'typeorm';
import { configService } from './db-config.service';
export const connectionSource = new DataSource(configService.getTypeOrmConfig() as DataSourceOptions);