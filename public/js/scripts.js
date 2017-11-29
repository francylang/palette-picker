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

$(document).ready(() => {
  updateRandomColors();
});

$('.color-container').on('click', '.unlocked-icon', (event) => {
  $(event.target).toggleClass('locked-icon');
  $(event.target).parents('.color').toggleClass('locked');
});

$('.generate-button').on('click', updateRandomColors);
