'use strict';

(function () {

  var Immutable = require('immutable');
  var Canvasimo = require('canvasimo');
  var Slik = require('../../../src/index.js');

  var element, canvas, person;

  var SPEED = 0.3;

  function drawLimb (limb, length) {
    canvas
      .save()
      .rotate(limb.get('upper') * Math.PI / 180)
      .beginPath()
      .strokeLine(0, 0, 0, length)
      .translate(0, length)
      // Lower right
      .rotate(limb.get('lower') * Math.PI / 180)
      .beginPath()
      .strokeLine(0, 0, 0, length)
      .restore();
  }

  function drawHead () {
    canvas
      .save()
      .rotate(person.get('headRotation') * Math.PI / 180)
      .strokeCircle(0, -17, 15)
      .restore();
  }

  function drawUpperBody () {
    canvas
      .rotate(person.get('bodyRotation') * Math.PI / 180)
      .beginPath()
      .strokeLine(0, 0, 0, -65)
      .translate(0, -65)
      .tap(drawHead)
      .tap(drawLimb.bind(null, person.get('rightArm'), 40))
      .tap(drawLimb.bind(null, person.get('leftArm'), 40));
  }

  function render () {
    var size = canvas.getSize();

    canvas
      .clearCanvas()
      .setStroke('black')
      .setStrokeWidth(4)
      .setStrokeCap('round')
      // Draw upper body
      .save()
      .translate(size.width / 2, size.height - 100 + person.get('yOffset'))
      .tap(drawUpperBody)
      .restore()
      // Draw legs
      .save()
      .translate(size.width / 2, size.height - 100 + person.get('yOffset'))
      .tap(drawLimb.bind(null, person.get('rightLeg'), 50))
      .tap(drawLimb.bind(null, person.get('leftLeg'), 50))
      .restore();
  }

  function init () {
    element = document.getElementById('running-man');
    canvas = new Canvasimo(element);

    var initialPerson = Immutable.fromJS({
      yOffset: 0,
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
    });

    var rightLegUp = Immutable.fromJS({
      yOffset: 0,
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
    });

    var rightLegForward = Immutable.fromJS({
      yOffset: 0,
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
    });

    var leftLegUp = Immutable.fromJS({
      yOffset: 0,
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
    });

    var leftLegForward = Immutable.fromJS({
      yOffset: 0,
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
    });

    var jumpUpValues = Immutable.fromJS({
      yOffset: -100,
      bodyRotation: 30,
      headRotation: 20,
      rightArm: {
        upper: 0,
        lower: -105
      },
      leftArm: {
        upper: 5,
        lower: -120
      },
      rightLeg: {
        upper: -70,
        lower: 90
      },
      leftLeg: {
        upper: -65,
        lower: 105
      }
    });

    var jumpDownValues = Immutable.fromJS({
      yOffset: 0,
      bodyRotation: 10,
      headRotation: 20,
      rightArm: {
        upper: -10,
        lower: -70
      },
      leftArm: {
        upper: -5,
        lower: -80
      },
      rightLeg: {
        upper: -10,
        lower: 10
      },
      leftLeg: {
        upper: -20,
        lower: 20
      }
    });

    var moveRightLegUp, moveRightLegForward, moveLeftLegUp, moveLeftLegForward, jumpUp, jumpDown;
    var steps = 0;
    var jumping = false;

    var animation = new Slik.Animation({
      from: initialPerson
    })
    .first(function (values) {
      person = values;
      render();
    })
    .on('update', function (values) {
      person = values;
      render();
    });

    function nextStepFromHere (result) {
      animation
        .from(result);
    }

    function everyOther4Steps () {
      return steps % 8 >= 4;
    }

    function invertEvery4Steps () {
      if (everyOther4Steps()) {
        animation.invert();
      }
    }

    function invertJumpDirection (values) {
      if (everyOther4Steps()) {
        return values.set('yOffset', values.get('yOffset') * -1);
      }

      return values;
    }

    function incrementStep () {
      steps += 1;
    }

    moveRightLegUp = function () {
      animation
        .first(invertEvery4Steps)
        .to(rightLegUp)
        .duration(700 * SPEED)
        .ease(Slik.Easing.EaseOutSine)
        .then(nextStepFromHere)
        .then(moveRightLegForward)
        .start();
    };

    moveRightLegForward = function () {
      animation
        .first(invertEvery4Steps)
        .to(rightLegForward)
        .duration(500 * SPEED)
        .ease(Slik.Easing.EaseInSine)
        .then(nextStepFromHere)
        .then(moveLeftLegUp)
        .start();
    };

    moveLeftLegUp = function () {
      animation
        .first(invertEvery4Steps)
        .to(leftLegUp)
        .duration(700 * SPEED)
        .ease(Slik.Easing.EaseOutSine)
        .then(nextStepFromHere)
        .then(moveLeftLegForward)
        .start();
    };

    moveLeftLegForward = function () {
      animation
        .first(invertEvery4Steps)
        .to(leftLegForward)
        .duration(500 * SPEED)
        .ease(Slik.Easing.EaseInSine)
        .then(incrementStep)
        .then(nextStepFromHere)
        .then(moveRightLegUp)
        .start();
    };

    jumpUp = function () {
      animation
        .stop()
        .to(invertJumpDirection(jumpUpValues))
        .first(nextStepFromHere)
        .first(invertEvery4Steps)
        .duration(800 * SPEED)
        .ease(Slik.Easing.EaseOutSine)
        .then(jumpDown)
        .start();
    };

    jumpDown = function () {
      animation
        .to(invertJumpDirection(jumpDownValues))
        .first(nextStepFromHere)
        .first(invertEvery4Steps)
        .duration(800 * SPEED)
        .ease(Slik.Easing.EaseInSine)
        .then(nextStepFromHere)
        .then(function () {
          jumping = false;
        })
        .then(moveRightLegUp)
        .start()
    }

    moveRightLegUp();

    var playPauseButton = document.getElementById('play-pause');
    var jumpButton = document.getElementById('jump');

    playPauseButton.addEventListener('click', function () {
      if (animation.playing()) {
        animation.pause();
      } else {
        animation.start();
      }
    });

    jumpButton.addEventListener('click', function () {
      if (!jumping && animation.playing()) {
        jumping = true;
        jumpUp();
      }
    });

  }

  init();

})();
