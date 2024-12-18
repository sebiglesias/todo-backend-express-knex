const _ = require('lodash');
const users = require('./database/user-queries.js');

function createUser(req, data) {
    const protocol = req.protocol,
        host = req.get('host'),
        id = data.id;

    return {
        name: data.name,
        url: `${protocol}://${host}/${id}`
    };
}

async function getAllUsers(req, res) {
    const allEntries = await users.all();
    return res.send(allEntries.map( _.curry(createUser)(req) ));
}

async function getUser(req, res) {
    const user = await users.get(req.params.id);
    return res.send(user);
}

async function postUser(req, res) {
    const created = await users.create(req.body.name);
    return res.send(createUser(req, created));
}

async function patchUser(req, res) {
    const patched = await users.update(req.params.id, req.body);
    return res.send(createUser(req, patched));
}

async function deleteAllUsers(req, res) {
    const deletedEntries = await users.clear();
    return res.send(deletedEntries.map( _.curry(createUser)(req) ));
}

async function deleteUser(req, res) {
    const deleted = await users.delete(req.params.id);
    return res.send(createUser(req, deleted));
}

function addErrorReporting(func, message) {
    return async function(req, res) {
        try {
            return await func(req, res);
        } catch(err) {
            console.log(`${message} caused by: ${err}`);

            // Not always 500, but for simplicity's sake.
            res.status(500).send(`Opps! ${message}.`);
        }
    }
}

const toExport = {
    getAllUsers: { method: getAllUsers, errorMessage: "Could not fetch all users" },
    getUser: { method: getUser, errorMessage: "Could not fetch user" },
    postUser: { method: postUser, errorMessage: "Could not post user" },
    patchUser: { method: patchUser, errorMessage: "Could not patch user" },
    deleteAllUsers: { method: deleteAllUsers, errorMessage: "Could not delete all users" },
    deleteUser: { method: deleteUser, errorMessage: "Could not delete user" }
}

for (let route in toExport) {
    toExport[route] = addErrorReporting(toExport[route].method, toExport[route].errorMessage);
}

module.exports = toExport;
