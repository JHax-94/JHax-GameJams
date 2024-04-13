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

                if(eq.bodyA.tag === "PLAYER" && eq.bodyB === container.impEventst.passthrough || eq.bodyA === container.impEvents.passthrough && eq.bodyB.tag === "PLAYER")
                {
                    eq.enabled = false;
                }
            }
        }
    }


    

}