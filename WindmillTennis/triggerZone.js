TriggerZone = function(x, y, w, h, label) {
    options = {
        isStatic: true,
        isSensor: true,
        label: label
    };

    this.body = Bodies.rectangle(x, y, w, h, options);
    this.width = w;
    this.height = h;

    this.body.collisionExit = function(collisionBody)
    {
        if(collisionBody.name === "ball")
        {
            console.log("Ball left collision zone!");
        }
    }

    World.add(world, this.body);    
};