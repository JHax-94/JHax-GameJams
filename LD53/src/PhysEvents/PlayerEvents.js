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
}