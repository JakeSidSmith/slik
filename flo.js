'user strict';

var flo = function (canvas, position) {

  var floObject = {
    animations: {},
    requestAnimationFrame: function (func) {
      var requestAnimationFrame = window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.msRequestAnimationFrame;
      requestAnimationFrame(func);
    },
    isFullscreen: function () {
      return document.fullscreenElement ||
        document.msFullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement;
    },
    enterFullscreen: function (element) {
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
    exitFullscreen: function () {
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
    onDocumentReady: function (func) {
      var domContentLoaded = false;
      var runFunction = function () {
        if (!domContentLoaded) {
          domContentLoaded = true;
          func();
        }
      };
      if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", runFunction, false);
      }
      if (document.attachEvent) {
        document.attachEvent("onreadystatechange", runFunction);
      }
      document.onload = runFunction;
    }
  };

  floObject.position = position;
  floObject.canvas = canvas;

  floObject.addAnimation = function (name, duration, nextPosition, previousPosition, onComplete) {
    floObject.animations[name] = {};
    floObject.animations[name].duration = duration;
    floObject.animations[name].nextPosition = nextPosition;
    floObject.animations[name].previousPosition = previousPosition;
    floObject.animations[name].onComplete = onComplete;
  };

  floObject.doAnimation = function (name, duration, onComplete) {
    if (name === undefined) {
      floObject.currentAnimation === undefined;
    } else {
      floObject.startTime = new Date().getTime();
      floObject.currentAnimation = name;
      floObject.duration = duration || floObject.animations[name] ? floObject.animations[name].duration : undefined;
      floObject.animations[name].onComplete = onComplete || floObject.animations[name] ? floObject.animations[name].onComplete : undefined;

      floObject.previousPosition = function () {
        var newPosition = {};
        var animation = floObject.animations[name];
        if (animation.previousPosition) {
          for (key in floObject.position) {
            newPosition[key] = animation.previousPosition[key] ? animation.previousPosition[key] : floObject.position[key];
          }
          return newPosition;
        }
        for (key in floObject.position) {
          newPosition[key] = floObject.position[key];
        }
        return newPosition;
      }();
    }
  };

  floObject.animate = function () {
    var multiplier = Math.min((new Date().getTime() - floObject.startTime) / floObject.duration, 1);

    if (floObject.currentAnimation) {
      var animation = floObject.animations[floObject.currentAnimation];

      for (key in animation.nextPosition) {
        floObject.position[key] = animation.nextPosition[key] * multiplier + floObject.previousPosition[key] * (1 - multiplier);
      }

      if (multiplier === 1) {
        floObject.doAnimation(animation.onComplete);
      }
    }
  };

  return floObject;

};
