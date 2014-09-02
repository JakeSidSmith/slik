'use strict';

(function () {

  var hasChildren = function (obj) {
    return typeof obj === 'object';
  };

  var deepCopy = function (obj) {
    var newObj = {};
    for (var key in obj) {
      if (hasChildren(obj[key])) {
        newObj[key] = deepCopy(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }
    return newObj;
  };

  var deepInvert = function (obj) {
    var newObj = {};
    for (var key in obj) {
      if (hasChildren(obj[key])) {
        newObj[key] = deepInvert(obj[key]);
      } else {
        newObj[key] = obj[key] * -1;
      }
    }
    return newObj;
  };

  var deepFillGaps = function (filler, base) {
    var newObj = {};
    for (var key in base) {
      if (hasChildren(base[key])) {
        newObj[key] = deepFillGaps(filler[key], base[key]);
      } else {
        newObj[key] = filler[key] !== undefined ? filler[key] : base[key];
      }
    }
    return newObj;
  };

  var deepLoopTransform = function (base, mult) {
    return function (next, prev) {
      for (var key in next) {
        if (hasChildren(next[key])) {
          base[key] = deepLoopTransform(base[key], mult)(next[key], prev[key]);
        } else {
          if (next[key] === prev[key]) {
            base[key] = next[key];
          } else {
            base[key] = next[key] * mult + prev[key] * (1 - mult);
          }
        }
      }
      return base;
    };
  };

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
        animation: (function (name) {
          return function (animName) {
            if (animName !== undefined) {
              return floObject.animation(animName);
            }
            return floObject.animation(name);
          };
        })(name),
        duration: (function (name) {
          return function (time) {
            floObject.animations[name].duration = time;
            return animation;
          };
        })(name),
        nextPosition: (function (name) {
          return function (obj) {
            floObject.animations[name].nextPosition = deepCopy(obj);
            return animation;
          };
        })(name),
        previousPosition: (function (name) {
          return function (obj) {
            floObject.animations[name].previousPosition = deepCopy(obj);
            return animation;
          };
        })(name),
        onComplete: (function (name) {
          return function (func, delay) {
            floObject.animations[name].onComplete = func;
            floObject.animations[name].delay = delay || 0;
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
            floObject.animations[name].nextPosition = deepInvert(floObject.animations[name].nextPosition);
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
          var animation = floObject.animations[name];
          if (animation.previousPosition !== undefined) {
            return deepFillGaps(animation.previousPosition, floObject.position);
          }
          return deepCopy(floObject.position);
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
        var bakedDeepLoopTransform = deepLoopTransform(floObject.position, multiplier);

        bakedDeepLoopTransform(animation.nextPosition, floObject.previousPosition);

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
