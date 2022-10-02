import MapDeteriorator from "./MapDeteriorator";

export default class RandomEdgeDeteriorator extends MapDeteriorator
{
    constructor()
    {
        super();

        this.minTilesPerc = 0.25,
        this.maxTilesPerc = 0.75
    }
    
    SetTilesToDeteriorate(map)
    {
        let floorTiles = map.find(this.floorTileIndex);

        let edgeList = [];
        for(let i = 0; i < floorTiles.length; i ++)
        {
            let ft = floorTiles[i];

            let up = map.get(ft.x, ft.y - 1);
            let right = map.get(ft.x + 1, ft.y);
            let left = map.get(ft.x -1, ft.y);
            let down = map.get(ft.x, ft.y + 1);

            if(!this.IsFloorTile(up) || !this.IsFloorTile(right) || !this.IsFloorTile(left) || !this.IsFloorTile(down))
            {
                edgeList.push(ft);
            }
        }

        let detList = [];

        let minBound = Math.ceil(edgeList.length * this.minTilesPerc);
        let maxBound = Math.ceil(edgeList.length * this.maxTilesPerc);

        let deteriorateCount = random(maxBound - minBound + 1) + minBound;

        for(let i = 0; i < deteriorateCount; i ++)
        {
            let index = random(edgeList.length);

            detList.push(edgeList[index]);

            edgeList.splice(index, 1);

            if(edgeList.length === 0)
            {
                break;
            }
        }
        
        for(let i = 0; i < detList.length; i ++)
        {
            let ft = detList[i];
            map.set(ft.x, ft.y, this.damagedTileIndex, false, false, false, false, false);
        }
    }
        

}