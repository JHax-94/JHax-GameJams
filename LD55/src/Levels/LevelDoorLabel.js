import Utils from "p2/src/utils/Utils";
import { EM, PIXEL_SCALE, UTILS, consoleLog } from "../main";

export default class LevelDoorLabel
{
    constructor(levelDoor)
    {
        this.renderLayer = "MENU_UI";

        this.door = levelDoor;

        EM.RegisterEntity(this);
    }

    Draw()
    {
        let screenPos = this.door.GetScreenPos();

        let textWidth = UTILS.GetTextWidth(this.door.display);
        let textHeight = UTILS.GetTextHeight(this.door.display);

        paper(0);
        rectf(screenPos.x -1, screenPos.y - 1, (textWidth * PIXEL_SCALE) + 2, (textHeight * PIXEL_SCALE) + 2);

        pen(1);
        print(this.door.display, screenPos.x, screenPos.y);
    }
}