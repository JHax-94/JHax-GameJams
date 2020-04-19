class Screen
{
    constructor()
    {
        this.drawablesList = [];
        this.menuKeyReactors = [];
        this.animationsList = [];
        this.updateableList = [];
        this.ySort = false;
    }

    update(dt)
    {
        for(var i = 0; i < this.updateableList.length; i ++)
        {
          this.updateableList[i].update(dt);
        }
    }

    draw()
    {
        if(this.ySort)
        {
            this.drawablesList.sort(function(a, b) { return a.pos.y - b.pos.y });
        }
        
        for(var i = 0; i < this.drawablesList.length; i++)
        {
            this.drawablesList[i].draw();
        }
    }

    animate()
    {
        for(var i = 0; i < this.animationsList.length; i ++)
        {
            this.animationsList[i].animate();
        }
    }

    menuUp()
    {
        for(var i = 0; i < this.menuKeyReactors.length; i ++)
        {
            this.menuKeyReactors[i].menuUp();
        }
    }

    menuLeft()
    {
        for(var i = 0; i < this.menuKeyReactors.length; i ++)
        {
            this.menuKeyReactors[i].menuLeft();
        }
    }

    menuRight()
    {
        for(var i = 0; i < this.menuKeyReactors.length; i ++)
        {
            this.menuKeyReactors[i].menuRight();
        }
    }

    menuDown()
    {
        for(var i = 0; i < this.menuKeyReactors.length; i ++)
        {
            this.menuKeyReactors[i].menuDown();
        }
    }

    menuSubmit()
    {
        for(var i = 0; i < this.menuKeyReactors.length; i ++)
        {
            this.menuKeyReactors[i].menuSubmit();
        }
    }

}