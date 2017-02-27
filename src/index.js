'use strict';

(function () {

  function setupRequestAnimationFrame () {
    var lastTime = 0;
    var vendors = ['webkit', 'moz', 'ms', 'o'];

    for (var i = 0; !window.requestAnimationFrame && i < vendors.length; i += 1) {
      var vendor = vendors[i];
      window.requestAnimationFrame = window[vendor + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendor + 'CancelAnimationFrame'] ||
        window[vendor + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = function (callback) {
        var now = new Date().getTime();
        var nextTime = Math.max(0, 16 - (now - lastTime));

        var id = window.setTimeout(function () {
          callback(now + nextTime);
        }, nextTime);

        lastTime = now + nextTime;
        return id;
      };
    }

    if (!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function (id) {
        clearTimeout(id);
      };
    }
  }

  setupRequestAnimationFrame();

  function setupPerformanceNow () {
    if (!('performance' in window)) {
      window.performance = {};
    }

    if (!('now' in window.performance)) {
      var dateNow = Date.now || function () {
        return new Date().getTime();
      };

      var nowOffset = dateNow();

      if (performance.timing && performance.timing.navigationStart) {
        nowOffset = performance.timing.navigationStart;
      }

      window.performance.now = function now () {
        return dateNow() - nowOffset;
      };
    }
  }

  setupPerformanceNow();

  function getSlik (Immutable) {

    function multiply (fromValue, toValue, multiplier) {
      return fromValue * (1 - multiplier) + toValue * multiplier;
    }

    function Linear (fromValue, toValue, progress) {
      var multiplier = progress;
      return multiply(fromValue, toValue, multiplier);
    }

    function Ease (fromValue, toValue, progress) {
      var multiplier = (1 - Math.cos(progress * Math.PI)) / 2;
      return multiply(fromValue, toValue, multiplier);
    }

    function EaseIn (fromValue, toValue, progress) {
      var multiplier = (1 - Math.cos(progress * Math.PI / 2));
      return multiply(fromValue, toValue, multiplier);
    }

    function EaseOut (fromValue, toValue, progress) {
      var multiplier = Math.cos((1 - progress) * Math.PI / 2);
      return multiply(fromValue, toValue, multiplier);
    }

    function getDefault (value, defaultValue) {
      return typeof value === 'undefined' ? defaultValue : value;
    }

    function Animation (initial) {
      var self = this;

      var raf, startTime, lastTime, pausedAfter;

      var fromValues = Immutable.fromJS(getDefault(initial.from, {}));
      var toValues = Immutable.Map(getDefault(initial.to, {}));
      var durationMillis = getDefault(initial.duration, 500);
      var frameRate = 1000 / getDefault(initial.fps, 120);
      var easing = getDefault(initial.ease, Linear);
      var shouldLoop = getDefault(initial.loop, false);

      var currentValues = fromValues;

      var events = Immutable.Map({
        all: Immutable.List(),
        start: Immutable.List(),
        stop: Immutable.List(),
        pause: Immutable.List(),
        end: Immutable.List(),
        update: Immutable.List(),
        loop: Immutable.List()
      });

      function triggerEvent (type) {
        events.get(type, Immutable.List()).forEach(function (callback) {
          callback(currentValues);
        });

        events.get('all', Immutable.List()).forEach(function (callback) {
          callback(currentValues);
        });
      }

      function easeValues () {
        cancelAnimationFrame(raf);

        var now = performance.now();
        var progress = Math.min(Math.max((now - startTime) / durationMillis, 0), 1);

        // Limit frame rate
        if (now - lastTime >= frameRate) {
          function mapValues (fromValue, key) {
            if (Immutable.Iterable.isIterable(fromValue)) {
              // Ease nested immutable objects
              return fromValue.map(mapValues);
            }

            var toValue = toValues.get(key);

            // Only ease values if the toValue exists
            if (typeof toValue !== 'undefined') {
              return easing(fromValue, toValue, progress);
            }

            return fromValue;
          }

          if (Immutable.Iterable.isIterable(fromValues)) {
            // Ease immutable objects
            currentValues = fromValues.map(mapValues);
          } else {
            // Ease individual value
            currentValues = easing(fromValues, toValues, progress);
          }

          triggerEvent('update');
        }

        lastTime = now;

        if (progress >= 1) {
          if (shouldLoop) {
            startTime = now;
            triggerEvent('loop');
            raf = requestAnimationFrame(easeValues);
          } else {
            cancelAnimationFrame(raf);
            triggerEvent('end');
          }
        } else {
          raf = requestAnimationFrame(easeValues);
        }
      }

      // Set the frameRate
      function fps (input) {
        frameRate = 1000 / input;
        return self;
      }

      // Set from values
      function from (input) {
        fromValues = Immutable.fromJS(input);
        return self;
      }

      // Set to values
      function to (input) {
        toValues = Immutable.fromJS(input);
        return self;
      }

      // Set animation duration
      function duration (input) {
        durationMillis = input;
        return self;
      }

      // Set easing
      function ease (input) {
        if (typeof input !== 'function') {
          throw new Error('Ease must be a function, instead got: ' + (typeof input));
        }

        easing = input;
        return self;
      }

      // Set whether the animation should loop
      function loop (input) {
        shouldLoop = input;
        return self;
      }

      // Invert animation values
      function invert () {
        return self;
      }

      // Play animation in reverse
      function reverse () {
        var temp = fromValues;
        fromValues = toValues;
        toValues = temp;
        return self;
      }

      // Start or resume animation
      function start () {
        cancelAnimationFrame(raf);

        if (typeof pausedAfter !== 'undefined') {
          startTime = performance.now() - pausedAfter;
        } else {
          startTime = performance.now();
        }

        lastTime = startTime;
        pausedAfter = undefined;

        triggerEvent('start');

        raf = requestAnimationFrame(easeValues);

        return self;
      }

      // Stop animation and resume from beginning
      function stop () {
        triggerEvent('stop');
        cancelAnimationFrame(raf);
        pausedAfter = undefined;
        startTime = undefined;
        return self;
      }

      // Pause animation and resume from this point
      function pause () {
        triggerEvent('pause');
        cancelAnimationFrame(raf);
        pausedAfter = startTime - performance.now();
        startTime = undefined;
        return self;
      }

      // Add event listener
      function bind (type, callback) {
        if (!events.has(type)) {
          throw new Error('Unknown event: ' + type);
        }

        if (typeof callback !== 'function') {
          throw new Error('Callback must be a function, instead got: ' + (typeof callback));
        }

        var eventsOfType = events.get(type, Immutable.List());

        if (!eventsOfType.includes(callback)) {
          events = events.set(type, eventsOfType.push(callback));
        }

        return self;
      }

      // Remove event listener
      function unbind (type, callback) {
        if (!events.has(type)) {
          throw new Error('Unknown event: ' + type);
        }

        if (typeof callback !== 'function') {
          throw new Error('Callback must be a function, instead got: ' + (typeof callback));
        }

        var eventsOfType = events.get(type, Immutable.List());

        if (eventsOfType.includes(callback)) {
          events = events.set(type, eventsOfType.delete(eventsOfType.indexOf(callback)));
        }

        return self;
      }

      // Run on complete and automatically unbind
      function then (callback) {
        if (typeof callback !== 'function') {
          throw new Error('Callback must be a function, instead got: ' + (typeof callback));
        }

        function thenCallback (result) {
          callback(result);
          unbind('end', thenCallback);
        }

        bind('end', thenCallback);

        return self;
      }

      self.fps = fps;
      self.from = from;
      self.to = to;
      self.duration = duration;
      self.ease = ease;
      self.loop = loop;
      self.invert = invert;
      self.reverse = reverse;
      self.start = start;
      self.stop = self.reset = stop;
      self.pause = pause;
      self.bind = self.on = bind;
      self.unbind = self.off = unbind;
      self.then = then;
    }

    return {
      Animation: Animation,
      Easing: {
        Linear: Linear,
        Ease: Ease,
        EaseIn: EaseIn,
        EaseOut: EaseOut
      }
    };

  }

  // Export for commonjs / browserify
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = getSlik(require('immutable')); // eslint-disable-line no-undef
  // Export for amd / require
  } else if (typeof define === 'function' && define.amd) { // eslint-disable-line no-undef
    define(['immutable'], function (Immutable) { // eslint-disable-line no-undef
      return getSlik(Immutable);
    });
  // Export globally
  } else {
    var root;

    if (typeof window !== 'undefined') {
      root = window;
    } else if (typeof global !== 'undefined') {
      root = global; // eslint-disable-line no-undef
    } else if (typeof self !== 'undefined') {
      root = self; // eslint-disable-line no-undef
    } else {
      root = this;
    }

    root.Slik = getSlik(root.Immutable);
  }

})();
