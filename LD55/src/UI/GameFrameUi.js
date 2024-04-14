import { EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH, consoleLog } from "../main";

export default class GameFrame
{

    constructor()
    {
        this.x = PIXEL_SCALE * 16;
        this.y = 0;
        this.h = PIXEL_SCALE * TILE_HEIGHT;
        this.w = TILE_WIDTH * PIXEL_SCALE - this.x;

        EM.RegisterEntity(this);
    }

    Draw()
    {
        paper(0);
        consoleLog("DRAW FRAME:");
        consoleLog(this);

        rectf(this.x, this.y, this.w, this.h);
    }


}