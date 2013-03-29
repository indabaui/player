
var swfUrl = '/build/uniba-sound-manager-2/swf';
var SoundManager = require('sound-manager-2');

module.exports = Player;
function Player() {
  this.el = document.createElement('div');
  this.el.textContent = 'el player';
  this.el.classList.add('player');


  var sm2 = new SoundManager();

  sm2.setup({
    url: swfUrl,
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
  console.log(sm2.setupOptions);
}
