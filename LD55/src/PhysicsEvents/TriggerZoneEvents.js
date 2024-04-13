import { consoleLog } from "../main";
import PhysEventRegistry from "./PhysEventRegistry";

export default class TriggerZoneEvents extends PhysEventRegistry
{
    constructor() { super(); }

    Begin_TriggerZonePlayer_Check(container, manager, evt) { return manager.CompareTags(evt, "TRIGGER_ZONE", "PLAYER"); }
    Begin_TriggerZonePlayer_Resolve(container, manager, evt) 
    {
        let tzBody = container.BodyWithTag(evt, "TRIGGER_ZONE");
        let playBody = container.BodyWithTag(evt, "PLAYER");

        let tz = tzBody.obj;
        let player = playBody.obj;

        if(player.IsVisible())
        {
            tz.ObjectEntered(playBody);
        }
    }

    End_TriggerZonePlayer_Check(container, manager, evt) { return manager.CompareTags(evt, "TRIGGER_ZONE", "PLAYER"); }
    End_TriggerZonePlayer_Resolve(container, manager, evt)
    {
        let tzBody = container.BodyWithTag(evt, "TRIGGER_ZONE");
        let playBody = container.BodyWithTag(evt, "PLAYER");

        let tz = tzBody.obj;

        tz.ObjectExited(playBody);
    }

    Begin_TriggerZoneNpcQueue_Check(container, manager, evt) { return manager.CompareTags(evt, "ELEVATOR_QUEUE", "NPC"); }
    Begin_TriggerZoneNpcQueue_Resolve(container, manager, evt)
    {
        let tzBody = container.BodyWithTag(evt, "ELEVATOR_QUEUE");
        let npcBody = container.BodyWithTag(evt, "NPC");

        npcBody.obj.QueueForElevator(tzBody.obj.parent);
    }
}