var o = require('jquery')
  , formatMs = require('format-ms')
  , Emitter = require('emitter')


module.exports = Player;
function Player(sound) {
  if (!sound) throw new Error("sound is required");
  Emitter(this);
  this.sound = sound;
  this.el = o(require('./template'));
  this.togglePauseButton = this.el.find('.toggle-pause-button');
  this.togglePauseButton.click(this.togglePause.bind(this));
}

Player.prototype.scrub = function(position) {
  this.sound.setPosition(position);
  this.emit('scrub', { position: this.sound.position });
}

Player.prototype.play = function() {
  var self = this;
  var position = this.el.find('.sound-position');
  var progressBar = this.el.find('.progress-bar');
  var loadProgress = this.el.find('.load-progress');
  var playProgress = this.el.find('.play-progress');
  var doc = o(document)

  this.sound.play({
    whileloading: function() {
      var percent = this.bytesLoaded / this.bytesTotal * 100;
      loadProgress.css('width', percent + '%');
    },
    onplay: function() {
      if (this.loaded) loadProgress.css('width', '100%');
      self.emit('play');
    },
    whileplaying: function() {
      position.text(formatMs(this.position) + ' / ' + formatMs(this.duration));
      var percent = this.position / this.durationEstimate * 100;
      playProgress.css('width', percent + '%');
      self.emit('playing', { progress: percent });
    },
    onfinish: function() {
      self.updateUi();
      self.emit('finish');
    },
    onpause: function() {
      self.emit('pause');
    },
    onresume: function() {
      self.emit('resume');
    }
  });
  this.updateUi();

  progressBar.on('click', function(ev) {
    var percent = ev.offsetX / progressBar.width();
    var position = self.sound.durationEstimate * percent;
    self.scrub(position);
  });


  progressBar.on('mousedown', function(ev) {
    if (ev.which !== 1) return true
    function scrubMouseMove(ev) {
      var percent = (ev.pageX - progressBar.offset().left) / progressBar.width()
        , position = self.sound.durationEstimate * percent
      self.scrub(position);
      ev.preventDefault()
      return false
    }
    function scrubMouseUp(ev) {
      if (ev.which !== 1) return true
      doc.off('mousemove', scrubMouseMove)
      doc.off('mouseup', scrubMouseUp)
      ev.preventDefault()
      return false
    }
    doc.on('mousemove', scrubMouseMove)
    doc.on('mouseup', scrubMouseUp)
    scrubMouseMove(ev)
    ev.preventDefault()
    return false
  })

}

Player.prototype.togglePause = function() {
  if (this.sound.playState === 0) {
    this.play();
  } else {
    this.sound.togglePause();
  }
  this.updateUi();
};

Player.prototype.updateUi = function() {
  this.el.removeClass('playing paused');
  if (this.sound.paused || this.sound.playState === 0) {
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

