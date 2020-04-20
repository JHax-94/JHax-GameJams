class Sprite
{
    constructor(animation, speed, targetScreen, drawOffset, name)
    {
        this.name = "";
        if(name)
        {
            this.name = name;
        }
        
        this.drawOffset = drawOffset;
        this.animation = animation;
        this.len = animation.length;
        this.speed = speed;
        this.index = 0;
        this.hasDims = false;

        this.flip = false;

        this.dims;

        this.addToLists(targetScreen);

        this.paused = false;

        this.pos = { x: 0, y: 0 };
    }   

    addToLists(targetScreen)
    {
        screens[targetScreen].animationsList.push(this);
    }

    setDims(dims)
    {
        this.dims = dims;
        this.hasDims = true;
    }

    setAnimation(newAnimation)
    {
        console.log("Set new animation");
        console.log(newAnimation);
        this.animation = newAnimation.frames;
        this.drawOffset = newAnimation.offset;
    }

    pause()
    {
        this.paused = true;
    }   

    drawAt(pos)
    {
        imageMode(CENTER);
        var showIndex = mod(floor(this.index), this.len);
        var scaleMod = 1;
        if(this.flip)
        {
            scaleMod = -1;
            scale(1/scaleMod, 1);
        }
        
        if(this.hasDims)
        {
            imageMode(CENTER);
            image(this.animation[showIndex], scaleMod * (pos.x + scaleMod * this.drawOffset.x), (pos.y + this.drawOffset.y), this.dims.w, this.dims.h);
        }
        else
        {   
            imageMode(CENTER);
            image(this.animation[showIndex], scaleMod * (pos.x + scaleMod * this.drawOffset.x), (pos.y + this.drawOffset.y));
        }

        if(this.flip)
        {
            scale(scaleMod, 1);
        }
    }

    animate() 
    {
        if(!this.paused) this.index += this.speed;
    }
}