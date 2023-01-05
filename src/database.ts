import * as _ from 'lodash';
import * as mysql2 from 'mysql2';
import ConfigMap from './config';
export class Database {
    private connections: any = {};
    createConnections() {
        const connection1 = mysql2.createConnection({
            host: ConfigMap.MYSQL_HOST_1,
            user: ConfigMap.MYSQL_USERNAME_1,
            database: ConfigMap.MYSQL_DATABASE_1,
            password: ConfigMap.MYSQL_PASSWORD_1,
            port: ConfigMap.MSYQL_PORT_1,
        });
        const connection2 = mysql2.createConnection({
            host: ConfigMap.MYSQL_HOST_2,
            user: ConfigMap.MYSQL_USERNAME_2,
            database: ConfigMap.MYSQL_DATABASE_2,
            password: ConfigMap.MYSQL_PASSWORD_2,
            port: ConfigMap.MSYQL_PORT_2,
        });

        _.set(this.connections, '1', connection1);
        _.set(this.connections, '2', connection2);
    }
    getConnection(num: number): mysql2.Connection {
        return _.get(this.connections, `${num}`);
    }
}

export class ConnectionHelper {
    private conn: mysql2.Connection;
    private DbName: string;
    public tables: string[];
    constructor(conn: mysql2.Connection, name: string) {
        this.conn = conn;
        this.DbName = name;
    }
    async query(queryString: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.conn.query(queryString, (err, result) => {
                if (err) {
                    return reject(err);
                }
                return resolve(result);
            });
        });
    }

    async getTables() {
        const tables = await this.query(`SHOW TABLES`).then((res: any[]) => {
            return res.map((r) => _.get(r, `Tables_in_${this.DbName}`));
        });
        this.tables = tables;
        return tables;
    }

    async compareTables(anotherConn: ConnectionHelper) {
        const excessTables = [];
        const deficitTables = [];
        const anotherConnTablesMap = _.keyBy(anotherConn.tables);
        for (const table of this.tables) {
            if (!_.get(anotherConnTablesMap, table)) {
                excessTables.push(table);
            }
        }
        const currentConnTablesMap = _.keyBy(this.tables);
        for (const table of anotherConn.tables) {
            if (!_.get(currentConnTablesMap, table)) {
                deficitTables.push(table);
            }
        }
        return { excessTables, deficitTables };
    }

    async commpareData(
        anotherConn: ConnectionHelper,
        tableName: string,
        keyCols: string[]
    ) {
        const excessData = [];
        const deficitData = [];
        const currentConnData = await this.query(
            `SELECT * FROM \`${tableName}\`;`
        );
        const anotherConnData = await anotherConn.query(
            `SELECT * FROM \`${tableName}\`;`
        );

        const currentConnDataMap = this.mapData(currentConnData, keyCols);
        const anotherConnDataMap = this.mapData(anotherConnData, keyCols);
        for (const data of currentConnData) {
            const key = this.hashKey(data, keyCols);
            if (!_.get(anotherConnDataMap, key)) {
                excessData.push(data);
            }
        }
        for (const data of anotherConnData) {
            const key = this.hashKey(data, keyCols);
            if (!_.get(currentConnDataMap, key)) {
                deficitData.push(data);
            }
        }
        return { excessData, deficitData };
    }

    private mapData(data: any[], keys: string[]) {
        return data.reduce((a, b) => {
            a[this.hashKey(b, keys)] = b;
            return a;
        }, {});
    }
    private hashKey(data: any, keys: string[]) {
        return keys
            .map((f) => {
                return `${f}:${data[f]}`;
            })
            .join(':');
    }
}

export default new Database();
