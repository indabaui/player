var o = require('jquery');


module.exports = Player;
function Player() {
  this.el = o(require('./template'));
  this.togglePauseButton = this.el.find('.toggle-pause-button');
  this.togglePauseButton.click(this.togglePause.bind(this));
}

Player.prototype.play = function(sound) {
  this.sound = sound;
  var position = this.el.find('.sound-position');
  var progressBar = this.el.find('.progress-bar');
  var loadProgress = this.el.find('.load-progress');
  var playProgress = this.el.find('.play-progress');

  sound.play({
    whileloading: function() {
      var percent = this.bytesLoaded / this.bytesTotal * 100;
      loadProgress.css('width', percent + '%');
    },
    whileplaying: function() {
      position.text(formatMs(this.position) + ' / ' + formatMs(this.duration));
      var percent = this.position / this.durationEstimate * 100;
      playProgress.css('width', percent + '%');
    }
  });
  this.updateUi();

  progressBar.on('click', function(ev) {
    var percent = ev.offsetX / progressBar.width();
    var position = sound.durationEstimate * percent;
    sound.setPosition(position);
  });
}

Player.prototype.togglePause = function() {
  this.sound.togglePause();
  this.updateUi();
};

Player.prototype.updateUi = function() {
  this.el.removeClass('playing paused');
  if (this.sound.paused) {
    this.el.addClass('paused');
    this.togglePauseButton.text("▶");
  } else {
    this.el.addClass('playing');
    this.togglePauseButton.text("❚❚");
  }
}

Player.prototype.soundcloudStyle = function() {
  this.el.addClass('soundcloud-player');
}

Player.prototype.indabaStyle = function() {
  this.el.addClass('indaba-player');
}

Player.prototype.setWaveformUrl = function(url) {
  this.el.find('img.waveform').attr('src', url);
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
