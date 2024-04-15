import TriggerZone from "../PhysObjects/TriggerZone";
import { EM, TILE_UTILS, consoleLog } from "../main";

export default class ElevatorBounds
{
    constructor(tiles, objDef)
    {
        this.srcTiles = tiles;
        this.tileDims = TILE_UTILS.GetBlockDimensions(tiles);

        this.Setup();

        this.zone = new TriggerZone(this.tileDims, this, {
            tag: "ELEVATOR_BOUNDS",
            collisionGroup: 0,
            collisionMask: 0
        })
    }

    Setup()
    {
        this.summoners = [];
        this.elevator = null;
    }

    MinY()
    {
        return this.zone.phys.aabb.lowerBound[1];
    }

    MaxY()
    {
        return this.zone.phys.aabb.upperBound[1];
    }

    AdjacentToSummoner(summoner)
    {
        let sTile = summoner.srcTile;

        let adjacent = false;

        for(let i = 0; i < this.srcTiles.length; i ++)
        {
            let bTile = this.srcTiles[i];

            let testAdjacency = Math.abs(bTile.x - sTile.x) <= 1 && bTile.y === sTile.y;

            if(testAdjacency)
            {
                adjacent = true;
                break;
            }
        }

        return adjacent;
    }

    AddSummonerToBounds(summoner)
    {
        summoner.bounds = this;
        this.summoners.push(summoner);
    }
    
    ListConnectedFloors()
    {
        let floorNumbers = [];

        for(let i = 0; i < this.summoners.length; i ++)
        {
            floorNumbers.push(this.summoners[i].FloorNumber())
        }

        return floorNumbers;
    }

    

    ContainsElevator(elevator)
    {
        let elevatorContained = false;
        let tilesContained = 0;

        for(let i = 0; i < elevator.srcTiles.length; i ++)
        {
            let et = elevator.srcTiles[i];

            let matchedTile = this.srcTiles.find(st => st.x === et.x && st.y === et.y);

            if(matchedTile)
            {
                tilesContained ++;
            }
        }

        if(tilesContained === elevator.srcTiles.length)
        {
            elevatorContained = true;
        }

        return elevatorContained;
    }

}