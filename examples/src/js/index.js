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
    additionalPositions,
    additionalPositions2;

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
    canvas.rotate(person.getIn(['rightArm', 'upper']) * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 40);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.translate(0, 40);
    // Lower right
    canvas.rotate(person.getIn(['rightArm', 'lower']) * Math.PI / 180);
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
    canvas.rotate(person.getIn(['leftArm', 'upper']) * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 40);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.translate(0, 40);
    // Lower right
    canvas.rotate(person.getIn(['leftArm', 'lower']) * Math.PI / 180);
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
    canvas.rotate(person.getIn(['rightLeg', 'upper']) * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 50);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    // Lower right
    canvas.translate(0, 50);
    canvas.rotate(person.getIn(['rightLeg', 'lower']) * Math.PI / 180);
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
    canvas.rotate(person.getIn(['leftLeg', 'upper']) * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 50);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    // Lower left
    canvas.translate(0, 50);
    canvas.rotate(person.getIn(['leftLeg', 'lower']) * Math.PI / 180);
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

    canvas.fillStyle = 'black';
    canvas.rect(additionalPositions2.get(0) - 5, additionalPositions2.get(1) - 10, 10, 10);
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
      rightArm: {
        upper: 0,
        lower: 0
      },
      leftArm: {
        upper: 0,
        lower: 0
      },
      rightLeg: {
        upper: 0,
        lower: 0
      },
      leftLeg: {
        upper: 0,
        lower: 0
      }
    };

    var rightLegUp = {
      bodyRotation: 5,
      headRotation: 10,
      rightArm: {
        upper: 70,
        lower: -100
      },
      leftArm: {
        upper: -45,
        lower: -100
      },
      rightLeg: {
        upper: -40,
        lower: 50
      },
      leftLeg: {
        upper: 20,
        lower: 25
      }
    };

    var rightLegForward = {
      bodyRotation: 10,
      headRotation: 20,
      rightArm: {
        upper: 45,
        lower: -70
      },
      leftArm: {
        upper: -30,
        lower: -45
      },
      rightLeg: {
        upper: -10,
        lower: 0
      },
      leftLeg: {
        upper: 30,
        lower: 55
      }
    };

    var leftLegUp = {
      bodyRotation: 5,
      headRotation: 10,
      rightArm: {
        upper: -45,
        lower: -100
      },
      leftArm: {
        upper: 70,
        lower: -100
      },
      rightLeg: {
        upper: 20,
        lower: 25
      },
      leftLeg: {
        upper: -40,
        lower: 50
      }
    };

    var leftLegForward = {
      bodyRotation: 10,
      headRotation: 20,
      rightArm: {
        upper: -30,
        lower: -45
      },
      leftArm: {
        upper: 45,
        lower: -70
      },
      rightLeg: {
        upper: 30,
        lower: 55
      },
      leftLeg: {
        upper: -10,
        lower: 0
      }
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
      duration: 500,
      ease: Slik.Easing.Dip,
      loop: true
    })
    .on('start', function (values) {
      additionalPositions = values;
    })
    .on('update', function (values) {
      additionalPositions = values;
      render();
    })
    .on('loop', function () {
      additionalAnimation.reverse();
    })
    .start();

    var additionalAnimation2 = new Slik.Animation({
      from: [140, 240],
      to: [140, 480],
      duration: 500,
      ease: Slik.Easing.EaseOut,
      loop: true
    })
    .on('start', function (values) {
      additionalPositions2 = values;
    })
    .on('update', function (values) {
      additionalPositions2 = values;
      render();
    })
    .on('loop', function () {
      additionalAnimation2.reverse();
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
