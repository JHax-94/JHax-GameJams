import { EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH, consoleLog } from "../main";

export default class GameFrame
{

    constructor()
    {
        this.renderLayer = "FRAME"

        this.x = PIXEL_SCALE * 16;
        this.y = 0;
        this.h = PIXEL_SCALE * TILE_HEIGHT;
        this.w = TILE_WIDTH * PIXEL_SCALE - this.x;

        this.titleAt = { x: 0, y: 0.5 };
        this.title = [ 
            {
                offset: 4,
                elements: [ 252, 253, 254, 255 ]
            },
            {
                offset: 0,
                elements: [ 236, 237, 237, 238 ]
            }
        ];
        

        EM.RegisterEntity(this);
    }

    DrawTitle()
    {
        for(let i = 0; i < this.title.length; i ++)
        {
            let t = this.title[i];

            for(let e = 0; e < t.elements.length; e ++)
            {
                consoleLog(`Draw title line ${i}, element: ${e}`);
                let drawAt = {
                    x: this.x + this.titleAt.x * PIXEL_SCALE + e * PIXEL_SCALE + t.offset,
                    y: this.y + this.titleAt.y * PIXEL_SCALE + i * PIXEL_SCALE
                } 

                //EM.IgnoreCamera(drawAt);

                sprite(t.elements[e], drawAt.x, drawAt.y);
            }
        }
    }

    Draw()
    {
        paper(0);
        /*consoleLog("DRAW FRAME:");
        consoleLog(this);*/

        rectf(this.x, this.y, this.w, this.h);

        this.DrawTitle();
    }


}