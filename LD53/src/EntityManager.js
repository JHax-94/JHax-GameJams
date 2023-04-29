import p2 from "p2";
import InputGroup from "./InputGroup";
import { consoleLog, PIXEL_SCALE, EM, TILE_HEIGHT } from "./main";
import PhysicsContainer from "./PhysicsContainer";
import RenderLayer from "./RenderLayer";
import KeyboardInput from "./InputMethods/KeyboardInput";

export default class EntityManager
{
    constructor(noPhys)
    {
        this.drawColliders = false;
        this.hudLogOn = false;
        this.frameCount = 0;
        this.bgColour = 12;
        
        this.version = null;

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
        this.inputDetectFilter = null;

        this.inputDetectors = [];

        this.inputFreezeFrames = 0;

        this.clickables = [];
        this.hovers = [];

        this.entities = {}

        this.inputOn = true;
        this.pause = false;

        this.cancelInputDetect = false;

        this.phys = (!noPhys) ? new p2.World({gravity: [0, 0] }) : null;

        this.AddRenderLayer("WORLD", 0);
        this.AddRenderLayer("CRITTER_SHADOW", true);
        this.AddRenderLayer("CRITTERS", 1, true);
        this.AddRenderLayer("WORLD_UI", 2);
        this.AddRenderLayer("OVERLAY_UI", 3);
        this.AddRenderLayer("MENU_UI", 4);

        this.AddInputGroup("DEFAULT");
        this.AddInputGroup("PLAYER");

        this.FocusInputGroup("DEFAULT");

        this.inputReceivers = [];

        this.hudLog = [];
        this.debugRects = [];
        this.hudLogRoot = 12;
        this.hudLogHeight = 0.75;
        this.hudLogColour = 1;

        this.inputSources = [];        

        this.inputSources.push(new KeyboardInput());

        if(this.phys) this.SetupPhys();
    }

    SetVersionInfo(versionInfo)
    {
        this.version = versionInfo;
    }

    LogRenderList()
    {
        consoleLog("RENDER LAYERS:")
        consoleLog(this.renderLayers);
    }

    AddRenderLayer(name, order, ySort)
    {
        this.renderLayers.push(new RenderLayer(name, order, ySort));

        this.renderLayers.sort(function(a, b) { b.order - a.order });
        /*
        consoleLog("Render layers:");
        consoleLog(this.renderLayers);*/
    }

    GetRenderLayer(name)
    {
        let renderLayer = null;

        for(let i = 0; i < this.renderLayers.length; i ++)
        {
            if(this.renderLayers[i].name === name)
            {
                renderLayer = this.renderLayers[i];
            }
        }

        return renderLayer;
    }

    ChangeRenderLayer(obj, newLayer, addAtPosition)
    {
        EM.RemoveRender(obj);

        let newLayerObj = this.GetRenderLayer(newLayer);
        newLayerObj.AddRender(obj, addAtPosition);
        obj.renderLayer = newLayer;
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
        let log = false;
        if(settings && settings.log)
        {
            log = true;
        }

        if(log)
        {
            consoleLog("REGISTER ENTITY");
            consoleLog(entity);
            consoleLog(settings);
        }
        
    
        if(entity.Draw)
        {   
            if(log) consoleLog("ADD RENDER");

            if(!entity.renderLayer)
            {
                entity.renderLayer = this.defaultLayer;
            }

            this.AddRender(entity, entity.renderLayer);

            if(log) consoleLog(this.renderLayers);
        }

        if(entity.Update)
        {
            if(log) consoleLog("Register update...");

            this.AddUpdate(entity);
        }

        if(entity.Input)
        {
            if(log) consoleLog("Register input...");

            this.AddInput(entity);
        }

        if(entity.InputDetect)
        {
            if(log) consoleLog("REGISTER ENTITY INPUT DETECTOR");
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
    
    SetInputFilter(inputFilter, freezeFrames)
    {
        let setFreezeFrames = 15;

        if(freezeFrames || freezeFrames === 0)
        {
            setFreezeFrames = freezeFrames;
        }

        this.inputDetectFilter = inputFilter;
        this.inputFreezeFrames = setFreezeFrames;
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

    TileToPhysPosition(tilePos)
    {
        return [ (tilePos.x + 0.5)* PIXEL_SCALE, - (tilePos.y + 0.5) * PIXEL_SCALE ];
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
        /*
        for(let i = 0; i < this.inputGroups.length; i ++)
        {
            if(this.inputGroups[i].name === groupName)
            {
                //consoleLog("Input group found!");

                this.inputGroups[i].AddInput(obj);    
            }
        }*/

        this.inputReceivers.push(obj);
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

    TileToPhysPosition(tilePos)
    {
        return [ 
            (tilePos.x + (0.5 * tilePos.w)) * PIXEL_SCALE,
            - (tilePos.y + (0.5*tilePos.h) ) * PIXEL_SCALE 
        ];
    }

    AddPhys(obj, phys)
    {
        if(phys.tileTransform)
        {
            phys.position = this.TileToPhysPosition(phys.tileTransform);
                    
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

        obj.Phys = function () {
            return obj.phys;
        };
        
        obj.phys.obj = obj;

        if(phys.tag)
        {
            obj.phys.tag = phys.tag;
        }

        if(phys.isKinematic)
        {
            obj.phys.type = p2.Body.KINEMATIC;
        }

        let colliders = [];
        let addColliders = true;

        if(!phys.collider)
        {
            let box = new p2.Box(phys.colliderRect);

            colliders.push(box);

            if(phys.isDual)
            {
                let dual = p2.Box(phys.colliderRect);
                dual.isDual = true;
                dual.dualPos = [...box.position]
                collider.push(dual);
            }
        }
        else
        {
            if(phys.collider.verts)
            {
                obj.phys.fromPolygon(phys.collider.verts, {
                    skipSimpleCheck: true
                });

                colliders = [...obj.phys.shapes];
            
                if(phys.isDual)
                {
                    for(let i = 0; i < obj.phys.shapes.length; i ++)
                    {
                        let cvx = obj.phys.shapes[i];

                        let dualCvx = new p2.Convex({ vertices: [...cvx.vertices]});

                        dualCvx.isDual = true;
                        dualCvx.dualPos = [...cvx.position];

                        colliders.push(dualCvx);
                    }
                }

                addColliders = false;
            }
        }
        
        for(let i = 0; i < colliders.length; i ++)
        {
            let collider = colliders[i];

            collider.friction = 0.0;
        
            if(phys.collisionGroup != null)
            {
                collider.collisionGroup = phys.collisionGroup;

                if(collider.isDual)
                {
                    collider.collisionGroup = (phys.dualCollisionGroup != null) ? phys.dualCollisionGroup : phys.collisionGroup;
                }
            }

            if(phys.collisionMask != null)
            {
                collider.collisionMask = phys.collisionMask;

                if(collider.isDual)
                {
                    collider.collisionMask = (phys.dualCollisionMask != null) ? phys.dualCollisionMask : phys.collisionMask;
                }
            }

            if(phys.isSensor)
            {
                collider.sensor = phys.isSensor;

                if(collider.isDual)
                {
                    collider.sensor = !phys.isSensor;
                }
            }

            if(phys.material)
            {
                collider.material = this.physContainer.GetMaterial(phys.material);
            }

            if(addColliders || collider.isDual) 
            {
                obj.phys.addShape(collider, collider.dualPos);
            }
        }
        
        obj.phys.position = phys.position;

        let aabb = obj.phys.getAABB();
        let aabbCentre = {
            x: 0.5 * (aabb.lowerBound[0] + aabb.upperBound[0]),
            y: 0.5 * (aabb.lowerBound[1] + aabb.upperBound[1])
        };

        obj.phys.centreOffset = [ phys.position[0] - aabbCentre.x, phys.position[1] -  aabbCentre.y ];
        obj.phys.position = [ obj.phys.position[0] + obj.phys.centreOffset[0], obj.phys.position[1] + obj.phys.centreOffset[1] ];

        obj.Position = function() {
            return { x: obj.phys.position[0], y: obj.phys.position[1] };
        };
        
        obj.GetScreenPos = function() {
            return { 
                x: Math.floor(this.phys.position[0] - this.phys.centreOffset[0] - 0.5 * this.width), 
                y: Math.floor(-(this.phys.position[1] - this.phys.centreOffset[1] +0.5*this.height)) 
            };
        };

        this.phys.addBody(obj.phys);        
    }

    IsSensor(physObj)
    {
        let allSensor = true;

        for(let i = 0; i < physObj.shapes.length; i ++)
        {
            if(!physObj.shapes[i].sensor)
            {
                allSensor = false;
                break;
            }
        }

        return allSensor;
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

    ShapeWithTag(evt, tag)
    {
        let shape = null;

        if(evt.shapeA.body.tag === tag) shape = evt.shapeA;
        else if(evt.shapeB.body.tag === tag) shape = evt.shapeB;

        return shape;
    }

    ShapeWithBody(evt, body)
    {
        let shape = null;

        if(evt.shapeA.body === body) shape = evt.shapeA;
        else if(evt.shapeB.body === body) shape = evt.shapeB;

        return shape;
    }


    ContactEquationsEnabled(evt)
    {
        let enabled = false;

        for(let i = 0; i < evt.contactEquations.length; i ++)
        {
            if(evt.contactEquations[i].enabled)
            {
                enabled = true;
                break;
            }
        }

        return enabled;
    }

    HasTag(evt, tag)
    {
        return evt.bodyA.tag === tag || evt.bodyB.tag === tag;
    }

    BodiesWithTag(evt, tag)
    {
        let bodies = [];

        if(evt.bodyA.tag === tag) bodies.push(evt.bodyA);
        if(evt.bodyB.tag === tag) bodies.push(evt.bodyB);

        return bodies;
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
        /*
        if(!this.pause)
        {
            this.pause = true;

            let pauseMenuConf = getObjectConfig("pauseEndGameMenu");

            this.pauseMenu = new PauseMenu(pauseMenuConf, {});
            this.inputDetectMode = true;
            this.inputFreezeFrames = 10;
        }
        else
        {
            this.pauseMenu.Close();
            this.cancelInputDetect = true;
            this.pause = false;
            this.inputDetectMode = false;
        }*/
    }
    
    ShowGameOver()
    {
        if(!this.pause)
        {
            /*
            let maze = EM.GetEntity("Maze");

            consoleLog("MAZE");
            consoleLog(maze);
            consoleLog(maze.mazeData);

            this.pause = true;
            this.pauseMenu = new GameOverMenu(maze.mazeData.levelName);*/
        }
    }

    GameOver()
    {
        /*
        let explosionConfig = getObjectConfig("Explosion");

        this.gameOverDelay = (explosionConfig.frameTime * explosionConfig.frames.length) + 0.5;*/
    }

    Input()
    {
        if(this.inputOn)
        {
            for(let i = 0; i < this.inputSources.length; i ++)
            {
                this.inputSources[i].SetState(btn);
            }

            for(let i = 0; i < this.inputReceivers.length; i ++)
            {
                this.inputReceivers[i].Input(this.inputSources[0]);
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

        if(this.focusedInputGroup)
        {
            this.hudLog.push(`Input group: ${this.focusedInputGroup.name}`);
        }
        
        for(var i = 0; i < this.updates.length; i ++)
        {
            this.updates[i].Update(deltaTime);
        }        
    }

    Update(deltaTime)
    {
        if(this.phys)
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
            else 
            {
                this.pauseMenu.Update(deltaTime);
            }
        }
        else
        {
            this.UpdateLoop(deltaTime)
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
            /*
            if(!this.renders[i].hide)
            {
                this.renders[i].Draw();
            }

            
            if(this.drawColliders && this.renders[i].phys)
            {
                this.DrawColliders(this.renders[i].phys);
            }
        }
        */
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
            if(this.hudLogOn)
            {
                pen(this.hudLogColour);
                for(let i = 0; i < this.hudLog.length; i ++)
                {
                    print(this.hudLog[i], 0, this.hudLogRoot * PIXEL_SCALE + this.hudLogHeight * PIXEL_SCALE*i);
                }
            }
            
            this.hudLog = [];
        }

        if(this.debugRects.length > 0)
        {
            paper(23);            
            for(let i = 0; i < this.debugRects.length; i ++)
            {
                consoleLog(`Debug point: (${this.debugRects[i].x}, ${this.debugRects[i].y})`);
                rectf(this.debugRects[i].x-1, this.debugRects[i].y-1, 2, 2);
            }

            this.debugRects = [];
        }

        if(this.version)
        {
            pen(this.hudLogColour);
            print(`v.${this.version.version} (${this.version.git})`, 0, (TILE_HEIGHT - 0.5) * PIXEL_SCALE);
        }
    }

    DrawColliders(phys)
    {
        consoleLog("DRAW COLLIDERS");
        consoleLog(phys);
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