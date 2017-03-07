'use strict';

(function () {

  var Slik = require('../../../src/index');
  var Canvasimo = require('canvasimo');

  var element = document.getElementById('canvas');
  var canvas = new Canvasimo(element);

  var playPauseButton = document.getElementById('play-pause');
  var stopButton = document.getElementById('stop');
  var easingSelect = document.getElementById('easing');
  var animatedSelect = document.getElementById('animated');
  var durationSelect = document.getElementById('duration');
  var loopInput = document.getElementById('loop');
  var reverseInput = document.getElementById('reverse');

  var animation;

  var animate = 'position';
  var SQUARE_SIZE = 50;
  var size = canvas.getSize();
  var width = size.width - SQUARE_SIZE * 4;

  function reverseEachLoop () {
    animation.reverse();
  }

  function render (value) {
    var position = animate === 'position' ? width * value : width / 2;
    var rotation = animate === 'rotation' ? value * Math.PI : 0;
    var scale = animate === 'scale' ? 1 + value * 2 : 1;

    canvas
      .clearCanvas()
      .setFill('#000')
      .translate(size.width / 2, size.height / 2)
      .translate(-width / 2, 0)
      .translate(position, 0)
      .rotate(rotation)
      .scale(scale, scale)
      .fillRect(-SQUARE_SIZE / 2, -SQUARE_SIZE / 2, SQUARE_SIZE, SQUARE_SIZE);
  }

  render();

  animation = new Slik.Animation({
    from: 0,
    to: 1,
    loop: true,
    duration: 1000,
    ease: Slik.Easing.EaseInOutSine
  })
    .on('loop', reverseEachLoop)
    .on('update', render)
    .start();

  function playPauseButtonClicked () {
    if (animation.playing()) {
      animation.pause();
    } else {
      animation.start();
    }
  }

  function stopButtonClicked () {
    animation.stop();
  }

  function easingSelectChanged (event) {
    animation.ease(Slik.Easing[event.target.value]);
  }

  function animatedSelectChanged (event) {
    animate = event.target.value;
  }

  function durationSelectChanged (event) {
    animation.duration(event.target.value);
  }

  function loopInputChanged (event) {
    if (event.target.checked) {
      animation.loop(true);
    } else {
      animation.loop(false);
    }
  }

  function reverseInputChanged (event) {
    if (event.target.checked) {
      animation.on('loop', reverseEachLoop);
    } else {
      animation.off('loop', reverseEachLoop);
    }
  }

  playPauseButton.addEventListener('click', playPauseButtonClicked);
  stopButton.addEventListener('click', stopButtonClicked);
  easingSelect.addEventListener('change', easingSelectChanged);
  animatedSelect.addEventListener('change', animatedSelectChanged);
  durationSelect.addEventListener('change', durationSelectChanged);
  loopInput.addEventListener('change', loopInputChanged);
  reverseInput.addEventListener('change', reverseInputChanged);

})();
