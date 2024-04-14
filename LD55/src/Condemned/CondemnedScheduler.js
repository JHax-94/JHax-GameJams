import { start } from "tina";
import { consoleLog } from "../main";
import CondemnedSoul from "./CondemnedSoul";
import FloorLayer from "../Floors/FloorLayer";

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

        this.floorLayers = [];

        this.OrderFloors();
        this.FindSummonersAlongBounds();
        this.AddBoundsToElevators()
    
        this.EstablishWorkstationFloorConnections();
        this.EstablishSummonerFloorConnections();

        //this.EstablishSummonerElevatorConnections();
        this.BuildCondemned();

        this.allTasks = [];
        this.completedTasks = [];
        this.CompileTasks();

        consoleLog("Scheduler Setup complete:");
        consoleLog(this);
    }   

    MarkedWorkers(mark)
    {
        let count = 0;
        
        for(let i = 0; i < this.condemned.length; i++)
        {
            if(this.condemned[i].mark === mark)
            {
                count ++;
            }
        }

        return count;
    }

    CompileTasks()
    {
        for(let i = 0; i < this.condemned.length; i ++)
        {
            for(let j = 0; j < this.condemned[i].schedule.length; j ++)
            {
                this.allTasks.push(this.condemned[i].schedule[j]);
            }
        }
    }

    TaskCompleted(task)
    {
        if(this.completedTasks.findIndex(ct => ct === task) <= 0 && this.allTasks.findIndex(at => at === task))
        {
            this.completedTasks.push(task);
        }
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
        this.floors = this.floors.sort((floorA, floorB) => floorA.floorY - floorB.floorY);

        for(let i = 0; i < this.floors.length; i ++)
        {
            this.floors[i].floorNumber = i;
        }

        consoleLog("Ordered Floors:");
        consoleLog(this.floors);

        for(let i = 0; i < this.floors.length; i ++)
        {
            let floor = this.floors[i];

            let floorLayer = this.floorLayers.find(fl => fl.y === floor.floorY);

            if(!floorLayer)
            {
                floorLayer = new FloorLayer(this.floorLayers.length, floor.floorY);
                this.floorLayers.push(floorLayer);
            }

            floorLayer.AddFloor(floor);
        }

        consoleLog("Layered Floors:");
        consoleLog(this.floorLayers);
    }

    GetFloorLayerForPhysObject(physObj, log)
    {
        let py = physObj.phys.aabb.lowerBound[1];

        let belowLayer = null;
        let aboveLayer = null;

        let returnLayer = null;

        for(let fl = 0; fl < this.floorLayers.length; fl ++)
        {
            let layer = this.floorLayers[fl];

            if(layer.y < py)
            {
                aboveLayer = layer;
            }

            if(layer.y >= py)
            {
                belowLayer = layer;
            }

            if(belowLayer || fl === this.floorLayers.length - 1)
            {
                returnLayer = aboveLayer;
                break;
            }
        }

        return returnLayer;
    }

    GetFloorForPhysObject(physObj, log)
    {
        if(log)
        {
            consoleLog(`Find Floor for object @ (${physObj.phys.position[0]}, ${physObj.phys.position[1]})`);
        }

        let layer = this.GetFloorLayerForPhysObject(physObj, log);

        if(log)
        {
            consoleLog("Is on layer: ");
            consoleLog(layer);
        }

        let returnFloor = null;

        for(let f = 0; f < layer.floors.length; f ++)
        {
            let floor = layer.floors[f];
            
            let xPos = physObj.phys.position[0];
            let lowX = floor.phys.aabb.lowerBound[0];
            let upX = floor.phys.aabb.upperBound[0];

            if(lowX < xPos && xPos < upX)
            {
                returnFloor = floor;
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
                consoleLog(this.floorLayers);
            }
            else
            {
                consoleLog(`Add WS (${ws.phys.position[0]}, ${ws.phys.position[1]}) to Floor ${floor.floorNumber} (${floor.phys.position[0]}, ${floor.phys.position[1]})`);
            }

            floor.AddWorkstation(ws);
        }
    }

    EstablishSummonerFloorConnections()
    {
        for(let i = 0; i < this.summoners.length; i ++)
        {
            let summ = this.summoners[i];
            let floor = this.GetFloorForPhysObject(summ, true);

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


    GetLayerForFloor(floor)
    {
        let layer = this.GetLayerForFloorNumber(floor.floorNumber);

        if(!layer)
        {
            console.error(`No Layer found for floor:`);
            consoleLog(floor);
        }

        return layer;
    }

    GetLayerForFloorNumber(floorNumber)
    {
        let floorLayer = null;

        for(let i = 0; i < this.floorLayers.length; i ++)
        {
            for(let j = 0; j < this.floorLayers[i].floors.length; j++)
            {
                let checkFloorNumber = this.floorLayers[i].floors[j].floorNumber;

                if(checkFloorNumber === floorNumber)
                {  
                    floorLayer = this.floorLayers[i];
                    break;
                }
            }

            if(floorLayer)
            {
                break;
            }
        }

        if(!floorLayer)
        {
            console.error(`No layer found for floor number: ${floorNumber}`);
        }

        return floorLayer;
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
            console.error(`Unable to find route from floor ${fromFloor} to ${toFloor}`);
        }
        
        return route;
    }
}