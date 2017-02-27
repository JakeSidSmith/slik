'use strict';

(function () {

  // var Immutable = require('immutable');
  // var Canvasimo = require('canvasimo');
  var Slik = require('../../../src/index.js');

  var canvasElement,
    canvas,
    cWidth,
    cHeight,
    person,
    additionalPositions;

  var SPEED = 0.3;

  function drawHead () {
    canvas.save();
    canvas.rotate(person.get('headRotation') * Math.PI / 180);
    canvas.beginPath();
    canvas.arc(0, -17, 15, 0, 2 * Math.PI);
    canvas.closePath();
    canvas.stroke();
    canvas.restore();
  }

  function drawRightArm () {
    canvas.save();
    canvas.rotate(person.get('upperRightArmRotation') * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 40);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.translate(0, 40);
    // Lower right
    canvas.rotate(person.get('lowerRightArmRotation') * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 40);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.restore();
  }

  function drawLeftArm () {
    canvas.save();
    canvas.rotate(person.get('upperLeftArmRotation') * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 40);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.translate(0, 40);
    // Lower right
    canvas.rotate(person.get('lowerLeftArmRotation') * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 40);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.restore();
  }

  function drawUpperBody () {
    canvas.rotate(person.get('bodyRotation') * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, -65);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.translate(0, -65);
    drawHead();
    drawRightArm();
    drawLeftArm();
  }

  function drawRightLeg () {
    // Right leg
    canvas.save();
    canvas.rotate(person.get('upperRightLegRotation') * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 50);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    // Lower right
    canvas.translate(0, 50);
    canvas.rotate(person.get('lowerRightLegRotation') * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 50);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.restore();
  }

  function drawLeftLeg () {
    // Left leg
    canvas.save();
    canvas.rotate(person.get('upperLeftLegRotation') * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 50);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    // Lower left
    canvas.translate(0, 50);
    canvas.rotate(person.get('lowerLeftLegRotation') * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 50);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.restore();
  }

  function render () {
    canvas.clearRect(0, 0, cWidth, cHeight);
    canvas.strokeStyle = 'black';
    canvas.lineWidth = 4;
    canvas.lineCap = 'round';

    // Draw upper body
    canvas.save();
    canvas.translate(cWidth / 2, cHeight - 100);
    drawUpperBody();
    canvas.restore();
    // Draw legs
    canvas.save();
    canvas.translate(cWidth / 2, cHeight - 100);
    drawRightLeg();
    drawLeftLeg();
    canvas.restore();

    canvas.fillStyle = 'black';
    canvas.rect(additionalPositions.get(0) - 5, additionalPositions.get(1) - 10, 10, 10);
    canvas.fill();
  }

  function init () {
    canvasElement = document.getElementById('canvas');
    canvas = canvasElement.getContext('2d');
    cWidth = canvasElement.width;
    cHeight = canvasElement.height;

    var initialPerson = {
      bodyRotation: 0,
      headRotation: 0,
      upperRightArmRotation: 0,
      lowerRightArmRotation: 0,
      upperLeftArmRotation: 0,
      lowerLeftArmRotation: 0,
      upperRightLegRotation: 0,
      lowerRightLegRotation: 0,
      upperLeftLegRotation: 0,
      lowerLeftLegRotation: 0
    };

    var rightLegUp = {
      bodyRotation: 5,
      headRotation: 10,
      upperRightArmRotation: 70,
      lowerRightArmRotation: -100,
      upperLeftArmRotation: -45,
      lowerLeftArmRotation: -100,
      upperRightLegRotation: -40,
      lowerRightLegRotation: 50,
      upperLeftLegRotation: 20,
      lowerLeftLegRotation: 25
    };

    var rightLegForward = {
      bodyRotation: 10,
      headRotation: 20,
      upperRightArmRotation: 45,
      lowerRightArmRotation: -70,
      upperLeftArmRotation: -30,
      lowerLeftArmRotation: -45,
      upperRightLegRotation: -10,
      lowerRightLegRotation: 0,
      upperLeftLegRotation: 30,
      lowerLeftLegRotation: 55
    };

    var leftLegUp = {
      bodyRotation: 5,
      headRotation: 10,
      upperRightArmRotation: -45,
      lowerRightArmRotation: -100,
      upperLeftArmRotation: 70,
      lowerLeftArmRotation: -100,
      upperRightLegRotation: 20,
      lowerRightLegRotation: 25,
      upperLeftLegRotation: -40,
      lowerLeftLegRotation: 50
    };

    var leftLegForward = {
      bodyRotation: 10,
      headRotation: 20,
      upperRightArmRotation: -30,
      lowerRightArmRotation: -45,
      upperLeftArmRotation: 45,
      lowerLeftArmRotation: -70,
      upperRightLegRotation: 30,
      lowerRightLegRotation: 55,
      upperLeftLegRotation: -10,
      lowerLeftLegRotation: 0
    };

    var steps = 0;

    var animation = new Slik.Animation({
      from: initialPerson
    })
    .on('start', function (values) {
      person = values;
    })
    .on('update', function (values) {
      person = values;
      render();
    });

    var additionalAnimation = new Slik.Animation({
      from: [120, 240],
      to: [120, 480],
      ease: Slik.Easing.Ease,
      loop: true
    })
    .on('start', function (values) {
      person = values;
    })
    .on('update', function (values) {
      additionalPositions = values;
      render();
    })
    .on('loop', function () {
      additionalAnimation.reverse();
    })
    .start();

    var moveRightLegUp, moveRightLegForward, moveLeftLegUp, moveLeftLegForward;

    moveRightLegUp = function () {
      animation
        .to(rightLegUp)
        .duration(700 * SPEED)
        .ease(Slik.Easing.EaseOut)
        .then(function (result) {
          animation
            .from(result);

          moveRightLegForward();
        })
        .start();
    };

    moveRightLegForward = function () {
      animation
        .to(rightLegForward)
        .duration(500 * SPEED)
        .ease(Slik.Easing.EaseIn)
        .then(function (result) {
          animation
            .from(result);

          moveLeftLegUp();
        })
        .start();
    };

    moveLeftLegUp = function () {
      animation
        .to(leftLegUp)
        .duration(700 * SPEED)
        .ease(Slik.Easing.EaseOut)
        .then(function (result) {
          animation
            .from(result);

          moveLeftLegForward();
        })
        .start();
    };

    moveLeftLegForward = function () {
      animation
        .to(leftLegForward)
        .duration(500 * SPEED)
        .ease(Slik.Easing.EaseIn)
        .then(function (result) {
          steps += 1;

          animation
            .from(result);

          if (steps > 0 && steps % 4 === 0) {
            animation.invert();
          }

          moveRightLegUp();
        })
        .start();
    };

    moveRightLegUp();

  }

  init();

})();
