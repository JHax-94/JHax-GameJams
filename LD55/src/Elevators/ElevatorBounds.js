import { TILE_UTILS, consoleLog } from "../main";

export default class ElevatorBounds
{
    constructor(tiles, objDef)
    {
        this.srcTiles = tiles;
        this.tileDims = TILE_UTILS.GetBlockDimensions(tiles);

        this.Setup();
    }

    Setup()
    {
        this.summoners = [];
        this.elevator = null;
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