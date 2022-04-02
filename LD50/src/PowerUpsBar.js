import { consoleLog, EM, PIXEL_SCALE, SCREEN_WIDTH } from "./main";

export default class PowerUpsBar
{
    constructor(uiMap)
    {
        this.map = uiMap;

        this.powerUpUi = {};

        this.GetPowerUpPositions();

        this.player = EM.GetEntity("Player");

        this.player.powerUpsBar = this;
        EM.RegisterEntity(this);        
    }

    GetPowerUpPositions()
    {
        let objectMap = assets.objectConfig.objectMap;

        for(let i = 0; i < objectMap.length; i ++)
        {
            let mapTiles = this.map.find(objectMap[i].index);

            if(mapTiles.length > 0)
            {
                let mapTile = mapTiles[0];

                this.powerUpUi[objectMap[i].name] = { 
                    pos: { x: (mapTile.x + 1) * PIXEL_SCALE + 2, y: (mapTile.y) * PIXEL_SCALE + 2 },
                    string: "x 0",
                    keyPrompt: objectMap[i].key
                };
                
            }
        }
    }
    
    UpdatePowerUp(name, quantity)
    {
        consoleLog(`Updating: ${name} - set to ${quantity}`);

        if(this.powerUpUi[name])
        {
            this.powerUpUi[name].string = `x ${quantity}`;
        }
    }    

    Draw()
    {
        paper(6);
        rectf(0, 0, SCREEN_WIDTH * PIXEL_SCALE, 5 * PIXEL_SCALE);
        this.map.draw(0, 0);

        for(let key in this.powerUpUi)
        {
            let item = this.powerUpUi[key];
            print(item.string, item.pos.x, item.pos.y);
            if(item.keyPrompt)
            {
                print(item.keyPrompt, item.pos.x - 2.2*PIXEL_SCALE, item.pos.y);
            }
        }

        if(this.player.statuses)
        {
            for(let i = 0; i < this.player.statuses.length; i ++)
            {
                pen(10);
                print(`${this.player.statuses[i].name}: ${this.player.statuses[i].time}`, 0, (5+i) * PIXEL_SCALE );
            }
        }
    }

}