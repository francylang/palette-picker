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

  if(!$(`.color${i}`).hasClass('unlocked-icon')) {
    let color = generateRandomColor()
    $(`.color${i}`).css('background-color', color);
    $(`.code${i}`).text(color)
    console.log(color);
  };
 };
};

$(document).ready(() => {
  updateRandomColors();
});

// TOGGLE LOCKED and UNLOCKED
$('.color-container').on('click', '.unlocked-icon', (e) => {
  $(e.target).toggleClass('locked-icon')
  console.log(e.target);
})

// FREEZE COLOR ON LOCK


// GENERATING RANDOM COLOR
$('.generate-button').on('click', updateRandomColors)
