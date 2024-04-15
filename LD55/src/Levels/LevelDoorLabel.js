import Utils from "p2/src/utils/Utils";
import { EM, PIXEL_SCALE, UTILS, consoleLog } from "../main";

export default class LevelDoorLabel
{
    constructor(levelDoor, opts)
    {
        this.renderLayer = "MENU_UI";

        this.door = levelDoor;

        this.offset = { x: 0, y: 0 };

        if(opts && opts.offset)
        {
            this.offset = { x: opts.offset.x, y: opts.offset.y };
        }

        EM.RegisterEntity(this);
    }

    Draw()
    {
        if(!this.door.hidden)
        {
            let screenPos = this.door.GetScreenPos();

            screenPos.x += this.offset.x;
            screenPos.y += this.offset.y;

            let textWidth = UTILS.GetTextWidth(this.door.display);
            let textHeight = UTILS.GetTextHeight(this.door.display);

            paper(0);
            rectf(screenPos.x -1, screenPos.y - 1, (textWidth * PIXEL_SCALE) + 2, (textHeight * PIXEL_SCALE) + 2);

            pen(1);
            print(this.door.display, screenPos.x, screenPos.y);
        }
    }
}