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
      //   fetch(`/api/v1/projects/${project.id}/palettes`)
      //     .then(response => response.json())
      //     .then(palettes => appendPalettes(palettes));
      // });
      });
    })
    .catch(error => console.log(error));
};

const appendProject = (project) => {
  console.log(project);


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

// const appendPalettes = (palettes) => {
//   // const paletteTitle = $('.new-palette-name').val();
//   $('.project-palettes-container').append(`
//     <h3>${paletteTitle}</h3>
//   `)
  // palettes.forEach(palette => {
  //   $('.new-palette-name').val();
  //   `<h3>${palette.palette_title}</h3>`;
  // });
// };


const appendPalettes = (palettes) => {
  // const projectPalette =
  //
  //   `<div class='palette-id'
  //         data-colors='${JSON.stringify([hex_code_1,
  //                                        hex_code_2,
  //                                        hex_code_3,
  //                                        hex_code_4,
  //                                        hex_code_5])}'>
  //       <h3>${title}</h3>
  //         <div class='color-swatch swatch1' style='background-color: ${hex_code_1}'></div>
  //         <div class='color-swatch swatch2' style='background-color: ${hex_code_2}'></div>
  //         <div class='color-swatch swatch3' style='background-color: ${hex_code_3}'></div>
  //         <div class='color-swatch swatch4' style='background-color: ${hex_code_4}'></div>
  //         <div class='color-swatch swatch5' style='background-color: ${hex_code_5}'></div>
  //   </div>`;
  //
  //   $(`.${project_id}`).append(projectPalette);

};

const postProject = () => {
  const projectTitle = $('.new-project-title').val();

  fetch('/api/v1/projects', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ project_title: projectTitle })
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

$(document).ready(() => {
  updateRandomColors();
  fetchAllProjects();
});

$('.color-container').on('click', '.unlocked-icon', (event) => {
  $(event.target).toggleClass('locked-icon');
  $(event.target).parents('.color').toggleClass('locked');
});

$('.generate-button').on('click', updateRandomColors);
$('.new-project-save-button').on('click', postProject);
$('.new-palette-save-button').on('click', appendPalettes);
