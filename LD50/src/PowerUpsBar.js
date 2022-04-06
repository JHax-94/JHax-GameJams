import { consoleLog, EM, getKeyboardMode, getObjectConfig, PIXEL_SCALE, SCREEN_WIDTH } from "./main";

export default class PowerUpsBar
{
    constructor(uiMap)
    {
        this.renderLayer = "OVERLAY_UI";

        this.map = uiMap;

        this.powerUpUi = {};

        let overlayConf = getObjectConfig("OverlayUi");

        this.activeStatusStart = overlayConf.activeStatusStart;

        this.activeStatusSpacing = overlayConf.activeStatusSpacing;
        this.activeStatusColumnLength = overlayConf.activeStatusColumnLength;

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
                    keyPrompt: objectMap[i].key,
                    altPrompts: objectMap[i].altPrompts
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

        pen(1);
        for(let key in this.powerUpUi)
        {
            let item = this.powerUpUi[key];
            print(item.string, item.pos.x, item.pos.y);
            if(item.keyPrompt)
            {
                let showPrompt = item.keyPrompt;

                if(item.altPrompts)
                {
                    showPrompt = item.altPrompts[getKeyboardMode()];
                }

                print(showPrompt, item.pos.x - 2.2*PIXEL_SCALE, item.pos.y);
            }
        }

        if(this.player.statuses)
        {
            let column = 0;
            let row = 0;

            for(let i = 0; i < this.player.statuses.length; i ++)
            {
                let status = this.player.statuses[i];

                pen(10);

                let base = { 
                    x: (this.activeStatusStart.x + (column * this.activeStatusSpacing.h))  * PIXEL_SCALE, 
                    y: (this.activeStatusStart.y + (row * this.activeStatusSpacing.v)) * PIXEL_SCALE 
                };
                
                row ++;

                if((row) % this.activeStatusColumnLength === 0)
                {
                    row = 0; 
                    column ++;
                }
                

                if(this.ShowStatusIcon(status))
                {
                    sprite(status.spriteIndex, base.x, base.y);
                }

                let rectHeight = status.time / status.maxTime;

                if(rectHeight < 0)
                {
                    rectHeight = 0;
                }

                let rectWidth = 0.25;

                if(rectHeight > 0)
                {
                    paper(9);
                    rectf(base.x + (1.25) * PIXEL_SCALE, base.y + Math.floor((1-rectHeight) * PIXEL_SCALE), rectWidth*PIXEL_SCALE, Math.ceil(rectHeight * PIXEL_SCALE));
                }
            }
        }
    }

    ShowStatusIcon(status)
    {
        let show = false;

        if(status.time > 0)
        {
            show = true;
        }
        else
        {
            let indicatorTime = Math.floor(Math.abs(status.time * 1.2));

            show = indicatorTime % 2 == 0;
        }

        return show;
    }
}