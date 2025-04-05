import p2 from "p2";
import { consoleLog } from "./main";

export default class PhysicsContainer
{
    constructor(manager)
    {
        this.materials = 
        {
            playerMaterial: new p2.Material()
        };

        /*manager.phys.addContactMaterial(new p2.ContactMaterial(this.materials.playerMaterial, this.materials.wallMaterial, {
            restitution: 1.0,
            stiffness: Number.MAX_VALUE
        }));*/
        
        let container = this;

        this.beginContactChecks = [];
        this.endContactChecks = [];
        this.preSolveChecks = [];
        this.preSolveFrictionChecks = [];

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

    AddBeginContactEvent(evt)
    {
        this.beginContactChecks.push(evt);
    }

    AddPreSolveEvent(evt)
    {
        this.preSolveChecks.push(evt);
    }

    AddPreSolveFrictionEvent(evt)
    {
        this.preSolveFrictionChecks.push(evt);
    }

    AddEndContactEvent(evt)
    {
        this.endContactChecks.push(evt);
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


    BodyWithTag(evt, tag)
    {
        var body = null;

        if(evt.bodyA.tag === tag) body = evt.bodyA;
        else if(evt.bodyB.tag === tag) body = evt.bodyB;
        
        return body;
    }

    ContactEquationsEnabled(evt)
    {
        consoleLog("Check contact equations enabled:");

        let contactEquations = [];

        

        let enabled = false;

        for(let i = 0; i < evt.contactEquations.length; i ++)
        {
            contactEquations.push(Object.assign({}, contactEquations));

            if(evt.contactEquations[i].enabled)
            {
                enabled = true;
            }
        }

        consoleLog(contactEquations);
        consoleLog(`Return: ${enabled}`);

        return enabled;
    }

    BeginContactEvents(container, manager, evt)
    {
        /*consoleLog("Check begin contacts..");
        consoleLog(container.beginContactChecks);*/
        for(let i = 0; i < container.beginContactChecks.length; i ++)
        {
            if(container.beginContactChecks[i].CheckCondition(container, manager, evt))
            {
                container.beginContactChecks[i].Resolve(container, manager, evt);
                break;
            }
        }
    }

    PreSolveEvents(container, manager, evt)
    {
        if(evt.contactEquations)
        {
            for(let i = 0; i < evt.contactEquations.length; i ++)
            {
                let contact = evt.contactEquations[i];
                
                for(let j = 0; j < container.preSolveChecks.length; j ++)
                {
                    if(container.preSolveChecks[j].CheckCondition(container, manager, evt, contact))
                    {
                        container.preSolveChecks[j].Resolve(container, manager, evt, contact, i);
                    }
                }
            }
        }

        if(evt.frictionEquations)
        {
            for(let i = 0; i < evt.frictionEquations.length; i ++)
            {
                let contact = evt.frictionEquations[i];

                for(let j = 0; j < container.preSolveFrictionChecks.length; j ++)
                {
                    if(container.preSolveFrictionChecks[j].CheckCondition(container, manager, evt, contact))
                    {
                        container.preSolveFrictionChecks[j].Resolve(container, manager, evt, contact, i);
                    }
                }
            }
        }
    }

    EndContactEvents(container, manager, evt)
    {   
        for(let i = 0; i < this.endContactChecks.length; i ++)
        {
            if(this.endContactChecks[i].CheckCondition(container, manager, evt))
            {
                this.endContactChecks[i].Resolve(container, manager, evt);
                break;
            }
        }
    }
}