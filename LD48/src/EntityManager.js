import p2 from "p2";
import { consoleLog, UP, DOWN, LEFT, RIGHT, INTERACT, PIXEL_SCALE } from "./main";

export default class EntityManager
{
    constructor(noPhys)
    {
        this.drawColliders = false;
        this.frameCount = 0;
        this.bgColour = 15;

        this.updates = [];
        this.renders = [];
        this.inputListeners = [];

        this.trackMouse = false;

        this.clickables = [];
        this.hovers = [];

        this.pause = false;

        this.phys = (!noPhys) ? new p2.World({gravity: [0, -4]}) : null;

        if(this.phys) this.SetupPhys();
    }

    AddClickable(clickable)
    {
        this.clickables.push(clickable);
    }

    AddUpdate(obj)
    {
        this.updates.push(obj);
    }

    DrawColliders(phys)
    {
        //consoleLog(phys);

        for(var i = 0; i < phys.shapes.length; i ++)
        {
            var shape = phys.shapes[i];

            var box = { x: (phys.position[0]-(0.5*shape.width)), y: -(phys.position[1] + (0.5*shape.height)), width: shape.width, height: shape.height };
            /*
            consoleLog("Draw box");
            consoleLog(box);
            */
            pen(42);
            rect(box.x, box.y, box.width, box.height);
        }
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

    RemovePhys(physObj)
    {
        this.phys.removeBody(physObj.phys);
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
        //consoleLog("ADDING PHYSICS");

        if(phys.tileTransform)
        {
            phys.position = [ 
                (phys.tileTransform.x + (0.5 * phys.tileTransform.w)) * PIXEL_SCALE,
                - (phys.tileTransform.y + (0.5*phys.tileTransform.h) ) * PIXEL_SCALE 
            ];            
            phys.colliderRect = { width: phys.tileTransform.w * PIXEL_SCALE, height: phys.tileTransform.h * PIXEL_SCALE };

            obj.width = phys.colliderRect.width;
            obj.height = phys.colliderRect.height;
        }
        else if(phys.transform)
        {
            phys.position = [   
                (phys.transform.x + 0.5*phys.transform.w),
                - (phys.transform.y + 0.5* phys.transform.h) 
            ];
            phys.colliderRect = { width: phys.transform.w, height: phys.transform.h };

            obj.width = phys.colliderRect.width;
            obj.height = phys.colliderRect.height;
        }

        /*
        consoleLog("ADD BODY");
        consoleLog(phys);
        */
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

        /*
        consoleLog("adding shape:");
        consoleLog(collider);
        */
        obj.phys.addShape(collider);

        obj.phys.position = phys.position;
        /*
        consoleLog("Physics added!");
        consoleLog(obj);
        */

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
        /*
        consoleLog("COMPARE TAGS: " + tag1 + ", " + tag2);
        consoleLog(evt);
        */
        return (evt.bodyA.tag === tag1 && evt.bodyB.tag === tag2) || (evt.bodyA.tag === tag2 && evt.bodyB.tag === tag1);
    }

    BodyWithTag(evt, tag)
    {
        /*
        consoleLog("BODY WITH TAG: " + tag);
        consoleLog(evt);
        */
        var body = null;

        if(evt.bodyA.tag === tag) body = evt.bodyA;
        else if(evt.bodyB.tag === tag) body = evt.bodyB;
        
        return body;
    }

    GetPosition(physObj)
    {
        //consoleLog(physObj);

        return { 
            x: (physObj.phys.position[0] - 0.5 * physObj.width), 
            y: -(physObj.phys.position[1] + 0.5 * physObj.height) 
        };
    }

    SetVelocity(physObj, velocity)
    {
        physObj.phys.velocity[0] = velocity.x;
        physObj.phys.velocity[1] = velocity.y;
    }

    SetupPhys()
    {
        var manager = this;
        this.phys.on("beginContact", function (evt)
        {
            if(manager.CompareTags(evt, "DIVER", "SEABED"))
            {
                var diver = manager.BodyWithTag(evt, "DIVER");

                diver.obj.canJump = true;
            }
            else if(manager.CompareTags(evt, "DIVER", "CONTAINER"))
            {
                var diver = manager.BodyWithTag(evt, "DIVER");
                var interactable = manager.BodyWithTag(evt, "CONTAINER");

                
                diver.obj.SetInteractable(interactable.obj);
            }
            else if(manager.CompareTags(evt, "DIVER", "COLLECTABLE"))
            {
                var diver = manager.BodyWithTag(evt, "DIVER");
                var collectable = manager.BodyWithTag(evt, "COLLECTABLE");

                diver.obj.Collect(collectable.obj);
            }
        });

        this.phys.on("endContact", function(evt)
        {
            // End collisions go here

            if(manager.CompareTags(evt, "DIVER", "CONTAINER"))
            {
                var diver = manager.BodyWithTag(evt, "DIVER");
                diver.obj.SetInteractable(null);
            }
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

            /*
            var input = { key: null };

            if(btnp.up || btnp.up_alt) input.key = UP;
            else if(btnp.right || btnp.right_alt) input.key = RIGHT;
            else if(btnp.down || btnp.down_alt) input.key = DOWN;
            else if(btnp.left || btnp.left_alt) input.key = LEFT;
            
            if(btnp.interact) input.key = INTERACT;
            */
            for(var i = 0; i < this.inputListeners.length; i ++)
            {
                this.inputListeners[i].Input(btn);
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
            this.deltaTime = deltaTime;

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

            if(this.drawColliders && this.renders[i].phys)
            {
                this.DrawColliders(this.renders[i].phys);
            }
        }
    }

    Overlap(clickable, x, y)
    {
        var bounds = clickable.Bounds();
        /*
        consoleLog("Check (" + x + ", " + y + ") against:");
        consoleLog(bounds);*/

        var xOverlap = bounds.x < x && x < bounds.x + bounds.w;
        var yOverlap = bounds.y < y && y < bounds.y + bounds.h;

        return xOverlap && yOverlap;
    }
    
    AddHover(hover)
    {
        consoleLog("===== ADD HOVER! =====");

        if(this.trackMouse === false)
        {
            this.trackMouse = true;
        }

        this.hovers.push(hover);
    }

    MouseMove(x, y)
    {
        if(this.trackMouse)
        {
            for(var i = 0; i < this.hovers.length; i ++)
            {
                this.hovers[i].Hover(this.Overlap(this.hovers[i], x, y), { x: x, y: y});
            }
        }
    }

    MouseClick(x, y, button)
    {
        if(!this.endScreenOn)
        {
            var clicked = false;

            for(var i = 0; i < this.clickables.length; i ++)
            {
                if(this.clickables[i].hide)
                {
                }
                else if(this.Overlap(this.clickables[i], x, y))
                {
                    this.clickables[i].Click(button);

                    clicked = true;
                    break;
                }
            }
        }
    }
}