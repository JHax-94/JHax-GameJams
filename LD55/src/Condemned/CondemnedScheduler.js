import { consoleLog } from "../main";

export default class CondemnedScheduler
{
    constructor(levelObject)
    {
        this.floors = levelObject.GetObjectList("Floor");
        this.workstations = levelObject.GetObjectList("Workstation");

        this.OrderFloors();
        this.EstablishWorkstationFloorConnections();

        consoleLog("Workstation Setup complete:");
        consoleLog(this);        
    }   

    OrderFloors()
    {
        this.floors = this.floors.sort((floorA, floorB) => floorA.phys.position[1] - floorB.phys.position[1]);

        for(let i = 0; i < this.floors.length; i ++)
        {
            this.floors[i].floorNumber = i;
        }

        consoleLog("Ordered Floors:");
        consoleLog(this.floors);
    }

    EstablishWorkstationFloorConnections()
    {
        for(let i = 0; i < this.workstations.length; i ++)
        {
            let ws = this.workstations[i];

            let wsY = ws.phys.position[1];


            let belowFloor = null;
            let aboveFloor = null;

            for(let f = 0; f < this.floors.length; f ++)
            {
                let floor = this.floors[f];

                if(floor.floorY < wsY)
                {
                    aboveFloor = floor;
                }

                if(floor.floorY > wsY)
                {
                    belowFloor = floor;
                }

                if(belowFloor || f === this.floors.length - 1)
                {
                    aboveFloor.AddWorkstation(ws);
                    break;
                }
            }
        }
    }

    BuildCondemned()
    {
        let condemned = levelObject.levelData.condemned;

        consoleLog("Condemned for this level:");
        consoleLog(condemned);
    }
}