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
        /*
        consoleLog("COMPARE TAGS: " + tag1 + ", " + tag2);
        consoleLog(evt);
        */
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
    }

    PreSolveEvents(container, manager, evt)
    {
        
    }

    EndContactEvents(container, manager, evt)
    {
        
    }
}