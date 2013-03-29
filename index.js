module.exports = Player;
function Player() {
  this.el = document.createElement('div');
  this.el.textContent = 'el player';
  this.el.classList.add('player');
}
