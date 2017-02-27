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

  function getSlik (Immutable) {

    function Linear (fromValue, toValue, progress) {

    }

    function Ease (fromValue, toValue, progress) {

    }

    function EaseIn (fromValue, toValue, progress) {

    }

    function EaseOut (fromValue, toValue, progress) {

    }

    function Animation (initial) {
      var self = this;

      var fromValues = Immutable.fromJS(initial);
      var toValues = Immutable.Map();
      var frameRate = 1000 / 30;
      var easing = Linear;
      var shouldLoop = false;

      var events = {
        all: [],
        start: [],
        stop: [],
        pause: [],
        end: [],
        update: [],
        loop: []
      };

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

      // Set easing
      function ease (input) {
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
        return self;
      }

      // Stop animation and resume from beginning
      function stop () {
        return self;
      }

      // Pause animation and resume from this point
      function pause () {
        return self;
      }

      // Manually start the animation / step forward in time
      function update () {
        return self;
      }

      // Add event listener
      function bind (type, callback) {
        if (!(type in events)) {
          throw new Error('Unknown event: ' + type);
        }

        if (typeof callback !== 'function') {
          throw new Error('Callback must be a function, instead got: ' + (typeof callback));
        }

        var index = events[type].indexOf(callback);

        if (index < 0) {
          events[type].push(callback);
        }

        return self;
      }

      // Remove event listener
      function unbind (type, callback) {
        if (!(type in events)) {
          throw new Error('Unknown event: ' + type);
        }

        if (typeof callback !== 'function') {
          throw new Error('Callback must be a function, instead got: ' + (typeof callback));
        }

        var index = events[type].indexOf(callback);

        if (index >= 0) {
          events[type].splice(index, 1);
        }

        return self;
      }

      // Run on complete, automatically unbind
      function then () {
        return self;
      }

      self.fps = self.frameRate = fps;
      self.from = from;
      self.to = to;
      self.ease = ease;
      self.loop = loop;
      self.invert = invert;
      self.reverse = reverse;
      self.start = start;
      self.stop = self.reset = stop;
      self.pause = pause;
      self.update = update;
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
