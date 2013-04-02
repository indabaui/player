require('SoundManager2');
var sm2 = soundManager;
var o = require('jquery');


module.exports = Player;
function Player() {
  this.el = o(require('./template'));

  sm2.setup({
    url: '/build/stereosteve-SoundManager2/swf',
    debugMode: false,
    flashVersion: 9,
  })
}

Player.prototype.play = function(url) {
  var self = this;
  self.sound = sm2.createSound({
    id: 'player.sound',
    url: url,
    autoPlay: true,
    whileplaying: function() {
      self.el.find('.sound-position').text(this.position);
      self.el.find('.sound-duration').text(this.duration);
    }
  });
}
