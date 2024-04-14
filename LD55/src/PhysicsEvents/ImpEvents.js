import { consoleLog } from "../main";
import PhysEventRegistry from "./PhysEventRegistry";

export default class ImpEvents extends PhysEventRegistry
{
    constructor()
    {
        super();
    }

    Begin_ImpGround_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER", "FLOOR"); }
    Begin_ImpGround_Resolve(container, manager, evt) 
    {
        if(!container.impEvents) container.impEvents = {};

        let impBody = container.BodyWithTag(evt, "PLAYER");
        let floorBody = container.BodyWithTag(evt, "FLOOR");

        if(floorBody.position[1] > impBody.position[1])
        {
            container.impEvents.passthrough = floorBody;
        }
    }

    End_ImpGround_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER", "FLOOR"); }
    End_ImpGround_Resolve(container, manager, evt) 
    {
        if(!container.impEvents) container.impEvents = {};
        let impBody = container.BodyWithTag(evt, "PLAYER");
        let floorBody = container.BodyWithTag(evt, "FLOOR");

        if(floorBody === container.impEvents.passthrough)
        {
            container.impEvents.passthrough = null;
        }
    }

    PreSolve_ImpGround_Check(container, manager, evt) { return true; }
    PreSolve_ImpGround_Resolve(container, manager, evt)
    {
        if(!container.impEvents) container.impEvents = {};

        if(container.impEvents.passthrough)
        {
            for(let i = 0; i < evt.contactEquations.length; i ++)
            {
                let eq = evt.contactEquations[i];

                if(eq.bodyA.tag === "PLAYER" && eq.bodyB === container.impEvents.passthrough || eq.bodyA === container.impEvents.passthrough && eq.bodyB.tag === "PLAYER")
                {
                    eq.enabled = false;
                }
            }

            for(let i = 0; i < evt.frictionEquations.length; i ++)
            {
                let eq = evt.frictionEquations[i];

                if(eq.bodyA.tag === "PLAYER" && eq.bodyB === container.impEvents.passthrough || eq.bodyA === container.impEvents.passthrough && eq.bodyB.tag === "PLAYER")
                {
                    eq.enabled = false;
                }
            }
        }
    }

    Begin_ImpDoor_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER", "DOOR"); }
    Begin_ImpDoor_Resolve(container, manager, evt)
    {
        let imp = container.BodyWithTag(evt, "PLAYER");
        let door = container.BodyWithTag(evt, "DOOR");
        consoleLog("BEGIN DOOR");

        imp.obj.door = door.obj;
    }

    End_ImpDoor_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER", "DOOR"); }
    End_ImpDoor_Resolve(container, manager, evt)
    {
        let imp = container.BodyWithTag(evt, "PLAYER");
        let door = container.BodyWithTag(evt, "DOOR");

        consoleLog("END DOOR");

        if(imp.obj.door === door.obj)
        {
            imp.obj.door = null;
        }
    }
}