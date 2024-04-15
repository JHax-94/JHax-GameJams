import { PIXEL_SCALE, TILE_HEIGHT, consoleLog } from "../main";

export default class LevelGuide
{
    constructor()
    {
        
    }

    AddToFrame(frame)
    {
        let startY = (2.5) * PIXEL_SCALE;

        let drawAt = {x: frame.x + frame.padding * PIXEL_SCALE, y: frame.y + startY, w: PIXEL_SCALE, h: PIXEL_SCALE};

        let lineHeight = frame.lineHeight;

        let txtOff = 6;

        //consoleLog(`Draw at: ${drawAt.x}, ${drawAt.y}`);

        pen(1);
        print("Game by", drawAt.x + PIXEL_SCALE, drawAt.y);
        drawAt.y += lineHeight;
        print("Josh Haxell", drawAt.x + PIXEL_SCALE + 4, drawAt.y);
        drawAt.y += lineHeight * 2

        print("Made with", drawAt.x + PIXEL_SCALE, drawAt.y)
        drawAt.y += lineHeight;
        print("PixelBox", drawAt.x, drawAt.y)
        print("p2.js", drawAt.x + 4 + 2.5* PIXEL_SCALE, drawAt.y);
        drawAt.y += lineHeight;
        print("by", drawAt.x + 10, drawAt.y);
        print("by", drawAt.x + 10 + 2.5 *PIXEL_SCALE, drawAt.y);
        drawAt.y += lineHeight;
        print("cstoquer", drawAt.x, drawAt.y);
        print("schteppe", drawAt.x + 2.5 *PIXEL_SCALE, drawAt.y);

        print("Arrow Keys to move:", drawAt.x, (TILE_HEIGHT * 0.5) * PIXEL_SCALE - 8);
    }
}