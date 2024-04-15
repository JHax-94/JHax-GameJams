import { start } from "tina";
import { AUDIO, consoleLog } from "../main";
import CondemnedSoul from "./CondemnedSoul";
import FloorLayer from "../Floors/FloorLayer";
import { CONDEMNED_STATE } from "../Enums/CondemnedState";
import { CONDEMNED_MARK } from "../Enums/CondemnedMark";

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

        this.returnDoors = levelObject.GetObjectList("ReturnDoor");

        




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

        this.workFinished = false;

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

    CheckForLevelEnd()
    {
        consoleLog("---- CHECK LEVEL END ----");

        let stillWorkingCount = this.MarkedWorkers(CONDEMNED_MARK.WORKING);
        consoleLog(`Still working: ${stillWorkingCount}`);

        if(stillWorkingCount === 0)
        {
            consoleLog("SHOW DOORS!");
            for(let i = 0; i < this.returnDoors.length; i ++)
            {
                this.returnDoors[i].Show();

                this.workFinished = true;

                if(this.completedTasks.length === this.allTasks.length)
                {
                    AUDIO.PlayFx("QuotaFilled");
                }
                else 
                {
                    AUDIO.PlayFx("WorkComplete");
                }
            }
        }
    }

    TaskCompleted(task)
    {
        consoleLog(">>>> TASK COMPLETED");
        consoleLog(task);

        if(this.completedTasks.findIndex(ct => ct === task) < 0 && this.allTasks.findIndex(at => at === task) >= 0)
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
        consoleLog("-- ADDING BOUNDS TO ELEVATORS ---")

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
                //consoleLog(`Add WS (${ws.phys.position[0]}, ${ws.phys.position[1]}) to Floor ${floor.floorNumber} (${floor.phys.position[0]}, ${floor.phys.position[1]})`);
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

    PlotRouteToFloor(forObj, fromFloor, toFloor, checkedElevators = null)
    {
        let isRootCall = false;
        let log = true;

        

        if(checkedElevators === null)
        {
            isRootCall = true;
            checkedElevators = [];
        }


        if(isRootCall) consoleLog( "=========================================================");
        consoleLog(`== Plot Route from floor ${fromFloor} to floor ${toFloor} ==`);
        consoleLog("== Elevators already checked");
        consoleLog(checkedElevators);

        let elevatorsToTargetFloor = this.FindElevatorsStoppingAtFloor(toFloor);

        consoleLog(`== Elevators stopping at floor: ${toFloor}`);
        consoleLog(elevatorsToTargetFloor);

        let routeCandidates = [  ];

        for(let i = 0; i < elevatorsToTargetFloor.length; i ++)
        {
            let index = checkedElevators.findIndex(et => et === elevatorsToTargetFloor[i]);

            if(index < 0)
            {
                /*consoleLog("= Elevator hasn't been checked yet, create route candidate for:");
                consoleLog(elevatorsToTargetFloor[i]);*/

                routeCandidates.push({
                    target: elevatorsToTargetFloor[i],
                    from: fromFloor,
                    toFloor: toFloor,
                    route: null
                });
            }
        }

        if(log)
        {
            /*consoleLog(`Starting route candidates to target floor: ${toFloor}`);
            consoleLog(routeCandidates);*/
        }

        let routeAtLevelFound = false;

        for(let i = 0; i < routeCandidates.length; i ++)
        {
            let route = [];

            let elevator = routeCandidates[i].target;

            consoleLog("Check to add elevator:");
            consoleLog(elevator);

            if(elevator.StopsAtFloor(fromFloor))
            {
                consoleLog(`Root from source floor found!`);
                route.push(elevator);
                routeAtLevelFound = true;
            }
            else if(!routeAtLevelFound)
            {
                //consoleLog("--- Add to checked elevators ---");
                checkedElevators.push(elevator);
                //consoleLog(checkedElevators);

                let stops = elevator.StopsAtFloors();

                for(let j = 0; j < stops.length; j ++)
                {
                    let subRoute = this.PlotRouteToFloor(forObj, fromFloor, stops[j], checkedElevators);

                    if(subRoute && subRoute.length > 0)
                    {
                        consoleLog(`=Sub Route found from: ${fromFloor} to ${stops[j]}`);
                        consoleLog(subRoute);
                        consoleLog("=Current Route");
                        consoleLog(route);

                        for(let i = 0; i < subRoute.length; i ++)
                        {
                            route.push(subRoute[i]);
                        }
                        
                        if(route.findIndex(re => re === elevator) < 0)
                        {
                            route.push(elevator);
                        }

                        routeAtLevelFound = true;

                        consoleLog("Add sub route to main route:");
                        consoleLog([...route]);

                        break;
                    }
                }
            }

            if(routeAtLevelFound)
            {
                consoleLog(`== ROUTE FROM ${fromFloor} to ${toFloor} FOUND ==`);
                consoleLog([...route]);
                routeCandidates[i].route = route;
            }
        } 

        let returnRoute = null;

        if(routeCandidates.length > 0)
        {
            if(isRootCall)
            {
                consoleLog("=== FIND FINAL ROUTE FROM CANDIDATES ===");
                consoleLog(routeCandidates);

                let closestStart = null;

                let shortestRoutes = {
                    length: null,
                    routes: []
                };

                for(let i = 0; i < routeCandidates.length; i ++)
                {
                    if(routeCandidates[i].route && routeCandidates[i].route.length > 0)
                    {
                        let addRoute = false;

                        if(shortestRoutes.length === null)
                        {
                            addRoute = true;
                        }
                        else if(routeCandidates[i].route.length <= shortestRoutes.length)
                        {
                            addRoute = true;
                        }

                        if(addRoute)
                        {
                            if(shortestRoutes.length !== null && routeCandidates[i].route.length < shortestRoutes.length)
                            {
                                shortestRoutes.routes = [];
                            }

                            shortestRoutes.length = routeCandidates[i].route.length;
                            shortestRoutes.routes.push(routeCandidates[i]);
                        }
                    }
                }

                routeCandidates = shortestRoutes.routes;

                for(let i = 0; i < routeCandidates.length; i ++)
                {
                    if(routeCandidates[i].route && routeCandidates[i].route.length > 0)
                    {
                        let startPoint = routeCandidates[i].route[0];

                        consoleLog(`Look for summoner on floor: ${fromFloor}`);



                        let startX = startPoint.GetSummonerOnFloor(fromFloor).phys.position[0];

                        let forX = forObj.phys.position[0];

                        let distToStart = Math.abs(startX - forX);

                        routeCandidates[i].distToStart = distToStart;   
                        
                        if(closestStart === null || distToStart < routeCandidates[closestStart].distToStart)
                        {
                            closestStart = i;
                        }
                    }
                }

                returnRoute = routeCandidates[closestStart].route;

                consoleLog(`Final route:`);
                consoleLog([...returnRoute]);
            }
            else
            {
                consoleLog("-- Best partial route from candidates: --")
                consoleLog(routeCandidates)

                let shortestRoute = routeCandidates[0];

                for(let i = 1; i < routeCandidates.length; i ++)
                {
                    if(routeCandidates[i].route && routeCandidates[i].route.length > 0 && routeCandidates[i].route.length < shortestRoute.route.length)
                    {
                        shortestRoute = routeCandidates[i];
                    }
                }
                returnRoute = shortestRoute.route;
            }
        }
        consoleLog("==== Returning route ====");
        consoleLog(returnRoute)

        if(isRootCall)
        {
            if(isRootCall) consoleLog( "=========================================================");
        }

        return returnRoute;
    }
}