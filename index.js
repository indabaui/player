require('SoundManager2');



module.exports = Player;
function Player() {
  this.el = document.createElement('div');
  this.el.textContent = 'el player';
  this.el.classList.add('player');

  var self = this;

  var url = "https://cloudup-files.s3.amazonaws.com/1355244692571.845b8dfc324b7bd3c548e8c06380908e";


  var sm2 = soundManager;
  sm2.setup({
    url: '/build/stereosteve-SoundManager2/swf',
    debugMode: false,
    flashVersion: 9,
    onready: playSound
  })

  function playSound() {
    var sound = sm2.createSound({
      id: url,
      url: url,
      autoPlay: true,
      whileplaying: function() {
        self.el.textContent = this.position;
      }
    });
  }

}
