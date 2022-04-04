import p2 from "p2";
import { start } from "tina";
import { linear } from "tina/src/easing";
import InputGroup from "./InputGroup";
import { consoleLog, UP, DOWN, LEFT, RIGHT /*INTERACT*/, PIXEL_SCALE,/*, em, LoadChart, DATA_STORE*/ 
EM} from "./main";
import PauseMenu from "./PauseMenu";
import GameOverMenu from "./GameOverMenu";
import PhysicsContainer from "./PhysicsContainer";
import RenderLayer from "./RenderLayer";

export default class EntityManager
{
    constructor(noPhys)
    {
        this.drawColliders = false;
        this.frameCount = 0;
        this.bgColour = 15;

        this.gameTimeElapsed = 0;

        this.defaultLayer = "WORLD";

        this.focusedInputGroup = null;
        this.inputGroups = [];

        this.updates = [];
        this.renders = [];

        this.renderLayers = [];

        this.inputListeners = [];
        this.trackMouse = false;

        this.clickables = [];
        this.hovers = [];

        this.entities = {}

        this.pause = false;

        this.phys = (!noPhys) ? new p2.World({gravity: [0, 0] }) : null;

        this.AddRenderLayer("WORLD", 0);
        this.AddRenderLayer("MISSILE", 1);
        this.AddRenderLayer("WORLD_UI", 2);
        this.AddRenderLayer("OVERLAY_UI", 3);
        this.AddRenderLayer("MENU_UI", 4, true);

        this.AddInputGroup("DEFAULT");

        this.FocusInputGroup("DEFAULT");

        if(this.phys) this.SetupPhys();
    }

    AddRenderLayer(name, order, ySort)
    {
        this.renderLayers.push(new RenderLayer(name, order, ySort));

        this.renderLayers.sort(function(a, b) { b.order - a.order });

        consoleLog("Render layers:");
        consoleLog(this.renderLayers);
    }

    AddInputGroup(groupName)
    {
        this.inputGroups.push(new InputGroup(groupName));
    }

    FocusInputGroup(groupName)
    {
        for(let i = 0; i < this.inputGroups.length; i ++)
        {
            if(this.inputGroups[i].name === groupName)
            {
                this.focusedInputGroup = this.inputGroups[i];
                break;
            }
        }
    }

    RegisterEntity (entity, settings)
    {
        if(entity.Draw)
        {
            if(!entity.renderLayer)
            {
                entity.renderLayer = this.defaultLayer;
            }

            this.AddRender(entity, entity.renderLayer);
        }

        if(entity.Update)
        {
            this.AddUpdate(entity);
        }

        if(entity.Input)
        {
            this.AddInput(entity);
        }

        if(entity.Hover)
        {
            this.AddHover(entity);
        }

        if(entity.Click)
        {
            this.AddClickable(entity);
        }

        if(settings)
        {
            /*
            consoleLog("Intialising object physics...");
            consoleLog(settings.physSettings);*/
            if(settings.physSettings)
            {
                this.AddPhys(entity, settings.physSettings);
            }
        }
    }
    
    SetFocusedInput(entity)
    {
        this.focusedInput = entity;
    }

    ClearDown()
    {
        for(let i = 0; i < this.entities.length; i ++)
        {
            this.RemoveEntity(this.entities[i]);
        }
    }

    RemoveEntity(entity)
    {
        if(entity.Draw)
        {
            this.RemoveRender(entity);
        }

        if(entity.Update)
        {
            this.RemoveUpdate(entity);
        }

        if(entity.Input)
        {
            this.RemoveInput(entity);
        }

        if(entity.phys)
        {
            this.RemovePhys(entity);
        }

        if(entity.Hover)
        {
            this.RemoveHover(entity);
        }

        if(entity.Click)
        {
            this.RemoveClickable(entity);
        }

        if(entity.ENTITY_NAME)
        {
            delete this.entities[entity.ENTITY_NAME];
        }
    }

    AddEntity(name, entity)
    {
        entity.ENTITY_NAME = name;

        this.entities[name] = entity;
        /*
        consoleLog("ENTITIES:");
        consoleLog(this.entities);
        */
        if(entity.OnRegistered)
        {
            entity.OnRegistered();
        }
    }

    GetEntitiesStartingWith(startingWith)
    {
        let entityList = [];

        for(let key in this.entities)
        {
            if(key.substring(0, startingWith.length) === startingWith)
            {
                entityList.push(this.entities[key]);
            }
        }

        return entityList;
    }

    GetEntity(name)
    {
        let entity = null;
        /*
        consoleLog(`Look for Entity ${name}`);
        consoleLog(this.entities);
        */
        if(this.entities[name])
        {
            //consoleLog("Found entity!");
            entity = this.entities[name];
        }
        /*
        consoleLog("Returning:");
        consoleLog(entity);
        */  
        return entity;
    }

    AddClickable(clickable)
    {
        this.clickables.push(clickable);
    }

    AddUpdate(obj)
    {
        this.updates.push(obj);
    }

    RemoveUpdate(updatable)
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
        let groupName = "DEFAULT";

        if(obj.inputGroup)
        {
            groupName = obj.inputGroup;
        }
        
        //consoleLog(`Adding to input group ${groupName}`)

        for(let i = 0; i < this.inputGroups.length; i ++)
        {
            if(this.inputGroups[i].name === groupName)
            {
                //consoleLog("Input group found!");

                this.inputGroups[i].AddInput(obj);    
            }
            
        }
    }

    RemoveInput(obj)
    {
        let groupName = "DEFAULT";

        if(obj.inputGroup)
        {
            groupName = obj.inputGroup;
        }

        for(let i = 0; i < this.inputGroups.length; i ++)
        {
            if(this.inputGroups[i].name === groupName)
            {
                this.inputGroups[i].RemoveInput(obj);
            }
        }
    }

    AddPhys(obj, phys)
    {
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

        let fixedRotation = true;

        if(phys.freeRotate)
        {
            fixedRotation = false;
        }

        let linearDrag = 0.1;

        if(phys.linearDrag || phys.linearDrag === 0)
        {
            linearDrag = phys.linearDrag;
        }

        let angularDrag = 0.1;

        if(phys.angularDrag || phys.angularDrag === 0)
        {
            angularDrag = phys.angularDrag;
        }

        obj.phys = new p2.Body({
            mass: phys.mass,
            position: phys.position,
            fixedRotation: fixedRotation,
            damping: linearDrag,
            angularDamping: angularDrag
        })
        
        obj.phys.obj = obj;

        obj.Position = function() {
            return { x: obj.phys.position[0], y: obj.phys.position[1] };
        };
        
        obj.GetScreenPos = function() {
            return { x: Math.floor(this.phys.position[0] - 0.5 * this.width), y: Math.floor(-(this.phys.position[1]+0.5*this.height)) };
        };

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

        if(phys.material)
        {
            collider.material = this.physContainer.GetMaterial(phys.material);
        }

        obj.phys.addShape(collider);

        obj.phys.position = phys.position;

        this.phys.addBody(obj.phys);        
    }

    AddRender(renderEntity, layerName)
    {
        for(let i = 0; i < this.renderLayers.length; i ++)
        {
            if(this.renderLayers[i].name === layerName)
            {
                this.renderLayers[i].AddRender(renderEntity);
            }
        }
    }

    RemoveRender(renderer, log)
    {
        for(let i = 0; i < this.renderLayers.length; i ++)
        {
            if(this.renderLayers[i].name === renderer.renderLayer)
            {
                this.renderLayers[i].RemoveRender(renderer);
            }
        }
    }

    GetPosition(physObj)
    {
        return { 
            x: (physObj.phys.position[0] - 0.5 * physObj.width), 
            y: -(physObj.phys.position[1] + 0.5 * physObj.height) + this.cameraDepth
        };
    }

    SetVelocity(physObj, velocity)
    {
        physObj.phys.velocity[0] = velocity.x;
        physObj.phys.velocity[1] = velocity.y;
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

    BodyOppositeTag(evt, tag)
    {
        var body = null;

        if(evt.bodyA.tag === tag) body = evt.bodyB;
        else if(evt.bodyB.tag === tag) body = evt.bodyA;

        return body;
    }

    SetupPhys()
    {
        this.physContainer = new PhysicsContainer(this);
    }

    SortRenders()
    {
        // Not sure what this will look like yet...
    }

    Pause()
    {
        if(!this.pause)
        {
            this.pause = true;
            this.pauseMenu = new PauseMenu();
        }
        else
        {
            this.pause = false;
            this.pauseMenu.Close();
        }
    }
    
    GameOver()
    {
        if(!this.pause)
        {
            let maze = EM.GetEntity("Maze");

            consoleLog("MAZE");
            consoleLog(maze);
            consoleLog(maze.mazeData);

            this.pause = true;
            this.pauseMenu = new GameOverMenu(maze.mazeData.levelName);
        }

        
    }

    Input()
    {
        if(!this.pause)
        {
            /*
            var input = { key: null };

            if(btnp.up || btnp.up_alt) input.key = UP;
            else if(btnp.right || btnp.right_alt) input.key = RIGHT;
            else if(btnp.down || btnp.down_alt) input.key = DOWN;
            else if(btnp.left || btnp.left_alt) input.key = LEFT;
            */
            if(this.focusedInputGroup)
            {
                this.focusedInputGroup.Input(btn);
            }
        }
        else if(this.pauseMenu)
        {
            this.pauseMenu.Input(btn);
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

            this.gameTimeElapsed += this.deltaTime;

            if(this.phys) 
            {
                // Should trigger an update at end step;
                this.phys.step(deltaTime, deltaTime, 20);
            }
        }
    }

    Render()
    {
        if(this.bgColour)
        {
            paper(this.bgColour);
        }
        else
        {
            paper(0);
        }
        cls();

        if(this.background)
        {
            //consoleLog("Draw background...");
            this.background.Draw();
        } 

        if(this.map)
        {
            //consoleLog("Draw Map");
            this.map.draw(0, 0);
        }
         

        /*
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
        }*/

        /*
        consoleLog("RENDER LAYERS");
        consoleLog(this.renderLayers);
        */

        for(let i = 0; i < this.renderLayers.length; i ++)
        {
            this.renderLayers[i].Render();
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
        if(this.trackMouse === false)
        {
            this.trackMouse = true;
        }

        this.hovers.push(hover);
    }

    RemoveHover(hover)
    {
        for(var i = 0; i < this.hovers.length; i ++)
        {
            if(this.hovers[i] === hover)
            {
                this.hovers.splice(i, 1);
                break;
            }
        }
    }

    RemoveClickable(clickable)
    {
        for(var i = 0; i < this.clickables.length; i ++)
        {
            if(this.clickables[i] === clickable)
            {
                this.clickables.splice(i, 1);
                break;
            }
        }
    }

    MouseMove(x, y)
    {
        var consumed = false;

        if(this.trackMouse)
        {
            for(var i = this.hovers.length-1; i >= 0; i --)
            {
                if(!consumed)
                {
                    var overlap = this.Overlap(this.hovers[i], x, y);
                    this.hovers[i].Hover(overlap, { x: x, y: y});

                    consumed = overlap;
                }
                else
                {
                    this.hovers[i].Hover(false);
                }
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
                    this.clickables[i].Click(button, {x: x, y: y});

                    clicked = true;
                    break;
                }
            }
        }
    }
}