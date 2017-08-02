export const commands = {
    createTables:     
        `CREATE TABLE IF NOT EXISTS quests(
            id integer primary key,
            zone text not null, 
            name text not null,
            level integer not null);
        CREATE TABLE IF NOT EXISTS versions(
            id integer primary key autoincrement,
            quests_version integer not null);`,
    insertIntoQuests:
        `INSERT INTO quests VALUES (id, zone, name, level)`,
    selectAllQuests:
        `SELECT * FROM quests`
}