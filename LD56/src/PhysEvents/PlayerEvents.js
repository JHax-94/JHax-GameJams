import { consoleLog } from "../main";
import PhysEventRegistry from "./PhysEventRegistry";

export default class PlayerEvents extends PhysEventRegistry
{
    constructor()
    {
        super();
    }

    Begin_PlayerStructure_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER_SWARM", "HIVE"); }
    Begin_PlayerStructure_Resolve(container, manager, evt)
    {
        consoleLog("PLAYER HIVE COLLISION!");
        let player = container.BodyWithTag(evt, "PLAYER_SWARM");
        let hive = container.BodyWithTag(evt, "HIVE");

        let sourceStruct = player.obj.GetSourceStructure();

        if(!hive.obj.isConnected)
        {
            sourceStruct.AddTargetStructure(hive.obj);
        }

        if(hive.obj.isConnected)
        {
            player.obj.TouchedStructure(hive.obj);
        }
    }

    Begin_BugStructure_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER_BUG", "HIVE"); }
    Begin_BugStructure_Resolve(container, manager, evt)
    {
        consoleLog("BUG HIVE COLLISION!");

        let bug = container.BodyWithTag(evt, "PLAYER_BUG");
        let hive = container.BodyWithTag(evt, "HIVE");

        bug.obj.StructureTouched(hive.obj);
    }

    
}