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

  floObject.addAnimation = function (name, nextPosition, previousPosition, onComplete) {
    floObject.aniimations[name] = {};
    floObject.aniimations[name].nextPosition = nextPosition;
    floObject.aniimations[name].previousPosition = function () {
      var position = {};
      if (previousPosition) {
        for (key in floObject.position) {
          position[key] = previousPosition[key] || position[key];
        }
        return position;
      }
      for (key in floObject.position) {
        position[key] = position[key];
      }
      return position;
    };
    floObject.onComplete = onComplete;
  };

  floObject.doAnimation = function (name, duration) {
    floObject.duration = duration;
    floObject.currentAnimation = name;
  };

  floObject.animate = function () {
    if (floObject.currentAnimation) {

    }
  };

  return floObject;

};
