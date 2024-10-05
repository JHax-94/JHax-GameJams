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
        let bug = container.BodyWithTag(evt, "PLAYER_BUG");
        let hive = container.BodyWithTag(evt, "HIVE");

        bug.obj.StructureTouched(hive.obj);
    }

    Begin_BugPerception_Check(container, manager, evt) 
    { 
        return manager.CompareTags(evt, "PLAYER_PERCEPTION", "ENEMY_BUG") || manager.CompareTags(evt, "ENEMY_PERCEPTION", "PLAYER_BUG");
    }
    Begin_BugPerception_Resolve(container, manager, evt)
    {
        let perceiver = manager.GetPerceivingBug(container, evt);
        let perceived = manager.GetPerceivedBug(container, evt);

        if(perceiver && perceived)
        {
            perceiver.obj.scout.PerceiveBug(perceived.obj);
        }
        else
        {
            consoleLog("Not like for like perception");
            consoleLog(evt);
        }
    }

    Begin_BugOnBug_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER_BUG", "ENEMY_BUG"); }
    Begin_BugOnBug_Resolve(container, manager, evt)
    {
        let playerBug = container.BodyWithTag(evt, "PLAYER_BUG");
        let enemyBug = container.BodyWithTag(evt, "ENEMY_BUG");

        playerBug.obj.ProcessHitWith(enemyBug.obj);

    }

}