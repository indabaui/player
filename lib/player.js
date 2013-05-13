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

  this.position = this.el.find('.sound-position');
  this.progressBar = this.el.find('.progress-bar');
  this.loadProgress = this.el.find('.load-progress');
  this.playProgress = this.el.find('.play-progress');

  var self = this
    , doc = o(document)

  this.progressBar.on('click', function(ev) {
    var percent = ev.offsetX / self.progressBar.width();
    var position = self.sound.durationEstimate * percent;
    self.scrub(position);
  });

  this.progressBar.on('mousedown', function(ev) {
    if (ev.which !== 1) return true;
    function scrubMouseMove(ev) {
      var percent = (ev.pageX - self.progressBar.offset().left) / self.progressBar.width()
        , position = self.sound.durationEstimate * percent
      self.scrub(position);
      ev.preventDefault();
      return false;
    }
    function scrubMouseUp(ev) {
      if (ev.which !== 1) return true;
      doc.off('mousemove', scrubMouseMove);
      doc.off('mouseup', scrubMouseUp);
      ev.preventDefault();
      return false;
    }
    doc.on('mousemove', scrubMouseMove);
    doc.on('mouseup', scrubMouseUp);
    scrubMouseMove(ev);
    ev.preventDefault();
    return false;
  });
}

Player.prototype.scrub = function(position) {
  this.sound.setPosition(position);
  this.emit('scrub', { position: this.sound.position });
};

Player.prototype.load = function() {
  this.sound.load(createCallbacks(this));
  this.updateUi();
};

Player.prototype.play = function() {
  this.sound.play(createCallbacks(this));
  this.updateUi();
};

function createCallbacks(self) {
  return {
    whileloading: function() {
      var percent = this.bytesLoaded / this.bytesTotal * 100;
      self.loadProgress.css('width', percent + '%');
      self.emit('loading', { bytesLoaded: this.bytesLoaded, bytesTotal: this.bytesTotal, duration: this.duration });
    },
    onload: function() {
      self.emit('loaded');
    },
    onplay: function() {
      if (this.loaded) self.loadProgress.css('width', '100%');
      self.emit('play');
    },
    whileplaying: function() {
      self.position.text(formatMs(this.position) + ' / ' + formatMs(this.duration));
      var percent = this.position / this.durationEstimate * 100;
      self.playProgress.css('width', percent + '%');
      self.emit('playing', { progress: percent, position: this.position });
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
  };
}

Player.prototype.togglePause = function() {
  if (this.sound.playState === 0) {
    this.play();
  } else {
    this.sound.togglePause();
  }
  this.updateUi();
};

Player.prototype.stop = function() {
  this.sound.stop();
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
};

Player.prototype.soundcloudStyle = function() {
  this.el.addClass('soundcloud-player');
};

Player.prototype.indabaStyle = function() {
  this.el.addClass('indaba-player');
};

Player.prototype.setWaveformUrl = function(url) {
  this.el.find('img.waveform').attr('src', url);
};

