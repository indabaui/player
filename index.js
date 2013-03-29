
module.exports = Player;
function Player() {
  this.el = document.createElement('div');
  this.el.textContent = 'el player';
  this.el.classList.add('player');

  var url = "https://cloudup-files.s3.amazonaws.com/1355244692571.845b8dfc324b7bd3c548e8c06380908e";


  var sm2 = soundManager;
  sm2.setup({
    url: '/sm2',
    debugMode: false,
    flashVersion: 9,
    onready: function() {
      console.log('onready');
      var sound = sm2.createSound({
        id: url,
        url: url,
        autoPlay: true
      });
    }
  })
  console.log(sm2.setupOptions, 'dagg');
}
