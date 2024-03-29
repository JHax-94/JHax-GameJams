import MapDeteriorator from "./MapDeteriorator";

export default class EdgeDeteriorator extends MapDeteriorator
{
    constructor()
    {
        super();
    }    
    
    SetTilesToDeteriorate(map)
    {
        let floorTiles = map.find(this.floorTileIndex);

        let detList = [];
        for(let i = 0; i < floorTiles.length; i ++)
        {
            let ft = floorTiles[i];

            let up = map.get(ft.x, ft.y - 1);
            let right = map.get(ft.x + 1, ft.y);
            let left = map.get(ft.x -1, ft.y);
            let down = map.get(ft.x, ft.y + 1);
            /*
            consoleLog(`ADJACENT TILES to (${ft.x}, ${ft.y})`);
            consoleLog(up);
            consoleLog(right);
            consoleLog(left);
            consoleLog(down);*/

            if(!this.IsFloorTile(up) || !this.IsFloorTile(right) || !this.IsFloorTile(left) || !this.IsFloorTile(down))
            {
                detList.push(ft);
            }
        }

        for(let i = 0; i < detList.length; i ++)
        {
            let ft = detList[i];
            map.set(ft.x, ft.y, this.damagedTileIndex, false, false, false, false, false);
        }
    }



}