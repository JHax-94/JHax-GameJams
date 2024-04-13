import { start } from "tina";
import { consoleLog } from "../main";
import CondemnedSoul from "./CondemnedSoul";

export default class CondemnedScheduler
{
    constructor(levelObject)
    {
        this.levelObject = levelObject;
        this.floors = levelObject.GetObjectList("Floor");
        this.workstations = levelObject.GetObjectList("Workstation");

        this.condemned = [];

        this.OrderFloors();
        this.EstablishWorkstationFloorConnections();

        consoleLog("Workstation Setup complete:");
        consoleLog(this);        

        this.BuildCondemned();
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

    GetTile(startLocation)
    {
        let floor = this.floors.find(f => f.floorNumber === startLocation.floor);

        let tile = {
            x: 0,
            y: 0
        };

        if(!floor)
        {
            console.error(`Missing Floor for floor number: ${startLocation.floor}`);
        }
        else
        {
            if(startLocation.place >= 0)
            {
                consoleLog("start by place");
                
                let placeTile = floor.GetPlaceTile(startLocation.place);

                if(placeTile)
                {
                    tile.x = placeTile.x;
                    tile.y = placeTile.y;
                }

            }
        }
        
        return tile;
    }

    BuildCondemned()
    {
        let lvlData = this.levelObject.data;
        let condemnedData = lvlData.condemned;
        
        for(let i = 0; i < condemnedData.length; i ++)
        {
            let startTile = this.GetTile(condemnedData[i].startLocation);

            let condemnedSoul = new CondemnedSoul(startTile, condemnedData[i]);
            this.condemned.push(condemnedSoul);
        }
    }
}