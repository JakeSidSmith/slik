var person = {
  position: {
    upperBody: {
      body: 0,
      head: 0,
      amrR: 0,
      armL: 0
    },
    lowerBody: {
      legR: 0,
      legL: 0
    }
  }
};

person.flo = flo(person.position);

// Add animation or set an animation's properties
person.flo.set(
  'animation1',
  {
    nextPosition: {

    },
    previousPosition: {

    },
    duration: 500,
    ease: 'both', // in, out, both, dip
    /*
      Use Math.cos & Math.sin for easing
    */
    onComplete: 'nextAnimation' || function () {

    },
    invert: function () {
      return xVelocity < 0;
    },
  }
);

person.flo.set('animation2')
  .duration(500)
  .nextPosition({})
  .ease('dip');

person.flo.nextPosition('animation1', {});
person.flo.duration('animation1', 250);
person.flo.ease('animation1', 'both');
person.flo.onComplete('animation1', 'animation2');
person.flo.invert('animation1');
person.flo.reverse('animation1');

// Remove animation
person.flo.clear('animation3');
// Remove property of animation
person.flo.clear('animation1', 'onComplete');

// Do animation
person.flo.do('animation1');
// Do animation and adjust properties
person.flo.do(
  'animation1',
  {
    reverse: true,
    invert: function () {
      return xVelocity < 0;
    },
  }
);
