import { consoleLog, EM, getObjectConfig, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH } from "./main";

export default class ControlsDisplay
{
    constructor()
    {
        this.config = getObjectConfig("ControlsDisplay");
        consoleLog("Building controls display...");
        consoleLog(this.config);

        EM.RegisterEntity(this);
    }

    /*
    Draw()
    {

        
        pen(1);
        print("Up Arrow - Move Forward", 0, (TILE_HEIGHT-3*0.75) * PIXEL_SCALE);
        print("Left Arrow - Turn Anti Clockwise", 0, 1 * (TILE_HEIGHT - 2*0.75) * PIXEL_SCALE);
        print("Right Arrow - Turn clockwise", 0, (TILE_HEIGHT - 0.75) * PIXEL_SCALE);

        print("1 - Attack", PIXEL_SCALE * TILE_WIDTH * 0.625, (TILE_HEIGHT - 3*0.75) * PIXEL_SCALE);
        print("2 - Stance Anti-Clockwise", PIXEL_SCALE * TILE_WIDTH * 0.625, (TILE_HEIGHT - 2*0.75) * PIXEL_SCALE);
        print("3 - Stance Clockwise", PIXEL_SCALE * TILE_WIDTH * 0.625, (TILE_HEIGHT - 0.75) * PIXEL_SCALE);
    }*/

    Draw()
    {
        let rp = this.config.dims;

        paper(this.config.backColour);
        pen(this.config.foreColour);

        rectf(rp.x * PIXEL_SCALE, rp.y * PIXEL_SCALE, rp.w * PIXEL_SCALE, rp.h * PIXEL_SCALE);

        for(let i = 0; i < this.config.components.length; i ++)
        {
            paper(this.config.backColour);
            pen(this.config.foreColour);

            let c = this.config.components[i];

            if(c.type === "text")
            {
                print(c.text, (rp.x + c.x) * PIXEL_SCALE, (rp.y + c.y) * PIXEL_SCALE);
            }
            if(c.type === "sprite")
            {
                sprite(c.i, (rp.x + c.x) * PIXEL_SCALE, (rp.y + c.y) * PIXEL_SCALE, c.h, c.v, c.r);
            }
            if(c.type === "rect")
            {
                paper(c.f);
                rectf((rp.x + c.x) * PIXEL_SCALE, (rp.y + c.y) * PIXEL_SCALE, c.w * PIXEL_SCALE, c.h * PIXEL_SCALE);

                if(c.b)
                {
                    pen(c.b);
                    rect((rp.x + c.x) * PIXEL_SCALE, (rp.y + c.y) * PIXEL_SCALE, c.w * PIXEL_SCALE, c.h * PIXEL_SCALE);
                }
            }
        }
    }
}