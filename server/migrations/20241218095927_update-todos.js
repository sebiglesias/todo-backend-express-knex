exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
        table.increments('id').primary();
        table.string('name');
    }).alterTable('todos', function(table) {
        table.string('description');
        table.integer('user_id').nullable();
        table.foreign('user_id').references('users.id');
    }).createTable('comments', function(table) {
        table.increments('id').primary();
        table.string('comment');
        table.integer('user_id').unsigned().notNullable();
        table.integer('todo_id').unsigned().notNullable();
        table.foreign('user_id').references('users.id')
        table.foreign('todo_id').references('todos.id')
    })
}

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('comments').dropTableIfExists('comments').alterTable('todos', function(table) {
        table.dropColumn('description');
    });
}