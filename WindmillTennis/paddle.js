function Paddle(x, y, w, h, setSpeed, label) {
    console.log("Box constructed");
    var options = {
        friction: 1,
        restitution: 1,
        density: 1,
        label: label  
    };
    
    this.baseX = x;

    this.moveSpeed = setSpeed;

    var anchorX;
    if(x < width / 2)
    {
        anchorX = x- 20;
    }
    else
    {
        anchorX = x + 20;
    }

    this.body = Bodies.rectangle(x, y, w, h, options);
    
    this.width = w;
    this.height = h;

    this.upPressed = false;
    this.downPressed = false;
    
    this.rotateAntiClock = false;
    this.rotateClock = false;

    console.log("Adding box...");
    console.log(this.body);
    
    World.add(world, [this.body] );
    renderers.push(this);
    updatables.push(this);

    this.update = function(deltaTime) {

        if(this.upPressed)
        {   
            Body.setVelocity(this.body, { x: 0, y: -this.moveSpeed });
        }
        else if(this.downPressed)
        {
            Body.setVelocity(this.body, { x:0 , y: this.moveSpeed });
        }
        else
        {
            Body.setVelocity(this.body, { x:0, y: 0 });
        }

        if(this.rotateClock)
        {
            Body.setAngularVelocity(this.body, 0.1);
        }
        else if(this.rotateAntiClock)
        {
            Body.setAngularVelocity(this.body, -0.1);
        }
        else
        {
            Body.setAngularVelocity(this.body, 0);
        }
        
        if(abs(this.body.position.x - this.baseX) > Number.EPSILON)
        {
            Body.setVelocity(this.body, { x: this.baseX - this.body.position.x, y: this.body.velocity.y });            
        }
    }
    
    this.show = function() {
        var pos = this.body.position;
        var angle = this.body.angle;
        
        push();
        translate(pos.x, pos.y);
        rotate(angle);
        rectMode(CENTER);
        rect(0, 0, this.width, this.height);
        pop();
        
    }
}