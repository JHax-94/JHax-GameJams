import { consoleLog, p2 } from './main.js';

export default class EntityManager
{
   constructor(noPhys)
    {
        this.phys = (!noPhys) ? new p2.World({gravity: [0, 0]}) : null; 
        this.map = null;
        this.renderers = [];
        this.updates = [];

        if(this.phys) this.SetupPhys();
    }

    CompareTags(evt, tag1, tag2)
    {
        return (evt.bodyA.tag === tag1 && evt.bodyB.tag === tag2) || (evt.bodyA.tag === tag2 && evt.bodyB.tag === tag1);
    }

    BodyWithTag(evt, tag)
    {
        var body = null;

        if(evt.bodyA.tag === tag) body = evt.bodyA;
        else if(evt.bodyB.tag === tag) body = evt.bodyB;
        
        return body;
    }

    SetupPhys()
    {
        var manager = this;
        this.phys.on("beginContact", function (evt)
        {
            if(manager.CompareTags(evt, "ELECTRON", "POINTS"))
            {
                //consoleLog("COLLISION!");

                var electron = manager.BodyWithTag(evt, "ELECTRON");
                var points = manager.BodyWithTag(evt, "POINTS");
                /*
                consoleLog(electron.obj);
                consoleLog(points.obj);*/

                electron.obj.SetContact(points.obj);
            }
        });
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

        if(phys.isKinematic)
        {
            obj.phys.type = p2.Body.KINEMATIC;
        }

        var collider = new p2.Box(phys.colliderRect);
        collider.friction = 0.0;

        if(phys.isSensor)
        {
            collider.sensor = phys.isSensor;
        }

        obj.phys.addShape(collider);

        this.phys.addBody(obj.phys);
        
        /*consoleLog("PHYS ADDED");
        consoleLog(obj.phys);
        consoleLog(collider);*/

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