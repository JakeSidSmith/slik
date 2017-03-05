# Slik [![CircleCI](https://circleci.com/gh/JakeSidSmith/slik.svg?style=svg)](https://circleci.com/gh/JakeSidSmith/slik)

**Animation / tweening library, ideal for use with HTML5 canvas and or React** - [Demo](http://jakesidsmith.github.io/slik/)

## About

Slik uses requestAnimationFrame to tween values over time. You can give it a single value, an array, or an object. Internally Slik converts these values to [ImmutableJS](https://facebook.github.io/immutable-js/) ones, and returns the tweened values as ImmutableJS objects (unless only a single value is supplied).


Slik uses ImmutableJS so that when used with [React](https://facebook.github.io/react/) you can keep your components pure (preventing updates if values have not changed) as ImmutableJS returns a new reference when updated, allowing quick checks for changes using [PureRenderMixin](https://facebook.github.io/react/docs/pure-render-mixin.html) for example.

## Installation

Use npm to install slik.

```shell
npm install slik --save --save-exact
```

I'd recommend pinning to a specific version and using `--save-exact` and `--save` to add this to your package.json automatically.

## Getting started

1. Require slik in the file where you'll be animating.

  ```javascript
  import Slik from 'slik';
  ```

1. Setup an object containing the positions you want to animate. These values can be contained in objects, arrays, or single values. If you're animating a lot of values I'd highly recommend using objects as it makes it easier to refer to your values later.

  Note: these can be nested values.

  ```javascript
  const initialValues = {
    headRotation: 0,
    leftArm: {
      upper: 0,
      lower: 0
    }
  };
  ```

1. Create an Animation.

  1. Initial options: You can pass most of your config in here if you like, or add them using the methods with matching names.

    ```javascript
    const animation = new Slik.Animation({
      from: initialValues,
      to: nextValues
      // Defaults below

      // duration: 500 (milliseconds)
      // delay: 0 (milliseconds)
      // fps: 120 (frames per second) I would not recommend changing the frame rate
      // ease: Slik.Easing.Linear
      // loop: false
    });
    ```

  1. Using methods: Note: fluent API returns the same object for each method (except the playing method which returns a boolean). More info below.

    ```javascript
    const animation = new Slik.Animation()
      .from(initialValues)
      .to(nextValues)
      .duration(1000)
      .delay(2000)
      .ease(Slik.Easing.EaseInOutSine)
      .loop(true)
    ```

1. Handle changes in values. Bind a callback to the `update` event & update your component or redraw your canvas.

  ```javascript
  animation.bind('update', function (value) {
    canvas.render(values);
  });
  ```

## Animation methods

1. Set the values to tween from. Default: `Immutable.Map()`.

  ```javascript
  animation.from({hello: 0});
  ```

1. Set the values to tween to. Default: `Immutable.Map()`.

  ```javascript
  animation.to({hello: 1});
  ```

1. Set the duration of the animation in milliseconds. Default: `500`.

  ```javascript
  animation.duration(500);
  ```

1. Set a delay in milliseconds before the animation begins. Default: `0`.

  ```javascript
  animation.delay(1000);
  ```

1. Set the frame rate of the animation (fps). Default: `120`.
  I would not recommend changing this unless you intentionally want a less smooth animation.

  ```javascript
  animation.fps(120);
  ```

1. Set the easing function to use for the animation. Default: `Slik.Easing.Linear`.
  Note: you can easily create your own easing functions. More info on this below.

  ```javascript
  animation.ease(Slik.Easing.Linear);
  ```

1. Set whether the animation should automatically loop. Default: `false`.

  ```javascript
  animation.loop(false);
  ```

1. Invert the values that you are tweening to. E.g. `{value: 1}` would become `{value: -1}`

  ```javascript
  animation.invert();
  ```

1. Swap the from & to values to play in reverse.

  ```javascript
  animation.reverse();
  ```

1. Start the animation.

  ```javascript
  animation.start();
  ```

1. Stop the animation, allowing you to restart from the beginning.

  ```javascript
  animation.stop();
  ```

1. Pause the animation, allowing you to resume from this point.

  ```javascript
  animation.pause();
  ```

1. Return whether the animation is currently playing.

  ```javascript
  animation.playing();
  ```

1. Run a callback once before the animation is initially started. Receives the animation's current values.

  ```javascript
  animation.first(function () {});
  ```

1. Run a callback once after the animation has completed (excluding loops). Receives the animation's current values.

  ```javascript
  animation.then(function () {});
  ```

1. Bind a callback to a specific animation event (or all events). Alias: `on`
  More info on events below.

  ```javascript
  animation.bind('type', function () {});
  ```

1. Unbind a callback from a specific animation event (or events). Alias: `off`
  More info on events below.

  ```javascript
  animation.unbind('type', function () {});
  ```

## Events

All events are called with the current values. These may be the initial values or next values if the animation has only just begun, or has ended.

* all - called any time another event is triggered
* start - called when an animation is started
* stop - celled when an animation is stopped
* pause - called when an animation is paused
* end - called when an animation completes (excluding loops)
* update - called every frame an animation updates
* loop - called every time an animation loops (if looping)
