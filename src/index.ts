import ConfigMap from './config';
import database, { ConnectionHelper } from './database';
(async function main() {
    database.createConnections();
    const conn1 = database.getConnection(1);
    const conn2 = database.getConnection(2);
    const conn1Helper = new ConnectionHelper(conn1, ConfigMap.MYSQL_DATABASE_1);
    const conn2Helper = new ConnectionHelper(conn2, ConfigMap.MYSQL_DATABASE_2);

    await conn1Helper.getTables();
    await conn2Helper.getTables();

    const res = await conn2Helper.compareTables(conn1Helper);
    const compareDataRes1 = await conn2Helper.commpareData(
        conn1Helper,
        'country_has_entity_type_has_file_template',
        ['country_has_entity_type_id', 'file_template_id']
    );

    const compareDataRes2 = await conn2Helper.commpareData(
        conn1Helper,
        'file_template',
        ['id']
    );

    console.log(compareDataRes1);
    console.log(compareDataRes2);

    await sleep(2000);
    process.exit(0);
})();

async function sleep(time: number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
}
