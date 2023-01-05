import * as dotenv from 'dotenv';
dotenv.config();
const ConfigMap = {
    MYSQL_USERNAME_1: process.env.MYSQL_USERNAME_1,
    MYSQL_PASSWORD_1: process.env.MYSQL_PASSWORD_1,
    MYSQL_DATABASE_1: process.env.MYSQL_DATABASE_1,
    MYSQL_HOST_1: process.env.MYSQL_HOST_1,
    MSYQL_PORT_1: parseInt(process.env.MSYQL_PORT_1 as string),
    MYSQL_USERNAME_2: process.env.MYSQL_USERNAME_2,
    MYSQL_PASSWORD_2: process.env.MYSQL_PASSWORD_2,
    MYSQL_DATABASE_2: process.env.MYSQL_DATABASE_2,
    MYSQL_HOST_2: process.env.MYSQL_HOST_2,
    MSYQL_PORT_2: parseInt(process.env.MSYQL_PORT_2 as string),
};

export default ConfigMap;
