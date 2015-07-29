# Flo-js

__Animation library for use with HTML5 canvas__

## Setup

### Installation

1. Use npm or bower to install flo-js.

    1. Using npm

            npm install flo-js --save

        I'd recommend pinning to a specific version and using `--save` to add this to your package.json automatically.

    1. Using bower

            bower install flo-js -S

        I'd recommend pinning to a specific version and using `-S` to add this to your bower.json automatically.

1. Require flo-js in your main HTML / template file.

        var flo = require('flo-js');

### Getting started

1. Setup an object containing the positions you want to animate. These values can be contained in arrays but I'd highly recommend using objects as it makes it easier to refer to your values later.

        var myPosition = {
            headRotation: 0,
            leftArmRotation: 0,
            rightArmRotation: 0,
            leftLegRotation: 0,
            rightLegRotation: 0
        };

1. Create a flo object. You'll be passing the position-object you want to animate here. You can create as many flo objects as you like (preferably for entirely different animation groups).

        var myFlo = flo(myPosition);

1. Add some animations to your flo objects (this is where it gets a bit more complicated). You'll first want to name an animation. In this example we'll do a multi-step walking animation.

        myFlo.animation('rightLegForward')

    Animation names must not contain special characters or spaces, and should be camelcase.

1. Start adjusting the properties of this animation. There's a full list of methods below.

        myFlo.animation('rightLegForward')
            .duration(500)
            .nextPosition({
                rightLegRotation: 45
            })
            .onComplete('leftLegForward')
            .do(); // Trigger animation

#### Animation Properties

1. Duration - In milliseconds.

        myFlo.animation('rightLegForward')
            .duration(500)

1. Next position - object containing the values you want to animate to.

        .nextPosition({
            rightLegRotation: 45
        })

    **Note: you don't have to animate every value.**

1. Previous position - you can manually set the position at the start of the animation. This is especially useful when animating full rotations. This example would be suitable for having a character perform a flip without ending up rotated 360 degrees.

        .previousPosition({
            bodyRotation: -360
        })

    **Note: you don't have to animate every value.**

1. On complete - action to perform once animation completes. onComplete can take a string (the name of the next animation to perform) or a function (which you may want to trigger the next animation in also).

        .onComplete('leftLegForward')

1. Ease - define the easing of the animation. In, out, both (inout) or none (linear). The default easing is none.

        .ease('in')

1. Invert - invert an animation's values at any point

        .invert()

1. Clear - used to clear an entire animation, or a specific property of an animation if one is specified.

        .clear('duration');

1. Do - trigger an animation. This can be called on an individual animation or directly on your flo object and specifying the name of the animation to trigger.

        // On flo object
        myFlo.do('rightLegForward');

        // On animation
        myFlo.animation('rightLegForward').do();

        // Trigger separate animation from animation
        myFlo.animation('rightLegForward').do('leftLegForward');
