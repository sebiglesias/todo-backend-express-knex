const knex = require("./connection.js");
const userQueries = require("./user-queries");

async function all() {
    return knex('todos');
}

async function get(id) {
    const results = await knex('todos').join('users', 'todos.user_id', '=', 'users.id' )
        .where({ id });
    return results[0];
}

async function create(title, order, description, assignee_id) {
    const assignee = assignee_id || null
    const results = await knex('todos').insert({ title, order, description, user_id: assignee }).returning('*');
    return results[0];
}

async function update(id, properties) {
    if (!!properties['assignee_id']) {
        const user = await userQueries.get().returning('*');
        // Consider having exception handling to improve this condition
        if (user === null || user === undefined || user.length === 0) {
            return null;
        }
    }
    const results = await knex('todos').where({ id }).update({ ...properties, user_id: properties['assignee_id'] }).returning('*');
    return results[0];
}

// delete is a reserved keyword
async function del(id) {
    const results = await knex('todos').where({ id }).del().returning('*');
    return results[0];
}

async function clear() {
    return knex('todos').del().returning('*');
}

module.exports = {
    all,
    get,
    create,
    update,
    delete: del,
    clear
}