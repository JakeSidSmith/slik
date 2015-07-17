(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {

  var flo = require('../../../src/index.js');

  var canvasElement, canvas, cWidth, cHeight, person, speed, additionalPositions, additionalAnimations;

  speed = 0.3;

  var drawUpperBody = function drawUpperBody() {
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

  var drawHead = function drawHead() {
    canvas.save();
    canvas.rotate(person.position.headRotation * Math.PI / 180);
    canvas.beginPath();
    canvas.arc(0, -17, 15, 0, 2 * Math.PI);
    canvas.closePath();
    canvas.stroke();
    canvas.restore();
  };

  var drawRightArm = function drawRightArm() {
    canvas.save();
    canvas.rotate(person.position.upperRightArmRotation * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 40);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.translate(0, 40);
    // Lower right
    canvas.rotate(person.position.lowerRightArmRotation * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 40);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.restore();
  };

  var drawLeftArm = function drawLeftArm() {
    canvas.save();
    canvas.rotate(person.position.upperLeftArmRotation * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 40);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.translate(0, 40);
    // Lower right
    canvas.rotate(person.position.lowerLeftArmRotation * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 40);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.restore();
  };

  var drawRightLeg = function drawRightLeg() {
    // Right leg
    canvas.save();
    canvas.rotate(person.position.upperRightLegRotation * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 50);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    // Lower right
    canvas.translate(0, 50);
    canvas.rotate(person.position.lowerRightLegRotation * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 50);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.restore();
  };

  var drawLeftLeg = function drawLeftLeg() {
    // Left leg
    canvas.save();
    canvas.rotate(person.position.upperLeftLegRotation * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 50);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    // Lower left
    canvas.translate(0, 50);
    canvas.rotate(person.position.lowerLeftLegRotation * Math.PI / 180);
    canvas.beginPath();
    canvas.moveTo(0, 0);
    canvas.lineTo(0, 50);
    canvas.moveTo(0, 0);
    canvas.closePath();
    canvas.stroke();
    canvas.restore();
  };

  var render = function render() {
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
      person.flo['do']('rightLegUp');
    }

    flo().requestAnimationFrame(render);
  };

  var init = function init() {
    canvasElement = document.getElementById('canvas');
    canvas = canvasElement.getContext('2d');
    cWidth = canvasElement.width;
    cHeight = canvasElement.height;

    person = {
      position: {
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
      }
    };

    person.flo = flo(person.position);

    additionalPositions = [120, 240];

    additionalAnimations = flo(additionalPositions);

    additionalAnimations.animation('moveDown').duration(1000).nextPosition([120, 480]).ease('in').onComplete('moveUp')['do']();

    additionalAnimations.animation('moveUp').duration(1000).nextPosition([120, 240]).ease('out').onComplete('moveDown');

    person.flo.animation('rightLegUp').duration(700 * speed).nextPosition({
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
    }).onComplete('rightLegForward');

    person.flo.animation('rightLegForward').duration(500 * speed).nextPosition({
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
    }).onComplete('leftLegUp');

    person.flo.animation('leftLegUp').duration(700 * speed).nextPosition({
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
    }).onComplete('leftLegForward');

    var steps = 0;

    person.flo.animation('leftLegForward').duration(500 * speed).nextPosition({
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
    }).onComplete(function () {
      steps += 1;
      if (steps % 5 === 0) {
        person.flo.animation('rightLegUp').invert();
        person.flo.animation('rightLegForward').invert();
        person.flo.animation('leftLegUp').invert();
        person.flo.animation('leftLegForward').invert();
      }
      person.flo['do']('rightLegUp');
    });

    flo().requestAnimationFrame(render);
  };

  var enterFullscreen = function enterFullscreen() {
    flo().enterFullscreen(document.getElementById('canvas'));
  };

  var fullScreenButton = document.getElementById('full-screen');
  fullScreenButton.addEventListener('click', enterFullscreen);

  flo().onDocumentReady(init);
})();

},{"../../../src/index.js":2}],2:[function(require,module,exports){
'use strict';

(function () {

  var flo = function flo(position) {

    var floObject = {
      position: position,
      animations: {},
      requestAnimationFrame: function requestAnimationFrame(func) {
        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
        requestAnimationFrame(func);
      },
      isFullscreen: function isFullscreen() {
        return document.fullscreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
      },
      enterFullscreen: function enterFullscreen(element) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        }
      },
      exitFullscreen: function exitFullscreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      },
      onDocumentReady: function onDocumentReady(func) {
        var domContentLoaded = false;
        var runFunction = function runFunction() {
          if (!domContentLoaded) {
            domContentLoaded = true;
            func();
          }
        };
        if (document.addEventListener) {
          document.addEventListener('DOMContentLoaded', runFunction, false);
        }
        if (document.attachEvent) {
          document.attachEvent('onreadystatechange', runFunction);
        }
        document.onload = runFunction;
      }
    };

    floObject.animation = function (name) {
      if (floObject.animations[name] === undefined) {
        floObject.animations[name] = {};
      }

      var animation = {
        duration: (function (name) {
          return function (time) {
            floObject.animations[name].duration = time;
            return animation;
          };
        })(name),
        nextPosition: (function (name) {
          return function (obj) {
            floObject.animations[name].nextPosition = {};
            for (var key in obj) {
              floObject.animations[name].nextPosition[key] = obj[key];
            }
            return animation;
          };
        })(name),
        previousPosition: (function (name) {
          return function (obj) {
            floObject.animations[name].previousPosition = obj;
            return animation;
          };
        })(name),
        onComplete: (function (name) {
          return function (func) {
            floObject.animations[name].onComplete = func;
            return animation;
          };
        })(name),
        ease: (function (name) {
          return function (easing) {
            floObject.animations[name].ease = easing;
            return animation;
          };
        })(name),
        invert: (function (name) {
          return function () {
            var currentAnimation = floObject.animations[name].nextPosition;
            for (var key in currentAnimation) {
              currentAnimation[key] *= -1;
            }
            return animation;
          };
        })(name),
        clear: (function (name) {
          return function (attr) {
            if (attr !== undefined) {
              floObject.animations[name][attr] = undefined;
            } else {
              floObject.animations[name] = undefined;
            }
            return animation;
          };
        })(name),
        'do': (function (name) {
          return function (newName) {
            if (newName !== undefined) {
              floObject['do'](newName);
            } else {
              floObject['do'](name);
            }
            return animation;
          };
        })(name)
      };

      return animation;
    };

    floObject['do'] = function (name) {
      if (name === undefined) {
        floObject.currentAnimation = undefined;
      } else {
        floObject.startTime = new Date().getTime();
        floObject.currentAnimation = name;
        floObject.duration = floObject.animations[floObject.currentAnimation].duration;

        floObject.previousPosition = (function () {
          var key;
          var newPosition = {};
          var animation = floObject.animations[name];
          if (animation.previousPosition !== undefined) {
            for (key in floObject.position) {
              newPosition[key] = animation.previousPosition[key] !== undefined ? animation.previousPosition[key] : floObject.position[key];
            }
            return newPosition;
          }
          for (key in floObject.position) {
            newPosition[key] = floObject.position[key];
          }
          return newPosition;
        })();
      }
    };

    floObject.animate = function () {
      if (floObject.currentAnimation) {
        var multiplier;
        var progress = Math.min((new Date().getTime() - floObject.startTime) / floObject.duration, 1);
        var animation = floObject.animations[floObject.currentAnimation];

        if (animation.ease === 'in') {
          multiplier = 1 - Math.cos(progress * Math.PI / 2);
        } else if (animation.ease === 'out') {
          multiplier = Math.cos((1 - progress) * Math.PI / 2);
        } else if (animation.ease === 'inout' || animation.ease === 'both') {
          multiplier = (1 - Math.cos(progress * Math.PI)) / 2;
        } else {
          multiplier = progress;
        }

        multiplier = Math.min(Math.max(multiplier, 0), 1);

        for (var key in animation.nextPosition) {
          if (animation.nextPosition[key] !== floObject.previousPosition[key]) {
            floObject.position[key] = animation.nextPosition[key] * multiplier + floObject.previousPosition[key] * (1 - multiplier);
          }
        }

        if (progress === 1) {
          if (typeof animation.onComplete === 'function') {
            animation.onComplete();
          } else if (typeof animation.onComplete === 'string') {
            floObject['do'](animation.onComplete);
          }
        }
      }
    };

    return floObject;
  };

  module.exports = flo;
})();

},{}]},{},[1]);
