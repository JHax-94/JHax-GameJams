import { p2 } from './main.js';

export default class EntityManager
{
   constructor(noPhys)
    {
        this.phys = (!noPhys) ? new p2.World({gravity: [0, 0]}) : null; 
        this.map = null;
        this.renderers = [];
        this.updates = [];
    }

    AddPhys(obj, phys)
    {
        obj.phys = new p2.Body({
            mass: phys.mass,
            position: phys.position,
            fixedRotation: true
        })
        
        obj.phys.obj = obj;

        if(phys.tag)
        {
            obj.phys.tag = phys.tag;
        }

        if(phys.isSensor)
        {
            obj.phys.sensor = phys.isSensor;
        }

        var collider = new p2.Box(phys.colliderRect);
        obj.phys.addShape(collider);

        this.phys.addBody(obj.phys);
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
        cls();

        if(this.map) this.map.draw(0, 0);

        for(var i = 0; i < this.renderers.length; i ++)
        {
            this.renderers[i].Draw();
        }
    }

    Update(deltaTime)
    {
        if(this.phys) this.phys.step(deltaTime);
        
        for(var i = 0; i < this.updates.length; i ++)
        {
            this.updates[i].Update(deltaTime);
        }
    }
}