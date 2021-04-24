import p2 from "p2";
import { consoleLog, UP, DOWN, LEFT, RIGHT } from "./main";

export default class EntityManager
{
    constructor(noPhys)
    {
        this.frameCount = 0;
        this.bgColour = 15;

        this.updates = [];
        this.renders = [];
        this.inputListeners = [];

        this.pause = false;

        this.phys = (!noPhys) ? new p2.World({gravity: [0, -2]}) : null;

        if(this.phys) this.SetupPhys();
    }

    AddUpdate(obj)
    {
        this.updates.push(obj);
    }

    RemoveUpdate(obj)
    {
        for(var i = 0; i < this.updates.length; i ++)
        {
            if(this.updates[i] === updatable)
            {
                this.updates.splice(i, 1);
                break;
            }
        }
    }

    AddInput(obj)
    {
        this.inputListeners.push(obj);
    }

    RemoveInput(obj)
    {
        for(var i = 0; i < this.inputListeners.length; i ++)
        {
            if(this.inputListeners[i] === obj)
            {
                this.inputListeners[i] === obj;
                break;
            }
        }
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

        consoleLog("Physics added!");
        consoleLog(obj);

        this.phys.addBody(obj.phys);        
    }

    AddRender(render)
    {
        this.renders.push(render);
    }

    RemoveRender(renderer, log)
    {
        for(var i = 0; i < this.renders.length; i ++)
        {
            if(this.renders[i] === renderer)
            {
                this.renders.splice(i, 1);
                if(log) 
                {
                    consoleLog("Renderer removed!");
                    consoleLog(renderer);
                }
                break;            
            }
        }

        this.SortRenders();
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
            // collisions go here...
        });

        this.phys.on("endContact", function(evt)
        {
            // End collisions go here
        });

        this.phys.on("postStep", function(evt)
        {
            // Update game logic after physics has finished calculating
            manager.UpdateLoop(manager.deltaTime);
        });
    }

    SortRenders()
    {
        // Not sure what this will look like yet...
    }

    Input()
    {
        if(!this.pause)
        {
            var dir = -1;

            var input = { key: null };

            if(btnp.up || btnp.up_alt) input.key = UP;
            else if(btnp.right || btnp.right_alt) input.key = RIGHT;
            else if(btnp.down || btnp.down_alt) input.key = DOWN;
            else if(btnp.left || btnp.left_alt) input.key = LEFT;

            
            for(var i = 0; i < this.inputListeners.length; i ++)
            {
                this.inputListeners[i].Input(input)
            }
            
        }
    }

    UpdateLoop(deltaTime)
    {        
        for(var i = 0; i < this.updates.length; i ++)
        {
            this.updates[i].Update(deltaTime);
        }
    }

    Update(deltaTime)
    {
        if(!this.pause)
        {
            if(this.phys) 
            {
                // Should trigger an update at end step;
                this.phys.step(deltaTime, deltaTime, 20);
            }
        }
    }

    Render()
    {
        paper(this.bgColour);
        cls();

        if(this.map) this.map.draw(0, 0);

        for(var i = 0; i < this.renders.length; i ++)
        {
            if(!this.renders[i].hide)
            {
                this.renders[i].Draw();
            }
        }
    }
}