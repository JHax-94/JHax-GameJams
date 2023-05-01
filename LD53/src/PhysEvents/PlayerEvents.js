import { consoleLog } from "../main";
import PhysEventRegistry from "./PhysEventRegistry";

export default class PlayerEvents extends PhysEventRegistry
{
    constructor() { super(); }

    Begin_PlayerVillage_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER", "VILLAGE"); }
    Begin_PlayerVillage_Resolve(container, manager, evt) 
    {
        let playerBody = manager.BodyWithTag(evt, "PLAYER");
        let villageBody = manager.BodyWithTag(evt, "VILLAGE");

        villageBody.obj.TrackPlayer(playerBody.obj);
    }

    End_PlayerVillage_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER", "VILLAGE"); }
    End_PlayerVillage_Resolve(container, manager, evt) 
    {
        let playerBody = manager.BodyWithTag(evt, "PLAYER");
        let villageBody = manager.BodyWithTag(evt, "VILLAGE");

        villageBody.obj.RemovePlayer(playerBody.obj);
    }

    Begin_PlayerBait_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER", "BAIT"); }
    Begin_PlayerBait_Resolve(container, manager, evt)
    {
        let playerBody = manager.BodyWithTag(evt, "PLAYER");
        let baitBody = manager.BodyWithTag(evt, "BAIT");

        consoleLog("PLAYER BAIT START!");

        playerBody.obj.AddPickupOverlap(baitBody.obj);
    }

    End_PlayerBait_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER", "BAIT"); }
    End_PlayerBait_Resolve(container, manager, evt) 
    {
        let playerBody = manager.BodyWithTag(evt, "PLAYER");
        let baitBody = manager.BodyWithTag(evt, "BAIT");

        consoleLog("PLAYER BAIT END!");

        playerBody.obj.RemovePickupOverlap(baitBody.obj);
    }

    PreSolve_PlayerObstacle_Check(container, manager, evt, contact) { return manager.CompareTags(contact, "PLAYER", "OBSTACLE"); }
    PreSolve_PlayerObstacle_Resolve(container, manager, evt, contact, i)
    {
        let playerBody = manager.BodyWithTag(contact, "PLAYER");
        let obstacleBody = manager.BodyWithTag(contact, "OBSTACLE");
        
        if(obstacleBody.obj.obstacleType === "block" && playerBody.obj.HasPassthrough(obstacleBody))
        {
            evt.contactEquations[i].enabled = false;
        }
    }

    Begin_PlayerObstacle_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER", "OBSTACLE"); }
    Begin_PlayerObstacle_Resolve(conatiner, manager, evt)
    {
        let playerBody = manager.BodyWithTag(evt, "PLAYER");
        let obstacleBody = manager.BodyWithTag(evt, "OBSTACLE");

        if(obstacleBody.obj.obstacleType === "block")
        {
            playerBody.obj.AddPickupOverlap(obstacleBody.obj);
        }
        
    }

    End_PlayerObstacle_Check(container, manager, evt) { return manager.CompareTags(evt, "PLAYER", "OBSTACLE"); }
    End_PlayerObstacle_Resolve(container, manager, evt)
    {
        let playerBody = manager.BodyWithTag(evt, "PLAYER");
        let obstacleBody = manager.BodyWithTag(evt, "OBSTACLE");

        if(obstacleBody.obj.obstacleType === "block")
        {
            playerBody.obj.RemovePickupOverlap(obstacleBody.obj);
            playerBody.obj.RemovePassthrough(obstacleBody);
        }
    }
    
}
