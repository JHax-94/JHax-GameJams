function Wall(x, y, w, h)
{
    var options = {
        friction: 0,
        frictionStatic: 0,        
        restitution: 1,
        isStatic: true
    }
    this.body = Bodies.rectangle(x, y, w, h, options);
    this.width = w;
    this.height = h;

    World.add(world, this.body);    
}