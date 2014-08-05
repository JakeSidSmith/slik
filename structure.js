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

person.flo.add(
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

person.flo.add('animation2')
  .duration(500)
  .nextPosition({})
  .ease('dip');

person.flo.nextPosition('animation1', {});
person.flo.duration('animation1', 250);
person.flo.ease('animation1', 'both');
person.flo.onComplete('animation1', 'animation2');
person.flo.invert('animation1');
person.flo.reverse('animation1');


person.flo.do(
  'animation1',
  {
    reverse: true,
    invert: function () {
      return xVelocity < 0;
    },
  }
);

person.flo.edit(
  'animation1',
  {
    duration: 1000,
    nextPosition: {

    }
  }
);
