var o = require('jquery');


module.exports = Player;
function Player() {
  this.el = o(require('./template'));
}

Player.prototype.play = function(sound) {
  var position = this.el.find('.sound-position');
  var duration = this.el.find('.sound-duration');

  sound.play({
    whileplaying: function() {
      position.text(formatMs(this.position));
      duration.text(formatMs(this.durationEstimate));
    }
  });
}

function formatMs(ms) {
  if (!ms) return '0:00';
  var hours, minutes, seconds;
  hours = Math.floor(ms / (60 * 60 * 1000));
  minutes = Math.floor((ms / 60000) % 60);
  seconds = Math.floor((ms / 1000) % 60);
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  return minutes + ":" + seconds;
}
