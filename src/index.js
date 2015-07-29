'use strict';

(function () {

  var slik = function (position) {

    var slikObject = {
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

    slikObject.animation = function (name) {
      if (slikObject.animations[name] === undefined) {
        slikObject.animations[name] = {};
      }

      var animation = {
        duration: (function (name) {
          return function (time) {
            slikObject.animations[name].duration = time;
            return animation;
          };
        })(name),
        nextPosition: (function (name) {
          return function (obj) {
            slikObject.animations[name].nextPosition = {};
            for (var key in obj) {
              slikObject.animations[name].nextPosition[key] = obj[key];
            }
            return animation;
          };
        })(name),
        previousPosition: (function (name) {
          return function (obj) {
            slikObject.animations[name].previousPosition = obj;
            return animation;
          };
        })(name),
        onComplete: (function (name) {
          return function (func) {
            slikObject.animations[name].onComplete = func;
            return animation;
          };
        })(name),
        ease: (function (name) {
          return function (easing) {
            slikObject.animations[name].ease = easing;
            return animation;
          };
        })(name),
        invert: (function (name) {
          return function () {
            var currentAnimation = slikObject.animations[name].nextPosition;
            for (var key in currentAnimation) {
              currentAnimation[key] *= -1;
            }
            return animation;
          };
        })(name),
        clear: (function (name) {
          return function (attr) {
            if (attr !== undefined) {
              slikObject.animations[name][attr] = undefined;
            } else {
              slikObject.animations[name] = undefined;
            }
            return animation;
          };
        })(name),
        do: (function (name) {
          return function (newName) {
            if (newName !== undefined) {
              slikObject.do(newName);
            } else {
              slikObject.do(name);
            }
            return animation;
          };
        })(name)
      };

      return animation;
    };

    slikObject.do = function (name) {
      if (name === undefined) {
        slikObject.currentAnimation = undefined;
      } else {
        slikObject.startTime = new Date().getTime();
        slikObject.currentAnimation = name;
        slikObject.duration = slikObject.animations[slikObject.currentAnimation].duration;

        slikObject.previousPosition = (function () {
          var key;
          var newPosition = {};
          var animation = slikObject.animations[name];
          if (animation.previousPosition !== undefined) {
            for (key in slikObject.position) {
              newPosition[key] = animation.previousPosition[key] !== undefined ?
                animation.previousPosition[key] : slikObject.position[key];
            }
            return newPosition;
          }
          for (key in slikObject.position) {
            newPosition[key] = slikObject.position[key];
          }
          return newPosition;
        })();
      }
    };

    slikObject.animate = function () {
      if (slikObject.currentAnimation) {
        var multiplier;
        var progress = Math.min(
          (new Date().getTime() - slikObject.startTime) / slikObject.duration,
          1
        );
        var animation = slikObject.animations[slikObject.currentAnimation];

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
          if (animation.nextPosition[key] !== slikObject.previousPosition[key]) {
            slikObject.position[key] = animation.nextPosition[key] * multiplier +
              slikObject.previousPosition[key] * (1 - multiplier);
          }
        }

        if (progress === 1) {
          if (typeof animation.onComplete === 'function') {
            animation.onComplete();
          } else if (typeof animation.onComplete === 'string') {
            slikObject.do(animation.onComplete);
          }
        }
      }
    };

    return slikObject;
  };

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this || window;

  // Export for commonjs / browserify
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = slik;
    }
    exports.Reorderable = slik;
  } else if (typeof root !== 'undefined') {
    // Add to root object
    root.Reorderable = slik;
  }

  // Define for requirejs
  if (root && typeof root.define === 'function' && root.define.amd) {
    root.define(function() {
      return slik;
    });
  }

})();
