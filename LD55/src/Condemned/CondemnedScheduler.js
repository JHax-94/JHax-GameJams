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
        this.elevators = levelObject.GetObjectList("Elevator");
        this.summoners = levelObject.GetObjectList("ElevatorSummoner");
        this.bounds = levelObject.GetObjectList("ElevatorBounds");

        this.condemned = [];

        this.OrderFloors();
        this.FindSummonersAlongBounds();
        this.AddBoundsToElevators()
    
        this.EstablishWorkstationFloorConnections();
        this.EstablishSummonerFloorConnections();

        //this.EstablishSummonerElevatorConnections();

        consoleLog("Workstation Setup complete:");
        consoleLog(this);        

        this.BuildCondemned();
    }   

    FindSummonersAlongBounds()
    {
        for(let i = 0; i < this.summoners.length; i ++)
        {
            let s = this.summoners[i];

            for(let j = 0; j < this.bounds.length; j ++)
            {
                let b = this.bounds[j];

                if(b.AdjacentToSummoner(s))
                {
                    b.AddSummonerToBounds(s);
                    break;
                }
            }
        }
    }

    AddBoundsToElevators()
    {
        for(let i = 0; i < this.elevators.length; i ++)
        {
            let e = this.elevators[i];
            let isBound = false;

            for(let j = 0; j < this.bounds.length; j ++)
            {
                let b = this.bounds[j];

                if(b.ContainsElevator(e))
                {
                    e.AddBounds(b);
                    isBound = true;
                    break;
                }
            }

            if(isBound) break;

        }
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

    GetFloorForPhysObject(physObj, log)
    {
        if(log)
        {
            consoleLog("Find floor for obj: ");
            consoleLog(physObj)
        }

        let poy = physObj.phys.position[1];

        if(log)
        {
            consoleLog(`Y=${poy}`);
        }

        let belowFloor = null;
        let aboveFloor = null;

        let returnFloor = null;

        for(let f = 0; f < this.floors.length; f ++)
        {
            let floor = this.floors[f];

            if(log)
            {
                consoleLog(`Comparing Y values: PhysObj: ${poy} - Floor ${floor.floorNumber}: ${floor.floorY}`);
            }

            if(floor.floorY <= poy)
            {
                if(log) consoleLog(`Phys object above floor: ${floor.floorNumber}`);
                aboveFloor = floor;
            }

            if(floor.floorY > poy)
            {
                if(log) consoleLog(`Phys object below floor: ${floor.floorNumber}`);
                belowFloor = floor;
            }

            if(belowFloor || f === this.floors.length - 1)
            {
                if(log)
                {
                    consoleLog("Floor found:");
                    consoleLog(aboveFloor)
                }
                
                returnFloor = aboveFloor;
                break;
            }
        }

        return returnFloor;
    }

    EstablishWorkstationFloorConnections()
    {
        for(let i = 0; i < this.workstations.length; i ++)
        {
            let ws = this.workstations[i];
            let floor = this.GetFloorForPhysObject(ws);
            
            if(!floor)
            {
                console.error("No Suitable floor found for workstation:");
                consoleLog(ws);
            }

            floor.AddWorkstation(ws);
        }
    }

    EstablishSummonerFloorConnections()
    {
        for(let i = 0; i < this.summoners.length; i ++)
        {
            let summ = this.summoners[i];
            let floor = this.GetFloorForPhysObject(summ);

            if(!floor)
            {
                console.error("No Suitable floor found for summoner:");
                consoleLog(summ);
            }

            floor.AddSummoner(summ);
        }
    }

    EstablishSummonerElevatorConnections()
    {

    }

    GetTargetWorkstation(scheduleItem, log)
    {
        if(log)
        {
            consoleLog("Check for schedule item station:");
            consoleLog(scheduleItem);
        }

        let workstation = null;

        let floor = this.floors[scheduleItem.floor];
        
        if(floor)
        {
            workstation = floor.workstations[scheduleItem.workstation];

            if(!workstation) console.error(`No workstation ${scheduleItem.workstation} on floor ${scheduleItem.floor}`);
        }
        else
        {
            console.error(`No floor with number: ${scheduleItem.floor}`);
        }

        return workstation;
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

            let condemnedSoul = new CondemnedSoul(startTile, condemnedData[i], this);
            this.condemned.push(condemnedSoul);
        }
    }

    FindElevatorsStoppingAtFloor(floorNumber)
    {
        let eligibleElevators = [];

        for(let i = 0; i < this.elevators.length; i ++)
        {
            if(this.elevators[i].StopsAtFloor(floorNumber))
            {
                eligibleElevators.push(this.elevators[i]);
            }            
        }

        return eligibleElevators;
    }

    FindButtonForElevator(targetElevator, currentFloorNumber, log)
    {
        if(log)
        {
            consoleLog(`Find button on floor ${currentFloorNumber} for elevator:`);
            consoleLog(targetElevator);
        }
        
        let summoner = targetElevator.GetSummonerOnFloor(currentFloorNumber);

        return summoner;
    }

    PlotRouteToFloor(fromFloor, toFloor, log)
    {
        let elevatorsToTargetFloor = this.FindElevatorsStoppingAtFloor(toFloor);

        if(log)
        {
            consoleLog(`Elevators stopping at target floor: ${toFloor}`);
            consoleLog(elevatorsToTargetFloor);
        }

        let route = [];

        for(let i = 0; i < elevatorsToTargetFloor.length; i ++)
        {
            let elevator = elevatorsToTargetFloor[i];
            consoleLog(`Check if elevator stops at source floor: ${fromFloor}`);

            if(elevator.StopsAtFloor(fromFloor))
            {
                route.push(elevator);
            }
        }

        if(route.length > 0)
        {
            consoleLog(`Route from floor ${fromFloor} to ${toFloor}:`);
            consoleLog(route);
        }
        else
        {
            console.error(`Unabled to find route from floor ${fromFloor} to ${toFloor}`);
        }
        
        return route;
    }
}