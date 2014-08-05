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
  {
    name: 'animation1',
    nextPosition: {

    },
    previousPosition: {

    },
    duration: 500,
    ease: 'both', // in, out, both, dip
    onComplete: 'nextAnimation' || function () {

    },
    invert: function () {
      return xVelocity < 0;
    },
  }
);

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

person.flo.reverse('animation1');

person.flo.invert('animation1');
