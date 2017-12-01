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

const fetchAllProjects = () => {
  fetch('/api/v1/projects')
    .then(response => response.json())
    .then(projects => {
      fetchPalettes(projects)
    })
    .catch(error => console.log(error));
};

const fetchPalettes = (projects) => {
  projects.forEach((project) => {
    fetch(`/api/v1/projects/${project.id}/palettes`)
      .then(response => response.json())
      .then(palettes => appendPalettes(palettes));
  });
};

const appendProject = (project) => {
  const projectAppend = `<article class="project-info">
                    <h2>${project.project_title}</h2>
                  </article>`;
  const projectTitleDropDown = `<option value=${project.id} selected>
                                  ${project.project_title}
                                </option>`;
  $('.new-project-title').val('');
  $('.new-projects').prepend(projectAppend);
  $('.new-palette-drop-down').prepend(projectTitleDropDown);
};
const appendPalettes = (palettes) => {
  palettes.forEach((palette) => {
    $(`.project-${palette.projectId}`).append(`
      <div id="palette-${palette.id}"class="palette" data-id="${palette.id}">
        <div class="saved-palette-colors">
        <div class="palette-title" contenteditable="true">${palette.palette_title}</div>
        <div class="small-color-container">
        <div class="small-palette-color small-palette-left" style="background-color: ${palette.hex_code_1}"></div>
        <div class="small-palette-color" style="background-color: ${palette.hex_code_2}"></div>
        <div class="small-palette-color" style="background-color: ${palette.hex_code_3}"></div>
        <div class="small-palette-color" style="background-color: ${palette.hex_code_4}"></div>
        <div class="small-palette-color small-palette-right" style="background-color: ${palette.hex_code_5}"></div>
        </div>
        </div>
        <button class="remove-palette-button">X</button>
      </div>
    `);
  });
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
    .then(response => {
      if (response.status === 201) {
        return response.json();
      }
    })
    .then(projects => {
      fetchAllProjects();
      appendProject(projects[0]);
    })
    .catch(error => console.log(error));
  $('.new-project-title').val('');
};

const displayProjects = (projects) => {
  projects.forEach( (project, i) => {
    $('.projects-palettes-container').append(`
        <div class='project ${project.id}'><h2>${project.project_title}</h2></div>
      `);
  });
};


const postPalette = () => {
  const newPalette = {
    name: $('.new-project-title').val(),
    hex_code_1: $('.hex_code_1').css('background-color'),
    hex_code_2: $('.hex_code_2').css('background-color'),
    hex_code_3: $('.hex_code_3').css('background-color'),
    hex_code_4: $('.color4').css('background-color'),
    hex_code_5: $('.color5').css('background-color')
  };
  const projectId = $('.new-palette-drop-down').find('option:selected').prop('value');

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



$('.color-container').on('click', '.unlocked-icon', (event) => {
  $(event.target).toggleClass('locked-icon');
  $(event.target).parents('.color').toggleClass('locked');
});

$('.generate-button').on('click', updateRandomColors);
$('.new-project-save-button').on('click', postProject);
$('.new-palette-save-button').on('click', appendPalettes);
