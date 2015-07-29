# Slik

__Animation library for use with HTML5 canvas__

## Setup

### Installation

1. Use npm or bower to install slik.

    1. Using npm

            npm install slik --save

        I'd recommend pinning to a specific version and using `--save` to add this to your package.json automatically.

    1. Using bower

            bower install slik -S

        I'd recommend pinning to a specific version and using `-S` to add this to your bower.json automatically.

1. Require slik in your main HTML / template file.

        var slik = require('slik');

### Getting started

1. Setup an object containing the positions you want to animate. These values can be contained in arrays but I'd highly recommend using objects as it makes it easier to refer to your values later.

        var myPosition = {
            headRotation: 0,
            leftArmRotation: 0,
            rightArmRotation: 0,
            leftLegRotation: 0,
            rightLegRotation: 0
        };

1. Create a slik object. You'll be passing the position-object you want to animate here. You can create as many slik objects as you like (preferably for entirely different animation groups).

        var mySlik = slik(myPosition);

1. Add some animations to your slik objects (this is where it gets a bit more complicated). You'll first want to name an animation. In this example we'll do a multi-step walking animation.

        mySlik.animation('rightLegForward')

    Animation names must not contain special characters or spaces, and should be camelcase.

1. Start adjusting the properties of this animation. There's a full list of methods below.

        mySlik.animation('rightLegForward')
            .duration(500)
            .nextPosition({
                rightLegRotation: 45
            })
            .onComplete('leftLegForward')
            .do(); // Trigger animation

#### Animation Properties

1. Duration - In milliseconds.

        mySlik.animation('rightLegForward')
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

1. Do - trigger an animation. This can be called on an individual animation or directly on your slik object and specifying the name of the animation to trigger.

        // On slik object
        mySlik.do('rightLegForward');

        // On animation
        mySlik.animation('rightLegForward').do();

        // Trigger separate animation from animation
        mySlik.animation('rightLegForward').do('leftLegForward');
