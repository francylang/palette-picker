
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('project_title');
      table.timestamps(true, true);
    }),
    knex.schema.createTable('palettes', function(table) {
      table.increments('id').primary();
      table.string('palette_title');
      table.string('hex_code_1');
      table.string('hex_code_2');
      table.string('hex_code_3');
      table.string('hex_code_4');
      table.string('hex_code_5');
      table.integer('project_id').unsigned();
      table.foreign('project_id').references('projects.id');
      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('palettes'),
    knex.schema.dropTable('projects')
  ]);
};
