import p2 from "p2";
import Clock from "./Clock";
import { consoleLog, EM, PIXEL_SCALE } from "./main";

export default class PhysicsContainer
{
    constructor(manager)
    {
        consoleLog("Constructing physics container...");

        this.materials = 
        {
            playerMaterial: new p2.Material(),
            wallMaterial: new p2.Material(),
            missileMaterial: new p2.Material()
        };

        manager.phys.addContactMaterial(new p2.ContactMaterial(this.materials.playerMaterial, this.materials.wallMaterial, {
            restitution: 1.0,
            stiffness: Number.MAX_VALUE
        }));
        
        let container = this;

        manager.phys.on("beginContact", function (evt)
        {
            container.BeginContactEvents(container, manager, evt);
        });

        manager.phys.on("endContact", function(evt)
        {
            container.EndContactEvents(container, manager, evt);
        });

        manager.phys.on('preSolve', function(evt)
        {
            container.PreSolveEvents(container, manager, evt);
        });

        manager.phys.on("postStep", function(evt)
        {
            // Update game logic after physics has finished calculating
            manager.UpdateLoop(manager.deltaTime);
        });
    }

    GetMaterial(materialName)
    {
        let material = null;

        if(this.materials[materialName])
        {
            material = this.materials[materialName];
        }

        return material;
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

    BeginContactEvents(container, manager, evt)
    {
        if(manager.CompareTags(evt, "PLAYER", "MISSILE"))
        {
            let player = manager.BodyWithTag(evt, "PLAYER");
            let missile = manager.BodyWithTag(evt, "MISSILE");

            player.obj.Kill();
            missile.obj.Explode();

            let clock = EM.GetEntity("Clock");

            clock.Pause();
        }
        else if(manager.CompareTags(evt, "PLAYER", "PICKUP"))
        {
            let player = manager.BodyWithTag(evt, "PLAYER");
            let pickup = manager.BodyWithTag(evt, "PICKUP")

            pickup.obj.Collected(player.obj);
        }
        else if(manager.CompareTags(evt, "MISSILE", "DECOY"))
        {
            let decoy = manager.BodyWithTag(evt, "DECOY");
            let missile = manager.BodyWithTag(evt, "MISSILE");
            decoy.obj.Destroy();
            missile.obj.TargetPlayer();
        }
        else if(manager.CompareTags(evt, "MISSILE", "BOULDER"))
        {
            let boulder = manager.BodyWithTag(evt, "BOULDER");

            boulder.obj.Destroy();
        }
        else if(manager.CompareTags(evt, "PLAYER", "SLOWFLOOR"))
        {
            let player = manager.BodyWithTag(evt, "PLAYER");
            let floor = manager.BodyWithTag(evt, "SLOWFLOOR");

            player.obj.AddSlowFloor(floor.obj);
        }
    }

    PreSolveEvents(container, manager, evt)
    {
        for(let i = 0; i < evt.contactEquations.length; i ++)
        {
            let eq = evt.contactEquations[i];
            if(this.playerWatch && this.playerWatch.HasStatus("Ghost"))
            {
                if(manager.CompareTags(eq, "PLAYER", "WALL"))
                {
                    eq.enabled = false;

                    let player = manager.BodyWithTag(eq, "PLAYER");
                    let wall = manager.BodyWithTag(eq, "WALL");

                    player.obj.AddOverlap(wall.obj);
                }
                else if(manager.CompareTags(eq, "PLAYER", "BOULDER"))
                {
                    eq.enabled = false;

                    let player = manager.BodyWithTag(eq, "PLAYER");
                    let boulder = manager.BodyWithTag(eq, "BOULDER");

                    player.obj.AddOverlap(boulder.obj);
                }
            }

            if(manager.CompareTags(eq, "PLAYER", "DECOY"))
            {
                eq.enabled = false;
            }
        }
    }


    EndContactEvents(container, manager, evt)
    {
        if(this.playerWatch && this.playerWatch.HasStatus("Ghost"))
        {
            if(manager.CompareTags(evt, "PLAYER", "WALL"))
            {
                let player = manager.BodyWithTag(evt, "PLAYER");
                let wall = manager.BodyWithTag(evt, "WALL");

                player.obj.RemoveOverlap(wall.obj);
            }

            if(manager.CompareTags(evt, "PLAYER", "BOULDER"))
            {
                let player = manager.BodyWithTag(evt, "PLAYER");
                let boulder = manager.BodyWithTag(evt, "BOULDER");

                player.obj.RemoveOverlap(boulder.obj);
            }
        }

        if(manager.CompareTags(evt, "PLAYER", "SLOWFLOOR"))
        {
            let player = manager.BodyWithTag(evt, "PLAYER");
            let floor = manager.BodyWithTag(evt, "SLOWFLOOR");
            
            player.obj.RemoveSlowFloor(floor.obj);
        }
    }
}