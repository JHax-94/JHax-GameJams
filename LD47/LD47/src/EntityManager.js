export default class EntityManager
{
    constructor()
    {
        this.map = null;
        this.renderers = [];
        this.updates = [];
    }

    SortRenders()
    {
        this.renderers.sort(function(a, b) { return a.z - b.z });
    }

    AddRender(renderer)
    {
        this.renderers.push(renderer);
        this.SortRenders();
    }

    RemoveRender(renderer)
    {
        for(var i = 0; i < this.renderers.length; i ++)
        {
            if(this.renderers[i] === renderer)
            {
                this.renderers.splice(i, 1);
                break;            
            }
        }

        this.SortRenders();
    }

    AddUpdate(updatable)
    {
        this.updates.push(updatable);
    }

    RemoveUpdate(updatable)
    {
        for(var i = 0; i < this.updates.length; i ++)
        {
            if(this.updates[i] === updatable)
            {
                this.updatable.splice(i, 1);
                break;
            }
        }
    }

    Render()
    {
        for(var i = 0; i < this.renderers.length; i ++)
        {
            this.renderers[i].Draw();
        }
    }

    Update(deltaTime)
    {
        cls();

        if(this.map) this.map.draw(0, 0);
        
        for(var i = 0; i < this.updates.length; i ++)
        {
            this.updates[i].Update(deltaTime);
        }
    }
}