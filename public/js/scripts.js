
$(document).ready(() => {
  updateRandomColors();
  fetchAllProjects();
});

// INDEXEDDB
//eslint-disable-next-line
let db = new Dexie('palettePicker');

db.version(1).stores({
  projects: 'id, project_title',
  palettes: 'id, palette_title, hex_code_1, hex_code_2, hex_code_3, hex_code_4, hex_code_5, project_id'
});

const saveOfflineProjects = project => {
  return db.projects.add(project);
};

const saveOfflinePalettes = (palette) => {
  return db.palettes.add(palette);
};

const loadOfflineProjects = () => {
  return db.projects.toArray();
};

const loadOfflinePalettes = () => {
  return db.palettes.toArray();
};

const generateRandomColor = () => {
  const characters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const updateRandomColors = () => {
  for (let i = 0; i < 6; i++) {
    if (!$(`.color${i}`).hasClass('locked')) {
      let color = generateRandomColor();
      $(`.color${i}`).css('background-color', color);
      $(`.code${i}`).text(color);
    }
  }
};

const changeHexCode = (event) => {
  const grabColor = $(event.target);
  const colorText = grabColor.text();
  const newColor = grabColor.closest('.color');

  newColor.css('background-color', colorText);
};

const toggleLocked = () => {
  $(event.target).toggleClass('locked-icon');
  $(event.target).parents('.color').toggleClass('locked');
};

const getOfflineProjects = () => {
  loadOfflineProjects()
    .then(projects => {
      appendProject(projects);
      fetchPalettes(projects);
    })
    //eslint-disable-next-line
    .catch(error => console.error(error));
};

const fetchAllProjects = () => {
  fetch('/api/v1/projects')
    .then(response => response.json())
    .then(storedProjects => {
      appendProject(storedProjects);
      fetchPalettes(storedProjects);
    })
    .catch((error) => {
      getOfflineProjects();
      //eslint-disable-next-line
      console.error(error);
    });
};

const appendProject = (projects) => {
  projects.forEach((project) => {
    projectToAppend(project);
    projectTitleToAppend(project);
  });
};

const projectToAppend = (project) => {
  $('.new-projects').append(
    `<div id="project-template"
          class="project project-${project.id}">
      <h3 class="project-name"
          contenteditable="true">
        ${project.project_title}
      </h3>
    </div>`
  );
};

const projectTitleToAppend = (project) => {
  $('.new-palette-drop-down').append(
    `<option value=${project.id} selected>
      ${project.project_title}
    </option>`
  );
};

const indexedDBProjects = (id, project_title) => {
  /*eslint-disable no-console*/
  saveOfflineProjects({ id, project_title })
    .then(() => console.log('IndexedDB Success'))
    .catch(error => console.error('Error adding data to indexedDB', error));
};

const postProject = () => {
  const projectTitle = $('.new-project-title').val();

  fetch('/api/v1/projects', {
    method: 'POST',
    body: JSON.stringify({ project_title: projectTitle }),
    headers: { 'Content-Type': 'application/json' },
  })
    .then(response => response.json())
    .then((project) => {
      appendProject(project);
      indexedDBProjects(project[0].id, project[0].project_title);
    })
    //eslint-disable-next-line
    .catch(error => console.log(error));
  $('.new-project-title').val('');
};

const getOfflinePalettes = (id) => {
  loadOfflinePalettes(id)
    .then(palettes =>  {
      const dbPalettes = palettes.filter(palette => palette.project_id === id);
      appendPalettes(dbPalettes);
    })
    .catch(error => console.error(error));
};

const fetchPalettes = projects => {
  projects.forEach((project) => {
    fetch(`/api/v1/projects/${project.id}/palettes`)
      .then(response => response.json())
      .then(palettes => appendPalettes(palettes))
      //eslint-disable-next-line
      .catch(() => getOfflinePalettes(project.id));
  });
};

const appendPalettes = (palettes) => {
  palettes.forEach((palette) => {
    paletteToAppend(palette);
  });
};

const paletteToAppend = ({ id, palette_title, hex_code_1, hex_code_2, hex_code_3, hex_code_4, hex_code_5, project_id }) => {
  const asideColorPalette = [hex_code_1, hex_code_2, hex_code_3, hex_code_4, hex_code_5];

  $(`.project-${project_id}`).append(
    ` <div id="palette-${id}"
           class="palette"
           data-id="${id}"
           data-colors='${JSON.stringify(asideColorPalette)}'>
        <div class="saved-palette-colors">
         <div class="palette-title" contenteditable="true">${palette_title}</div>
          <div class="swatch-container">
            <div class="palette-swatch swatch1" style="background-color: ${hex_code_1}"></div>
            <div class="palette-swatch swatch2" style="background-color: ${hex_code_2}"></div>
            <div class="palette-swatch swatch3" style="background-color: ${hex_code_3}"></div>
            <div class="palette-swatch swatch4" style="background-color: ${hex_code_4}"></div>
            <div class="palette-swatch swatch5" style="background-color: ${hex_code_5}"></div>
            <button class="delete-palette-button">X</button>
         </div>
        </div>
      </div>`
  );
};

const indexedDBPalettes = palette => {
  /*eslint-disable no-console*/
  saveOfflinePalettes({
    id: palette.id,
    palette_title: palette.palette_title,
    hex_code_1: palette.hex_code_1,
    hex_code_2: palette.hex_code_2,
    hex_code_3: palette.hex_code_3,
    hex_code_4: palette.hex_code_4,
    hex_code_5: palette.hex_code_5,
    project_id: palette.project_id
  })
    .then(() => console.log('IndexedDB Success'))
    .catch(error => console.error('Error adding data to indexedDB', error));
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
    headers: { 'content-type': 'application/json' }
  })
    .then(response => response.json())
    .then(palette => {
      indexedDBPalettes(palette[0]);
      appendPalettes(palette);
    })
    //eslint-disable-next-line
    .catch(error => console.log(error));
  $('.new-palette-name').val('');
};

const deletePalette = (eventTarget) => {
  const paletteId = $(eventTarget).closest('.palette').attr('data-id');

  fetch(`/api/v1/palettes/${paletteId}`, {
    method: 'DELETE'
  });
  //eslint-disable-next-line
  $(eventTarget).closest('.palette').remove();
};

const updateAsidePalette = () => {
  const colorSwatches = JSON.parse($(event.target).closest('.palette').attr('data-colors'));
  colorSwatches.forEach((color, index) => {
    $(`.color${index}`).css('background-color', color);
  });
};

const checkForDuplicateProjects = () => {
  const projectTitle = $('.new-project-title').val();

  fetch('/api/v1/projects')
    .then(projects => projects.json())
    .then(existingProjects => {
      const currentProjects = existingProjects.find(project => {
        return project.project_title === projectTitle;
      });
      return currentProjects;
    })
    .then(duplicate => {
      duplicate ? duplicateMessage(projectTitle) : postProject(event);
    })
    //eslint-disable-next-line
    .catch(error => console.log(error));
};

const duplicateMessage = projectTitle => {
  alert(`The project "${projectTitle}" already exists`);
  $('.new-project-title').val('');
};

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    /*eslint-disable no-console*/
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log(`ServiceWorker ${registration} successful`);
      })
      .catch(error => {
        console.log(`ServiceWorker registration failed: ${error}`);
      });
  });
}

const setPendingProjectsToSynced = () => {
  return db.projects.where('status').equals('pendingSync').modify({status: 'synced'});
};

const setPendingPalettesToSynced = () => {
  return db.palettes.where('status').equals('pendingSync').modify({status: 'synced'});
};

const sentProjectToSync = project => {
  navigator.serviceWorker.controller.postMessage({
    type: 'projects',
    project
  });
};

const sendMessageToSync = project => {
  navigator.serviceWorker.controller.postMessage({
    type: 'add-project',
    project: project
  });
};

const sendPaletteToSync = palette => {
  navigator.serviceWorker.controller.postMessage({
    type: 'palettes',
    palette
  });
};

navigator.serviceWorker.addEventListener('message', event => {
  /*eslint-disable no-console*/
  if (event.data.type === 'project') {
    setPendingProjectsToSynced()
      .then(result => {
        console.log('send log', result);
      })
      .catch(error => console.error(error));
  } else if (event.data.type === 'palette') {
    setPendingPalettesToSynced()
      .then(() => {
      })
      .catch(error => console.error(error));
  }
});


$('.generate-button').on('click', updateRandomColors);

$('.new-project-save-button').on('click', checkForDuplicateProjects);

$('.new-palette-save-button').on('click', postPalette);

$('.color-container').on('click', '.unlocked-icon', toggleLocked);

$('.color-container').on('keyup', changeHexCode);

$('.projects-palettes-container').on('click', '.swatch-container',
  (event => updateAsidePalette(event.target)));

$('.projects-palettes-container').on('click', '.delete-palette-button',
  (event => deletePalette(event.target)));
