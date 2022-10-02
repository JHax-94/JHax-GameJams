import MapDeteriorator from "./MapDeteriorator";

export default class RandomDeteriorator extends MapDeteriorator
{
    constructor()
    {
        super();

        this.minTiles = 5,
        this.maxTiles = 16
    }

    SetTilesToDeteriorate(map)
    {
        let floorTiles = map.find(this.floorTileIndex);

        let deteriorateTiles = [];

        let deteriorateCount = random(this.maxTiles - this.minTiles + 1) + this.minTiles;

        for(let i = 0; i < deteriorateCount; i ++)
        {
            let index = random(floorTiles.length);

            deteriorateTiles.push(floorTiles[index]);

            floorTiles.splice(index, 1);

            if(floorTiles.length === 0)
            {
                break;
            }
        }

        for(let i = 0; i < deteriorateTiles.length; i ++)
        {
            let ft = deteriorateTiles[i];
            map.set(ft.x, ft.y, this.damagedTileIndex, false, false, false, false, false);
        }
    }
}