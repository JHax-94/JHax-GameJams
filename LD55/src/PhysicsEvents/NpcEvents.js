import { consoleLog } from "../main";
import PhysEventRegistry from "./PhysEventRegistry";

export default class NpcEvents extends PhysEventRegistry
{
    constructor() { super(); }

    Begin_NpcWorkstation_Check(container, manager, evt) { return manager.CompareTags(evt, "NPC", "WORKSTATION"); }
    Begin_NpcWorkstation_Resolve(container, manager, evt)
    {
        let workstationBody = container.BodyWithTag(evt, "WORKSTATION");
        let npcBody = container.BodyWithTag(evt, "NPC");
        
        let npc = npcBody.obj;
        let workstation = workstationBody.obj;

        npc.ProcessWorkstationCollision(workstation);
    }

}