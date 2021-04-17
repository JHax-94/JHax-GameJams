import EndScreen from './EndScreen.js';
import { consoleLog, p2, UP, RIGHT, DOWN, LEFT, CURRENT_LVL, SFX, LoadLevel, SOUND, getAnimation } from './main.js';
import PauseMenu from './PauseMenu.js';

export default class EntityManager
{
    constructor(noPhys)
    {
        this.electronLossThreshold = 0;
        this.electronsLost = 0;
        this.canShowEnd = CURRENT_LVL !== "title";
        this.bgColour = 1;
        this.phys = (!noPhys) ? new p2.World({gravity: [0, 0]}) : null; 
        this.selector = null;
        this.map = null;
        this.renderers = [];
        this.updates = [];

        this.allComponents = [];

        this.menu = null;

        this.pause = false;
        this.continued = false;
        
        this.endScreenOn = false;

        this.hovers = [];
        this.clickables = [];

        this.electrons = [];
        this.batteries = [];
        this.bulbs = [];

        this.endScreen = null;
        /*this.CreateNewEndScreenBox();
        this.CreatePauseMenu();*/

        this.trackMouse = false;

        this.selected = null;

        this.soundQueue = [];

        if(this.phys) this.SetupPhys();

        this.soundControl = SOUND;

        if(CURRENT_LVL === "title")
        {
            this.AddRender(this.soundControl);
        }

        this.AddUpdate(this.soundControl);
    }

    QueueSound(sound, delay)
    {
        var setDelay = 0;
        if(delay)
        {
            setDelay = delay;
        }

        this.soundQueue.push({ sound: sound, delay: setDelay});
        //consoleLog(this.soundQueue);
    }

    AddComponent(component)
    {
        this.allComponents.push(component);
    }

    GetComponentOnTile(tilePos)
    {
        var comp = null;

        for(var i = 0; i < this.allComponents.length; i ++)
        {
            var componentTilePos = this.allComponents[i].tilePos;

            if(componentTilePos)
            {
                if(componentTilePos.x === tilePos.x && componentTilePos.y === tilePos.y)
                {
                    comp = this.allComponents[i];
                    break;
                }
            }
        }

        return comp;
    }


    Initialise()
    {
        this.CreateNewEndScreenBox();
        this.CreatePauseMenu();
    }

    CreatePauseMenu()
    {
        this.pauseMenu = new PauseMenu(
            { tileX: 4, tileY: 3, tileW: 6, tileH: 4.5 },
            [
                { pos: { tileX: 5, tileY: 3.1 }, text: "PAUSED" },
                
                { pos: {tileX: 5, tileY: 4 }, text: "Press R to" },
                { pos: {tileX: 5.5, tileY: 4.5 }, text: "Restart"},

                { pos: {tileX: 5, tileY: 5.25 }, text: "Press Space to" },
                { pos: { tileX: 5.5, tileY: 5.75 }, text: "Unpause" },

                { pos: { tileX: 5, tileY: 6.5 }, text: "Press Esc to"},
                { pos: { tileX: 5.5, tileY: 7 }, text: "return to menu"}
            ],
            { background: 13, foreground: 14 }
        );
    }

    CreateNewEndScreenBox()
    {
        this.endScreen = new EndScreen(
            { tileX: 4, tileY: 3, tileW: 6, tileH: 3.5 }, 
            { pos: { tileX: 5, tileY: 3.1 }, winText: "Congratulations!", loseText: "Game Over!", altLose: "Current too low!" },
            [
                { pos: {tileX: 5, tileY: 4 }, text: "Press R to" },
                { pos: {tileX: 5, tileY: 4.5 }, text: "Restart Level"},

                { pos: { tileX: 5, tileY: 5.25 }, text: "Press Esc to"},
                { pos: { tileX: 5, tileY: 5.75 }, text: "return to menu"},

                { pos: { tileX: 5, tileY: 6.5 }, text: "Press Space to" },
                { pos: { tileX: 5, tileY: 7 }, text: "Continue Regardless" }
            ],
            { win: { background: 3, foreground: 7 }, lose: { background: 12, foreground: 9 }});
    }

    AddHover(hover)
    {
        if(this.trackMouse === false)
        {
            this.trackMouse = true;
        }

        this.hovers.push(hover);
    }

    Selected()
    {
        return this.selected;
    }

    SetSelected(selectable)
    {
        this.selected = selectable;

        if(selectable !== null)
        {
            var bounds = this.selected.Bounds();

            this.selector.position = { x: bounds.x, y: bounds.y };
            this.selector.isActive = true;
        }
        else
        {
            this.selector.isActive = false;
        }
        
    }

    Overlap(clickable, x, y)
    {
        var bounds = clickable.Bounds();

        var xOverlap = bounds.x < x && x < bounds.x + bounds.w;
        var yOverlap = bounds.y < y && y < bounds.y + bounds.h;

        return xOverlap && yOverlap;
    }

    Input()
    {
        if(!this.endScreenOn && !this.pause)
        {
            var dir = -1;

            if(btnp.up || btnp.up_alt) dir = UP;
            else if(btnp.right || btnp.right_alt) dir = RIGHT;
            else if(btnp.down || btnp.down_alt) dir = DOWN;
            else if(btnp.left || btnp.left_alt) dir = LEFT;

            if(dir >= 0 && this.selected !== null)
            {
                if(this.selected.Input)
                {
                    this.selected.Input(dir);
                }
            }

            if(this.canShowEnd)
            {
                if(btnp.esc || btnp.reset || btnp.space)
                {
                    this.pause = true;
                    this.pauseMenu.Show(true);
                }
            }
        }
        else
        {
            if(btnp.esc) 
            {
                LoadLevel("title");
            }
            else if(btnp.reset) 
            {
                LoadLevel(CURRENT_LVL, true);
            }
            else if(btnp.space) 
            {
                if(this.endScreenOn)
                {
                    this.continued = true;
                    this.endScreen.Collapse();
                    this.CreateNewEndScreenBox();
                }

                this.pause = false;
                this.endScreenOn = false;
                this.pauseMenu.Show(false);
            }
        }
    }

    MouseMove(x, y)
    {
        if(this.trackMouse)
        {
            for(var i = 0; i < this.hovers.length; i ++ )
            {
                this.hovers[i].Hover(this.Overlap(this.hovers[i], x, y));
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

            if(!clicked) this.SetSelected(null);
        }
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
            else if(manager.CompareTags(evt, "ELECTRON", "POWERED"))
            {
                //consoleLog("POWERED COLLISION");
                var electron = manager.BodyWithTag(evt, "ELECTRON");
                var powered = manager.BodyWithTag(evt, "POWERED");

                electron.obj.ChargeComponent(powered.obj);
            }
            else if(manager.CompareTags(evt, "ELECTRON", "BATTERY"))
            {
                //console.log("BATTERY COLLISION");
                var electron = manager.BodyWithTag(evt, "ELECTRON");

                electron.obj.Charge();
            }
            else if(manager.CompareTags(evt, "ELECTRON", "POWERED_ALT"))
            {
                var electron = manager.BodyWithTag(evt, "ELECTRON");
                var powered = manager.BodyWithTag(evt, "POWERED_ALT");

                electron.obj.SetContact(powered.obj);
            }
            else if(manager.CompareTags(evt, "ELECTRON", "ELECTRON"))
            {
                manager.QueueSound(SFX.electronCollision);

                evt.bodyA.obj.Destroy();
                evt.bodyB.obj.Destroy();
            }
            else if(manager.CompareTags(evt, "ELECTRON", "WIRE_SWITCH"))
            {
                var electron = manager.BodyWithTag(evt, "ELECTRON");
                var wireSwitch = manager.BodyWithTag(evt, "WIRE_SWITCH");

                if(!wireSwitch.obj.AllowPassage(electron.obj))
                {
                    manager.QueueSound(SFX.electronLost);
                    electron.obj.Destroy();
                }
            }
            else if(manager.CompareTags(evt, "ELECTRON", "DIODE"))
            {
                var electron = manager.BodyWithTag(evt, "ELECTRON");
                var diode = manager.BodyWithTag(evt, "DIODE");

                consoleLog("Diode collision!");

                if(!diode.obj.AllowPassage(electron.obj))
                {
                    consoleLog("Remove electron charge!");

                    electron.obj.RemoveCharge();
                }

            }
        });

        this.phys.on("endContact", function(evt)
        {
            if(manager.CompareTags(evt, "ELECTRON", "DANGER_WIRE"))
            {
                var electron = manager.BodyWithTag(evt, "ELECTRON");
                var dangerWire = manager.BodyWithTag(evt, "DANGER_WIRE");

                if(!dangerWire.obj.ElectronIsSafe(electron.obj))
                {
                    manager.QueueSound(SFX.electronLost);
                    electron.obj.Destroy();
                }
            }
        });

        this.phys.on("postStep", function(evt)
        {
            manager.UpdateLoop(manager.deltaTime);
        });
    }

    AddClickable(clickable)
    {
        this.clickables.push(clickable);
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

    AddBulb(bulb)
    {
        this.bulbs.push(bulb);
    }

    AddElectron(electron)
    {
        this.electrons.push(electron);
    }

    RemoveElectron(electron)
    {
        for(var i = 0; i < this.electrons.length; i ++)
        {
            if(this.electrons[i] === electron)
            {
                this.electrons.splice(i, 1);
                this.electronsLost ++;
                break;
            }
        }

        this.CheckEndGame();
    }

    CheckEndGame()
    {
        consoleLog("===== ENDGAME CHECK =====");
        if(this.canShowEnd && this.endScreenOn === false)
        {
            var hasCrossedElectronThreshold = ( (this.electronLossThreshold > 0) && (this.electronsLost >= this.electronLossThreshold) );

            consoleLog("")

            var anyBatteryDepleted = false;
            var gameLost = false;

            for(var i = 0; i < this.batteries.length; i ++)
            {
                if(this.batteries[i].BatteryDepleted())
                {
                    anyBatteryDepleted = true;
                    gameLost = true;
                    break;
                }
            }
            
            if(!gameLost && (this.electrons.length === 0 || (hasCrossedElectronThreshold && this.continued === false )))
            {
                var chargeRemaining = false;

                for(var i = 0; i < this.batteries.length; i ++)
                {
                    if(this.batteries[i].HasChargesLeft())
                    {
                        chargeRemaining = true;
                        break;
                    }
                }

                consoleLog("Charge remaining: " + chargeRemaining);
                consoleLog("Electron Threshold: " + hasCrossedElectronThreshold);
                consoleLog("Any battery depleted: " + anyBatteryDepleted);

                if(!chargeRemaining || (hasCrossedElectronThreshold && this.continued === false))
                {
                    gameLost = true;
                }
            }

            if(gameLost)
            {
                this.pause = true;
                consoleLog("Game over!");
                this.QueueSound(SFX.defeat, 0.5);
                this.endScreen.ShowScreen(false, anyBatteryDepleted ? 0 : this.electrons.length);
                this.endScreenOn = true;
            }
            else if(this.AllBulbsLit()) 
            {
                consoleLog("You Win!");
                this.QueueSound(SFX.victory, 0.5);
                this.endScreen.ShowScreen(true);
                this.endScreenOn = true;
            }
        }
    }

    AllBulbsLit()
    {
        var allLit = true;

        for(var i = 0; i < this.bulbs.length; i ++)
        {
            if(!this.bulbs[i].IsLit())
            {
                allLit = false;
                break;
            }
        }

        return allLit;
    }

    AddBattery(battery)
    {
        this.batteries.push(battery);
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

    RemoveRender(renderer, log)
    {
        for(var i = 0; i < this.renderers.length; i ++)
        {
            if(this.renderers[i] === renderer)
            {
                this.renderers.splice(i, 1);
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
                this.updates.splice(i, 1);
                break;
            }
        }
    }

    AddAnimateFunctions(object)
    {
        object.Animate = function(deltaTime)
        {
            if(object.currentAnimation)
            {
                object.frameTimer += deltaTime;
    
                if(object.frameTimer >= object.currentAnimation.frameTime)
                {
                    //consoleLog("CHANGE FRAME");
                    object.frameTimer -= object.currentAnimation.frameTime;
                    object.currentFrame = (object.currentFrame + 1) % object.currentAnimation.frames.length;
    
                    //consoleLog("FRAME: " + this.currentFrame + " / " + this.currentAnimation.frames.length);
    
                    if(object.currentFrame === 0 && object.loopAnimation === false)
                    {
                        object.AnimationFinished(object.currentAnimation);
                    }
                    else
                    {
                        object.UpdateFrame();
                    }
                }
            }
        }

        object.SetAnimation = function(animName, loops)
        {
            object.loopAnimation = loops;
            object.currentAnimation = getAnimation(animName);
            object.currentFrame = 0;
            object.frameTimer = 0;

            object.UpdateFrame();
        }
    }

    Render()
    {
        paper(this.bgColour);
        cls();

        if(this.map) this.map.draw(0, 0);

        for(var i = 0; i < this.renderers.length; i ++)
        {
            if(!this.renderers[i].hide)
            {
                this.renderers[i].Draw();
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

            if(this.phys) this.phys.step(deltaTime, deltaTime, 20);
            else this.UpdateLoop(deltaTime);
        }

        if(this.soundQueue.length > 0)
        {
            //consoleLog(this.soundQueue);

            this.soundQueue[0].delay -= deltaTime;

            if(this.soundQueue[0].delay <= 0)
            {
                //consoleLog("PLAY SOUND: " + this.soundQueue[0].sound );
                sfx(this.soundQueue[0].sound);
                this.soundQueue.splice(0, 1);
            }
        }
    }
}
