const generateRandomColor = () => {
  const characters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const updateRandomColors = (i) => {
  for (var i = 0; i < 6; i++) {
    if (!$(`.color${i}`).hasClass('locked')) {
      let color = generateRandomColor();
      $(`.color${i}`).css('background-color', color);
      $(`.code${i}`).text(color);
    }
  }
};

const fetchAllProjects = () => {
  fetch('/api/v1/projects')
    .then(response => response.json())
    .then(projects => {
      projects.forEach(project => {
        appendProject(project);
        fetch(`/api/v1/projects/${project.id}/palettes`)
          .then(response => response.json())
          .then(palettes => appendPalettes(palettes));
      });
    })
    .catch(error => console.log(error));
};

const appendProject = (projects) => {
  const projectTitle = $('.new-project-title').val();
  const project = `<article class="project-info">
                    <h2>${projectTitle}</h2>
                  </article>`;
  const projectTitleDropDown = `<option value=${projects.id} selected>
                                  ${projectTitle}
                                </option>`;

  $('.new-project-title').val('');
  $('.new-projects').prepend(project);
  $('.new-palette-drop-down').prepend(projectTitleDropDown);
};

const appendPalettes = (palettes) => {
  const paletteTitle = $('.new-palette-name').val();
  $('.project-palettes-container').append(`
    <h3>${paletteTitle}</h3>
  `)
  // palettes.forEach(palette => {
  //   $('.new-palette-name').val();
  //   `<h3>${palette.palette_title}</h3>`;
  // });
};


// const appendAllPalettes = (palettes) => {
//   palettes.forEach(palette => {
//     const paletteName = palette.name;
//     const projectPalette = `<div class='palette-details ${palette.id}' data-colors='${JSON.stringify([palette.hex_val_1, palette.hex_val_2, palette.hex_val_3, palette.hex_val_4, palette.hex_val_5])}'>
//       <p class='palette-name'>${paletteName}</p>
//       <div class='small-color-block block1' style='background-color: ${palette.hex_val_1}'></div>
//       <div class='small-color-block block2' style='background-color: ${palette.hex_val_2}'></div>
//       <div class='small-color-block block3' style='background-color: ${palette.hex_val_3}'></div>
//       <div class='small-color-block block4' style='background-color: ${palette.hex_val_4}'></div>
//       <div class='small-color-block block5' style='background-color: ${palette.hex_val_5}'></div>
//       <img class='trash-icon' src="./assets/trash.svg" alt="trash">
//     </div>`;
//
//     $(`.${palette.project_id}`).append(projectPalette);
//   });
// };





// const appendProject = (results) => {
//  const projectName = `<option value=${results.id} selected>${results.name}</option>`;
//  const project = `<article class="project-details ${results.id}">
//    <h2 class='project-name'>${results.name}</h2>
//  </article>`;
//
//  $('.select-folder').append(projectName);
//  $('.project-container').append(project);
// };



const saveNewProject = () => {
  const projectName = $('.new-project-title').val('');
  console.log('saveNewProject');

};

const saveNewPalette = () => {
  const projectName = $('.new-palette-name').val('');
  console.log('saveNewPalette');

};

$(document).ready(() => {
  updateRandomColors();
  fetchAllProjects();
});

$('.color-container').on('click', '.unlocked-icon', (event) => {
  $(event.target).toggleClass('locked-icon');
  $(event.target).parents('.color').toggleClass('locked');
});

$('.generate-button').on('click', updateRandomColors);
$('.new-project-save-button').on('click', fetchAllProjects);
$('.new-palette-save-button').on('click', saveNewPalette);
