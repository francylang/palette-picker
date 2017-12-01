
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('palettes').del()
    .then(() => knex('projects').del())
    .then(() => {
      return Promise.all([
        knex('projects').insert({
          project_title: 'Project 1'
        }, 'id')
          .then(project => {
            return knex('palettes').insert([
              { palette_title: 'Rainbow',
                hex_code_1: '#FFBE0B',
                hex_code_2: '#FB5607',
                hex_code_3: '#FF006E',
                hex_code_4: '#8338EC',
                hex_code_5: '#3A86FF',
                project_id: project[0] },
              { palette_title: 'Climbing',
                hex_code_1: '#002626',
                hex_code_2: '#0E4749',
                hex_code_3: '#95C623',
                hex_code_4: '#E55812',
                hex_code_5: '#EFE7DA',
                project_id: project[0] },
              { palette_title: 'Bluetiful',
                hex_code_1: '#BEE9E8',
                hex_code_2: '#62B6CB',
                hex_code_3: '#1B4965',
                hex_code_4: '#CAE9FF',
                hex_code_5: '#5FA8D3',
                project_id: project[0] }
            ]);
          }) // end palettes
          .then(() => console.log('Seeding complete!'))
          .catch(error => console.log({ error }))
      ]);
    }) // end .then
    .catch(error => console.log({ error }))
};
