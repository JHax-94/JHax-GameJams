import EndScreen from './EndScreen.js';
import { consoleLog, p2, UP, RIGHT, DOWN, LEFT, CURRENT_LVL } from './main.js';

export default class EntityManager
{
    constructor(noPhys)
    {
        this.canShowEnd = CURRENT_LVL !== "title";
        this.bgColour = 1;
        this.phys = (!noPhys) ? new p2.World({gravity: [0, 0]}) : null; 
        this.selector = null;
        this.map = null;
        this.renderers = [];
        this.updates = [];

        this.endScreenOn = false;

        this.hovers = [];
        this.clickables = [];

        this.electrons = [];
        this.batteries = [];
        this.bulbs = [];

        this.endScreen = new EndScreen(
            { tileX: 5, tileY: 3, tileW: 5, tileH: 2}, 
            { pos: { tileX: 6, tileY: 3.1 }, winText: "Congratulations!", loseText: "Game Over!" },
            { pos: { tileX: 6, tileY: 4 }, text: "Press Esc to"},
            { pos: { tileX: 6, tileY: 4.5 }, text: "return to menu"},
            { win: { background: 3, foreground: 7 }, lose: { background: 12, foreground: 9 }});

        this.trackMouse = false;

        this.selected = null;

        if(this.phys) this.SetupPhys();
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
        if(!this.endScreenOn)
        {
            var dir = -1;

            if(btn.up) dir = UP;
            else if(btn.right) dir = RIGHT;
            else if(btn.down) dir = DOWN;
            else if(btn.left) dir = LEFT;

            if(dir >= 0 && this.selected !== null)
            {
                if(this.selected.Input)
                {
                    this.selected.Input(dir);
                }
            }
        }
    }

    MouseMove(x, y)
    {
        if(this.trackMouse)
        {
            for(var i = 0; i < this.hovers.length; i ++ )
            {
                this.hovers[i].hover = this.Overlap(this.hovers[i], x, y);
            }
        }
    }

    MouseClick(x, y)
    {
        if(!this.endScreenOn)
        {
            var clicked = false;

            for(var i = 0; i < this.clickables.length; i ++)
            {
                if(this.Overlap(this.clickables[i], x, y))
                {
                    this.clickables[i].Click();

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
                electron.obj.ChargeComponent(powered.obj);
            }
            else if(manager.CompareTags(evt, "ELECTRON", "ELECTRON"))
            {
                evt.bodyA.obj.Destroy();
                evt.bodyB.obj.Destroy();
            }
            else if(manager.CompareTags(evt, "ELECTRON", "WIRE_SWITCH"))
            {
                var electron = manager.BodyWithTag(evt, "ELECTRON");
                var wireSwitch = manager.BodyWithTag(evt, "WIRE_SWITCH");

                if(!wireSwitch.obj.AllowPassage(electron.obj))
                {
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
                break;
            }
        }

        this.CheckEndGame();
    }

    CheckEndGame()
    {
        if(this.canShowEnd)
        {
            if(this.electrons.length === 0)
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

                if(!chargeRemaining)
                {
                    consoleLog("Game over!");
                    this.endScreen.ShowScreen(false);
                    this.endScreenOn = true;
                }
            }
            else 
            {
                if(this.AllBulbsLit())
                {
                    consoleLog("You Win!");
                    this.endScreen.ShowScreen(true);
                    this.endScreenOn = true;
                }
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
                this.updates.splice(i, 1);
                break;
            }
        }
    }

    Render()
    {
        paper(this.bgColour);
        cls();

        if(this.map) this.map.draw(0, 0);

        for(var i = 0; i < this.renderers.length; i ++)
        {
            this.renderers[i].Draw();
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
        this.deltaTime = deltaTime;

        if(this.phys) this.phys.step(deltaTime, deltaTime, 20);
        else this.UpdateLoop(deltaTime);
    }
}
