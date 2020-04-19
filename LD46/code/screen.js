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

    deleteFromDrawables(id)
    {
        for(var i = 0; i < this.drawablesList.length; i ++)
        {
            if(this.drawablesList[i].id === id)
            {
                this.drawablesList.splice(i, 1);
                i --;
            }
        }   
    }

    deleteFromUpdatables(id)
    {
        for(var i = 0; i < this.updateableList.length; i ++)
        {
            if(this.updateableList[i].id === id)
            {
                this.updateableList.splice(i, 1);
                i --;
            }
            
        }   
    }

    deleteFromAnimations(id)
    {
        for(var i = 0; i < this.animationsList.length; i ++)
        {
            if(this.animationsList[i].id === id)
            {
                this.animationsList.splice(i, 1);
                i --;
            }
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