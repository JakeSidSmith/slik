'use strict';

(function () {

  var flo = function (position) {

    var floObject = {
      position: position,
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
        do: (function (name) {
          return function (newName) {
            if (newName !== undefined) {
              floObject.do(newName);
            } else {
              floObject.do(name);
            }
            return animation;
          };
        })(name)
      };

      return animation;
    };

    floObject.do = function (name) {
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
          multiplier = (1 - Math.cos(progress * Math.PI / 2));
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
            floObject.do(animation.onComplete);
          }
        }
      }
    };

    return floObject;
  };

  window.flo = flo;

})();
