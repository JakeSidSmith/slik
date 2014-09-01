/*global flo*/

'use strict';

var canvasElement, canvas, cWidth, cHeight, person, speed, additionalPositions, additionalAnimations;

speed = 0.3;

var drawUpperBody = function () {
  canvas.rotate(person.position.bodyRotation * Math.PI / 180);
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
};

var drawHead = function () {
  canvas.save();
  canvas.rotate(person.position.headRotation * Math.PI / 180);
  canvas.beginPath();
  canvas.arc(0,-17,15,0,2*Math.PI);
  canvas.closePath();
  canvas.stroke();
  canvas.restore();
};

var drawRightArm = function () {
  canvas.save();
  canvas.rotate(person.position.arms.upperRightArmRotation * Math.PI / 180);
  canvas.beginPath();
  canvas.moveTo(0, 0);
  canvas.lineTo(0, 40);
  canvas.moveTo(0, 0);
  canvas.closePath();
  canvas.stroke();
  canvas.translate(0, 40);
  // Lower right
  canvas.rotate(person.position.arms.lowerRightArmRotation * Math.PI / 180);
  canvas.beginPath();
  canvas.moveTo(0, 0);
  canvas.lineTo(0, 40);
  canvas.moveTo(0, 0);
  canvas.closePath();
  canvas.stroke();
  canvas.restore();
};

var drawLeftArm = function () {
  canvas.save();
  canvas.rotate(person.position.arms.upperLeftArmRotation * Math.PI / 180);
  canvas.beginPath();
  canvas.moveTo(0, 0);
  canvas.lineTo(0, 40);
  canvas.moveTo(0, 0);
  canvas.closePath();
  canvas.stroke();
  canvas.translate(0, 40);
  // Lower right
  canvas.rotate(person.position.arms.lowerLeftArmRotation * Math.PI / 180);
  canvas.beginPath();
  canvas.moveTo(0, 0);
  canvas.lineTo(0, 40);
  canvas.moveTo(0, 0);
  canvas.closePath();
  canvas.stroke();
  canvas.restore();
};

var drawRightLeg = function () {
  // Right leg
  canvas.save();
  canvas.rotate(person.position.legs.upperRightLegRotation * Math.PI / 180);
  canvas.beginPath();
  canvas.moveTo(0, 0);
  canvas.lineTo(0, 50);
  canvas.moveTo(0, 0);
  canvas.closePath();
  canvas.stroke();
  // Lower right
  canvas.translate(0, 50);
  canvas.rotate(person.position.legs.lowerRightLegRotation * Math.PI / 180);
  canvas.beginPath();
  canvas.moveTo(0, 0);
  canvas.lineTo(0, 50);
  canvas.moveTo(0, 0);
  canvas.closePath();
  canvas.stroke();
  canvas.restore();
};

var drawLeftLeg = function () {
  // Left leg
  canvas.save();
  canvas.rotate(person.position.legs.upperLeftLegRotation * Math.PI / 180);
  canvas.beginPath();
  canvas.moveTo(0, 0);
  canvas.lineTo(0, 50);
  canvas.moveTo(0, 0);
  canvas.closePath();
  canvas.stroke();
  // Lower left
  canvas.translate(0, 50);
  canvas.rotate(person.position.legs.lowerLeftLegRotation * Math.PI / 180);
  canvas.beginPath();
  canvas.moveTo(0, 0);
  canvas.lineTo(0, 50);
  canvas.moveTo(0, 0);
  canvas.closePath();
  canvas.stroke();
  canvas.restore();
};

var render = function () {
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

  person.flo.animate();
  additionalAnimations.animate();

  canvas.fillStyle = 'black';
  canvas.rect(additionalPositions[0] - 5, additionalPositions[1] - 10, 10, 10);
  canvas.fill();

  if (person.flo.currentAnimation === undefined) {
    person.flo.do('rightLegUp');
  }

  flo().requestAnimationFrame(render);
};

var init = function () {
  canvasElement = document.getElementById('canvas');
  canvas = canvasElement.getContext('2d');
  cWidth = canvasElement.width;
  cHeight = canvasElement.height;

  person = {
    position: {
      bodyRotation: 0,
      headRotation: 0,
      arms: {
        upperRightArmRotation: 0,
        lowerRightArmRotation: 0,
        upperLeftArmRotation: 0,
        lowerLeftArmRotation: 0
      },
      legs: {
        upperRightLegRotation: 0,
        lowerRightLegRotation: 0,
        upperLeftLegRotation: 0,
        lowerLeftLegRotation: 0
      }
    }
  };

  person.flo = flo(person.position);

  additionalPositions = [120, 240];

  additionalAnimations = flo(additionalPositions);

  additionalAnimations.animation('moveDown')
    .duration(1000)
    .nextPosition([120, 480])
    .ease('in')
    .onComplete('moveUp')
    .do();

  additionalAnimations.animation('moveUp')
    .duration(1000)
    .nextPosition([120, 240])
    .ease('out')
    .onComplete('moveDown');

  person.flo.animation('rightLegUp')
    .duration(700 * speed)
    .nextPosition(
      {
        bodyRotation: 5,
        headRotation: 10,
        arms: {
          upperRightArmRotation: 70,
          lowerRightArmRotation: -100,
          upperLeftArmRotation: -45,
          lowerLeftArmRotation: -100
        },
        legs: {
          upperRightLegRotation: -40,
          lowerRightLegRotation: 50,
          upperLeftLegRotation: 20,
          lowerLeftLegRotation: 25
        }
      }
    )
    .onComplete('rightLegForward')

  .animation('rightLegForward')
    .duration(500 * speed)
    .nextPosition(
      {
        bodyRotation: 10,
        headRotation: 20,
        arms: {
          upperRightArmRotation: 45,
          lowerRightArmRotation: -70,
          upperLeftArmRotation: -30,
          lowerLeftArmRotation: -45
        },
        legs: {
          upperRightLegRotation: -10,
          lowerRightLegRotation: 0,
          upperLeftLegRotation: 30,
          lowerLeftLegRotation: 55
        }
      }
    )
    .onComplete('leftLegUp');

  person.flo.animation('leftLegUp')
    .duration(700 * speed)
    .nextPosition(
      {
        bodyRotation: 5,
        headRotation: 10,
        arms: {
          upperRightArmRotation: -45,
          lowerRightArmRotation: -100,
          upperLeftArmRotation: 70,
          lowerLeftArmRotation: -100
        },
        legs: {
          upperRightLegRotation: 20,
          lowerRightLegRotation: 25,
          upperLeftLegRotation: -40,
          lowerLeftLegRotation: 50
        }
      }
    )
    .onComplete('leftLegForward');

  var steps = 0;

  person.flo.animation('leftLegForward')
    .duration(500 * speed)
    .nextPosition(
      {
        bodyRotation: 10,
        headRotation: 20,
        arms: {
          upperRightArmRotation: -30,
          lowerRightArmRotation: -45,
          upperLeftArmRotation: 45,
          lowerLeftArmRotation: -70
        },
        legs: {
          upperRightLegRotation: 30,
          lowerRightLegRotation: 55,
          upperLeftLegRotation: -10,
          lowerLeftLegRotation: 0
        }
      }
    )
    .onComplete(function () {
      steps += 1;
      if (steps % 5 === 0) {
        person.flo.animation('rightLegUp').invert();
        person.flo.animation('rightLegForward').invert();
        person.flo.animation('leftLegUp').invert();
        person.flo.animation('leftLegForward').invert();
      }
      person.flo.do('rightLegUp');
    });

  flo().requestAnimationFrame(render);
};

var enterFullscreen = function () { //jshint ignore:line
  flo().enterFullscreen(document.getElementById('canvas'));
};

flo().onDocumentReady(init);