import { consoleLog } from "../main";
import PhysEventRegistry from "./PhysEventRegistry";

export default class BeastEvents extends PhysEventRegistry
{
    constructor() { super(); }

    Begin_BeastWhistle_Check(container, manager, evt) { return manager.CompareTags(evt, "BEAST", "WHISTLE"); }
    Begin_BeastWhistle_Resolve(container, manager, evt) 
    {
        let beastBody = manager.BodyWithTag(evt, "BEAST");
        let whistleBody = manager.BodyWithTag(evt, "WHISTLE");

        consoleLog("Entered whistle zone:");
        consoleLog(whistleBody.obj);

        whistleBody.obj.AddBeast(beastBody.obj);
    }

    End_BeastWhistle_Check(container, manager, evt) { return manager.CompareTags(evt, "BEAST", "WHISTLE"); }
    End_BeastWhistle_Resolve(container, manager, evt) 
    {
        let beastBody = manager.BodyWithTag(evt, "BEAST");
        let whistleBody = manager.BodyWithTag(evt, "WHISTLE");

        whistleBody.obj.RemoveBeast(beastBody.obj);
    }

    Begin_BeastBeast_Check(container, manager, evt) { return manager.CompareTags(evt, "BEAST", "BEAST"); }
    Begin_BeastBeast_Resolve(container, manager, evt) 
    {
        let beasts = manager.BodiesWithTag(evt, "BEAST");

        let chosenOne = random(beasts.length);

        for(let i = 0; i < beasts.length; i ++)
        {
            beasts[i].obj.ReactTo({
                stimType: "COLLISION",
                collisionWith: beasts[i==0?1:0].obj,
                chosen: chosenOne === i
            });
        }
    }

    Begin_BeastVillage_Check(container, manager, evt) { return manager.CompareTags(evt, "BEAST", "VILLAGE"); }
    Begin_BeastVillage_Resolve(container, manager, evt)
    {
        let beast = manager.BodyWithTag(evt, "BEAST");
        let village = manager.BodyWithTag(evt, "VILLAGE");

        village.obj.OfferBeast(beast.obj);
    }

    Begin_BeastObstacle_Check(container, manager, evt) { return manager.CompareTags(evt, "BEAST", "OBSTACLE"); }
    Begin_BeastObstacle_Resolve(container, manager, evt) 
    {
        let beast = manager.BodyWithTag(evt, "BEAST");
        let obstacle = manager.BodyWithTag(evt, "OBSTACLE");

        beast.obj.ReactTo({
            stimType: "COLLISION",
            collisionWith: obstacle.obj
        });
    }
}