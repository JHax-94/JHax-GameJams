class Sprite
{
    constructor(animation, speed)
    {
        this.animation = animation;
        this.len = animation.length;
        this.speed = speed;
        this.index = 0;
        this.hasDims = false;

        this.flip = false;

        this.dims;

        this.addToLists();
    }   

    addToLists()
    {
        animationsList.push(this);
    }

    setDims(dims)
    {
        this.dims = dims;
        this.hasDims = true;
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
            image(this.animation[showIndex], scaleMod * pos.x, pos.y, this.dims.w, this.dims.h);
        }
        else
        {   
            imageMode(CENTER);
            image(this.animation[showIndex], scaleMod * pos.x, pos.y);
        }

        if(this.flip)
        {
            scale(scaleMod, 1);
        }
    }

    animate() {
        this.index += this.speed;
    }
}