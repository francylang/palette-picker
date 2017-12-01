$(document).ready(() => {
  updateRandomColors();
  fetchAllProjects();
});

const generateRandomColor = () => {
  const characters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const updateRandomColors = (i) => {
  for (let i = 0; i < 6; i++) {
    if (!$(`.color${i}`).hasClass('locked')) {
      let color = generateRandomColor();
      $(`.color${i}`).css('background-color', color);
      $(`.code${i}`).text(color);
    }
  }
};

const appendProjectName = (projects) => {
  projects.forEach((project) => {
    $('.new-palette-drop-down')
      .append(`<option value=${project.id} selected>
        ${project.project_title}
      </option>`);
  });
};

const appendProject = (projects) => {
  projects.forEach((project) => {
    $('.new-projects')
      .append(`<div id="project-template" class="project project-${project.id}">
        <h3 class="project-name" contenteditable="true">
          ${project.project_title}
        </h3>
      </div>`);
  });
  appendProjectName(projects);
};

const fetchAllProjects = () => {
  fetch('/api/v1/projects')
    .then(response => response.json())
    .then((storedProjects) => {
      appendProject(storedProjects);
      fetchPalettes(storedProjects);
    })
    .catch(error => console.log(error));
};

const appendPalettes = (palettes) => {
  palettes.forEach((palette) => {
    $(`.project-${palette.project_id}`).append(`
      <div id="palette-${palette.id}"class="palette" data-id="${palette.id}"
        data-colors='${JSON.stringify([palette.hex_code_1, palette.hex_code_2, palette.hex_code_3, palette.hex_code_4, palette.hex_code_5] )}'>
        <div class="saved-palette-colors">
          <div class="palette-title" contenteditable="true">
            ${palette.palette_title}
          </div>
          <div class="swatch-container">
          <div class="palette-swatch swatch1"
               style="background-color: ${palette.hex_code_1}">
          </div>
          <div class="palette-swatch swatch2"
               style="background-color: ${palette.hex_code_2}">
          </div>
          <div class="palette-swatch swatch3"
               style="background-color: ${palette.hex_code_3}">
          </div>
          <div class="palette-swatch swatch4"
               style="background-color: ${palette.hex_code_4}">
          </div>
          <div class="palette-swatch swatch5"
               style="background-color: ${palette.hex_code_5}">
          </div>
          <button class="delete-palette-button">X</button>
        </div>
        </div>
      </div>
    `);
  });
};

const fetchPalettes = (projects) => {
  projects.forEach((project) => {
    fetch(`/api/v1/projects/${project.id}/palettes`)
      .then(response => response.json())
      .then(palettes => appendPalettes(palettes));
  });
  // .catch(error => console.log(error));
};

const postProject = () => {
  const projectTitle = $('.new-project-title').val();

  fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({ project_title: projectTitle }),
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => response.json())
    .then(project => appendProject(project))
    .catch(error => console.log(error));

  $('.new-project-title').val('');
};

const postPalette = () => {
  const newPalette = {
    palette_title: $('.new-palette-name').val(),
    hex_code_1: $('.code1').text(),
    hex_code_2: $('.code2').text(),
    hex_code_3: $('.code3').text(),
    hex_code_4: $('.code4').text(),
    hex_code_5: $('.code5').text()
  };
  const projectId = $('.new-palette-drop-down')
    .find('option:selected')
    .prop('value');

  fetch(`/api/v1/projects/${projectId}/palettes`, {
    method: 'POST',
    body: JSON.stringify(newPalette),
    headers: {
      'content-type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(palette => appendPalettes(palette))
    .catch(error => console.log(error));
};

const deletePalette = (eventTarget) => {
  const paletteId = $(eventTarget).closest('.palette').attr('data-id');

  fetch(`/api/v1/palettes/${paletteId}`, {
    method: 'DELETE'
  })
    .catch(error => console.log(error));

  $(eventTarget).closest('.palette').remove();
};

const updateAsidePalette = () => {
  const colorSwatches = JSON.parse($(event.target).closest('.palette').attr('data-colors'));
  colorSwatches.forEach((color, index) => {
    $(`.color${index}`).css('background-color', color);
  });
};


$('.color-container').on('click', '.unlocked-icon', (event) => {
  $(event.target).toggleClass('locked-icon');
  $(event.target).parents('.color').toggleClass('locked');
});

$('.generate-button').on('click', updateRandomColors);
$('.new-project-save-button').on('click', postProject);
$('.new-palette-save-button').on('click', postPalette);
$('.projects-palettes-container').on('click', '.delete-palette-button', (event => deletePalette(event.target)));
$('.projects-palettes-container').on('click', '.swatch-container', (event => updateAsidePalette(event.target)));
