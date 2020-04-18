class Sprite
{
    constructor(animation, speed)
    {
        this.animation = animation;
        this.len = animation.length;
        this.speed = speed;
        this.index = 0;
        this.hasDims = false;

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

        if(this.hasDims)
        {
            image(this.animation[showIndex], pos.x, pos.y, this.dims.w, this.dims.h);
        }
        else
        {
            image(this.animation[showIndex], pos.x, pos.y);
        }
    }

    animate() {
        this.index += this.speed;
    }
}