const generateRandomColor = () => {
  console.log('in gen color');
  const characters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += characters[Math.floor(Math.random() * 16)];
  };
  return color;
};

const updateRandomColors = (i) => {
  for (var i = 0; i < 6; i++) {
// if the lock-icon is present, don't generate a random color
  if(!$(`.color${i}`).hasClass('locked')) {
    let color = generateRandomColor()
    $(`.color${i}`).css('background-color', color);
    $(`.code${i}`).text(color)
  };
 };
};

// GENERATE RANDOM COLOR ON PAGE LOAD
$(document).ready(() => {
  updateRandomColors();
});

// TOGGLE LOCKED and UNLOCKED
// FREEZE COLOR ON LOCK
$('.color-container').on('click', '.unlocked-icon', (e) => {
  $(e.target).toggleClass('locked-icon')
  $(e.target).parents('.color').toggleClass('locked');
})

// GENERATING RANDOM COLOR
$('.generate-button').on('click', updateRandomColors)
