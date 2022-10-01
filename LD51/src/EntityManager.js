
import InputGroup from "./InputGroup";
import { consoleLog, PIXEL_SCALE, EM, getObjectConfig } from "./main";
import RenderLayer from "./RenderLayer";

export default class EntityManager
{
    constructor()
    {
        this.drawColliders = false;
        this.frameCount = 0;
        this.bgColour = 12;

        this.gameTimeElapsed = 0;

        this.defaultLayer = "WORLD";

        this.focusedInputGroup = null;
        this.inputGroups = [];

        this.updates = [];
        this.renders = [];

        this.gameOverDelay = 0;

        this.renderLayers = [];

        this.inputListeners = [];
        this.trackMouse = false;
        this.inputDetectMode = false;

        this.inputDetectors = [];

        this.clickables = [];
        this.hovers = [];

        this.entities = {}

        this.inputOn = true;
        this.pause = false;

        this.AddRenderLayer("BACKGROUND", 0);
        this.AddRenderLayer("WORLD", 1, true);
        this.AddRenderLayer("WORLD_UI", 2);
        this.AddRenderLayer("OVERLAY_UI", 3);
        this.AddRenderLayer("MENU_UI", 4, true);
        this.AddRenderLayer("BANNER", 5);

        this.AddInputGroup("DEFAULT");
        this.AddInputGroup("PLAYERS");
        this.AddInputGroup("BANNER");

        this.FocusInputGroup("DEFAULT");

        this.inputReceivers = [];

        this.hudLog = [];
        this.hudLogRoot = 0;
        this.hudLogHeight = 0.75;
        this.hudLogColour = 1;
    }

    AddRenderLayer(name, order, ySort)
    {
        this.renderLayers.push(new RenderLayer(name, order, ySort));

        this.renderLayers.sort(function(a, b) { b.order - a.order });
        /*
        consoleLog("Render layers:");
        consoleLog(this.renderLayers);*/
    }

    AddInputGroup(groupName)
    {
        this.inputGroups.push(new InputGroup(groupName));
    }

    FocusInputGroup(groupName)
    {
        consoleLog(`======----> Focusing input group: ${groupName}`);

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
        /*
        consoleLog("REGISTER ENTITY");
        consoleLog(entity);
        consoleLog(settings);
        */
        if(entity.Draw)
        {   
            //consoleLog("ADD RENDER");

            if(!entity.renderLayer)
            {
                entity.renderLayer = this.defaultLayer;
            }

            this.AddRender(entity, entity.renderLayer);

            //consoleLog(this.renderLayers);
        }

        if(entity.Update)
        {
            this.AddUpdate(entity);
        }

        if(entity.Input)
        {
            this.AddInput(entity);
        }

        if(entity.InputDetect)
        {
            consoleLog("REGISTER ENTITY INPUT DETECTOR");
            this.AddInputDetector(entity);
        }

        if(entity.Hover)
        {
            this.AddHover(entity);
        }

        if(entity.Click)
        {
            this.AddClickable(entity);
        }

        if(entity.inputSource != null)
        {
            //consoleLog("ADD INPUT RECEIVER");
            this.AddInputReceiver(entity, entity.inputSource);
            //consoleLog(this.inputReceivers);
        }
    }
    
    AddInputReceiver(entity, inputSource)
    {
        this.inputReceivers.push({ entity: entity, inputSource: inputSource });
    }

    AddInputDetector(entity)
    {
        this.inputDetectors.push(entity);
    }

    RemoveInputDetector(entity)
    {
        for(let i = 0; i < this.inputDetectors.length; i ++)
        {
            if(this.inputDetectors[i] === entity)
            {
                this.inputDetectors.splice(i, 1);
                break;
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

        for(let i = 0; i < this.updates.length; i ++ )
        {
            this.RemoveEntity(this.updates[i]);
        }


        consoleLog("EM CLEAR DOWN");
        consoleLog(this);
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

        if(entity.InputDetect)
        {
            this.RemoveInputDetector(entity);
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

    SortRenders()
    {
        // Not sure what this will look like yet...
    }

    Pause()
    {
        /*
        if(!this.pause)
        {
            this.pause = true;
            this.pauseMenu = new PauseMenu(gamepads);
        }
        else
        {
            this.pause = false;
            this.pauseMenu.Close();
        }
        */
    }
    
    ShowGameOver()
    {
        /*
        if(!this.pause)
        {
            let maze = EM.GetEntity("Maze");

            consoleLog("MAZE");
            consoleLog(maze);
            consoleLog(maze.mazeData);

            this.pause = true;
            this.pauseMenu = new GameOverMenu(maze.mazeData.levelName);
        }*/
    }

    GameOver()
    {
        /*
        let explosionConfig = getObjectConfig("Explosion");

        this.gameOverDelay = (explosionConfig.frameTime * explosionConfig.frames.length) + 0.5;
        */
    }

    Input()
    {
        if(this.inputOn)
        {
            if(!this.inputDetectMode)
            {
                if(!this.pause)
                {
                    if(this.focusedInputGroup)
                    {
                        let inputState = {
                            btn: btn
                        };

                        this.focusedInputGroup.Input(inputState);
                    }
                }
            }
        }
    }
    
    UpdateLoop(deltaTime)
    {            
        if(this.gameOverDelay > 0)
        {
            this.gameOverDelay -= deltaTime;
            if(this.gameOverDelay < 0)
            {
                this.ShowGameOver();
                this.gameOverDelay = 0;
            }
        }

        this.hudLog.push("TEST");

        if(this.focusedInputGroup)
        {
            //this.hudLog.push(`Input group: ${this.focusedInputGroup.name}`);
        }
        
        for(var i = 0; i < this.updates.length; i ++)
        {
            this.updates[i].Update(deltaTime);
        }        
    }

    Update(deltaTime)
    {
        this.UpdateLoop(deltaTime)
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

        if(this.hudLog.length > 0)
        {
            pen(this.hudLogColour);
            for(let i = 0; i < this.hudLog.length; i ++)
            {
                print(this.hudLog[i], 0, this.hudLogRoot * PIXEL_SCALE + this.hudLogHeight * PIXEL_SCALE*i);
            }
            this.hudLog = [];
        }
        
    }

    Overlap(clickable, x, y)
    {
        var bounds = clickable.Bounds();
        /*
        consoleLog("Check (" + x + ", " + y + ") against:");
        consoleLog(bounds);
        */
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