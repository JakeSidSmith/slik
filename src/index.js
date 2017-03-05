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

    var animationIndex = 0;

    function getDefault (value, defaultValue) {
      return typeof value === 'undefined' ? defaultValue : value;
    }

    /* @group loop */

    var raf;
    var animations = Immutable.Map();

    function doLoop () {
      var now = performance.now();

      animations.forEach(function (animationLoop) {
        animationLoop(now);
      });

      if (animations.count()) {
        raf = requestAnimationFrame(doLoop);
      }
    }

    function startLoop (animationId, animationLoop) {
      var previousAnimationCount = animations.count();

      if (!animations.has(animationId)) {
        animations = animations.set(animationId, animationLoop);
      }

      if (!previousAnimationCount && animations.count()) {
        raf = requestAnimationFrame(doLoop);
      }
    }

    function stopLoop (animationId) {
      var previousAnimationCount = animations.count();

      if (animations.has(animationId)) {
        animations = animations.delete(animationId);
      }

      if (previousAnimationCount && !animations.count()) {
        cancelAnimationFrame(raf);
      }
    }

    /* @end loop */

    /* @group easing */

    function multiply (fromValue, toValue, multiplier) {
      return fromValue * (1 - multiplier) + toValue * multiplier;
    }

    function Linear (progress) {
      return progress;
    }

    function EaseInOutSine (progress) {
      return (1 - Math.cos(progress * Math.PI)) / 2;
    }

    function EaseInSine (progress) {
      return 1 - Math.cos(progress * Math.PI / 2);
    }

    function EaseOutSine (progress) {
      return Math.sin(progress * Math.PI / 2);
    }

    function Dip (progress) {
      return (progress >= 0.5 ? 1 : 0) + (Math.sin(progress * Math.PI) / 2) * (progress >= 0.5 ? -1 : 1);
    }

    function Spring (progress) {
      return 1 - (Math.cos(progress * progress * Math.PI * 10) * (1 - progress));
    }

    var Easing = {
      Linear: Linear,
      EaseInOutSine: EaseInOutSine,
      EaseInSine: EaseInSine,
      EaseOutSine: EaseOutSine,
      Dip: Dip,
      Spring: Spring
    };

    /* @end easing */

    function Animation (initial) {
      var self = this;

      var startTime, lastTime, pausedAfter;

      var animationId = animationIndex;
      animationIndex += 1;

      var fromValues = Immutable.fromJS(getDefault(initial.from, {}));
      var toValues = Immutable.fromJS(getDefault(initial.to, {}));
      var durationMillis = getDefault(initial.duration, 500);
      var delayMillis = getDefault(initial.delay, 0);
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

      function mapValues (progress, parentPath, now, fromValue, key) {
        var path = parentPath.push(key);

        if (Immutable.Iterable.isIterable(fromValue)) {
          // Ease nested immutable objects
          return fromValue.map(mapValues.bind(null, progress, path, now));
        }

        var toValue = toValues.getIn(path);

        // Only ease values if the toValue exists
        if (typeof toValue !== 'undefined') {
          var multiplier = easing(progress, startTime, now, durationMillis, fromValue, toValue);
          return multiply(fromValue, toValue, multiplier);
        }

        return fromValue;
      }

      function animationLoop (now) {
        var progress = Math.min(Math.max((now - startTime) / durationMillis, 0), 1);

        // Limit frame rate
        if (now - lastTime >= frameRate) {
          if (Immutable.Iterable.isIterable(fromValues)) {
            // Ease immutable objects
            currentValues = fromValues.map(mapValues.bind(null, progress, Immutable.List(), now));
          } else {
            // Ease individual value
            var multiplier = easing(progress, startTime, now, durationMillis, fromValues, toValues);
            currentValues = multiply(fromValues, toValues, multiplier);
          }

          triggerEvent('update');
        }

        lastTime = now;

        if (progress >= 1) {
          if (shouldLoop) {
            startTime = now;
            triggerEvent('loop');
          } else {
            stopLoop(animationId);
            triggerEvent('end');
          }
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

      // Set delay before animation begins
      function delay (input) {
        delayMillis = input;
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

      function mapInvertValues (value) {
        if (Immutable.Iterable.isIterable(value)) {
          return value.map(mapInvertValues);
        }

        return value * -1;
      }

      // Invert animation values
      function invert () {
        if (Immutable.Iterable.isIterable(toValues)) {
          toValues = toValues.map(mapInvertValues);
        } else {
          toValues = mapInvertValues(toValues);
        }

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
        if (typeof pausedAfter !== 'undefined') {
          startTime = performance.now() - pausedAfter;
        } else {
          startTime = performance.now();
        }

        lastTime = startTime;
        pausedAfter = undefined;

        triggerEvent('start');

        startLoop(animationId, animationLoop);

        return self;
      }

      // Stop animation and resume from beginning
      function stop () {
        triggerEvent('stop');
        stopLoop(animationId);
        pausedAfter = undefined;
        startTime = undefined;
        return self;
      }

      // Pause animation and resume from this point
      function pause () {
        triggerEvent('pause');
        stopLoop(animationId);
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

      // Run on start and automatically unbind
      function first (callback) {
        if (typeof callback !== 'function') {
          throw new Error('Callback must be a function, instead got: ' + (typeof callback));
        }

        function firstCallback (result) {
          callback(result);
          unbind('start', firstCallback);
        }

        bind('start', firstCallback);

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
      self.delay = delay;
      self.ease = ease;
      self.loop = loop;
      self.invert = invert;
      self.reverse = reverse;
      self.start = start;
      self.stop = stop;
      self.pause = pause;
      self.bind = self.on = bind;
      self.unbind = self.off = unbind;
      self.first = first;
      self.then = then;
    }

    return {
      Animation: Animation,
      Easing: Easing
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
