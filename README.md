# Flo-js v 0.0.0

__Animation library for use with HTML5 canvas__

## Setup

### Installation

1. Use bower to import flo-js into your project, or manually download and copy flo.js to your desired location.

        bower install flo-js#1.0.0 -S

    I'd recommend pinning to a specific version and using `-S` to add this to your bower.json automatically.

2. Link to flo.js in your main HTML / template file.

        <script type="text/javascript" src="bower_components/flo-js/flo.js"></script>

    Replace `bower_components/flo-js/flo.js` with the appropriate link to flo.js.

### Getting started

1. Setup an object containing the positions you want to animate. These values can be nested, and can be contained in arrays but I'd highly recommend using objects as it makes it easier to refer to your values later.

        var myPosition = {
            headRotation: 0,
            leftArmRotation: 0,
            rightArmRotation: 0,
            leftLegRotation: 0,
            rightLegRotation: 0
        };

2. Create a flo object. You'll be passing the position-object you want to animate here. You can create as many flo objects as you like (preferably for entirely different animation groups).

        var myFlo = flo(myPosition);

3. Add some animations to your flo objects (this is where it gets a bit more complicated). You'll first want to name an animation. In this example we'll do a multi-step walking animation.

        myFlo.animation('rightLegForward')

    Animation names must not contain special characters or spaces, and should be camelcase.

4. Start adjusting the properties of this animation. There's a full list of methods below.

        myFlo.animation('rightLegForward')
            .duration(500)
            .nextPosition({
                rightLegRotation: 45
            })
            .onComplete('leftLegForward')
            .do(); // Trigger animation

