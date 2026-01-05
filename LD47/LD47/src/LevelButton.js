import Button from "./Button";
import GameStorageManager from "./GameStorageManager";
import { consoleLog, PIXEL_SCALE, STORAGE } from "./main";

export default class LevelButton extends Button
{
    constructor(tileRect, text, options, colours, lvlName)
    {
        super(tileRect, text, options, colours);

        this.lvlName = lvlName;
        this.completed = this.CheckComplete(this.lvlName);
        this.completedSpriteIndex = 12;
    }

    CheckComplete(lvlName)
    {
        var complete = false;

        var stored = STORAGE.GetValueAsBool(GameStorageManager.LVL_NAME_KEY(lvlName));

        if(stored !== null)
        {
            complete = stored;
        }

        consoleLog(`Level ${lvlName} completed? ${complete}`);

        return complete;
    }

    Draw()
    {
        super.Draw();

        if(this.completed)
        {
            sprite(this.completedSpriteIndex, (this.tileRect.x + this.tileRect.w - 1) * PIXEL_SCALE, this.tileRect.y * PIXEL_SCALE);
        }
    }
}