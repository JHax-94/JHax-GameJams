import Component from "./Component";
import { consoleLog, UP, DOWN, RIGHT, LEFT, em, GetArrowDirMapFromDir, GetArrowDirMapFromName,  PIXEL_SCALE } from "./main";

export default class DirectionSwitcher extends Component
{
    constructor(tilePos, spriteData, direction)
    {
        //consoleLog("Constructing Direction Switcher!");
        super(tilePos, spriteData, "POINTS");

        //consoleLog(this.tilePos);

        this.isControllable = direction.isControllable;

        var dirMap = GetArrowDirMapFromName(direction.dir);

        this.SetDirectionFromMap(dirMap);
        
        consoleLog("DIR SWITCHER CONSTRUCTED");
        consoleLog(this);

        em.AddClickable(this);
    }

    GetFlippedDirection()
    {
        var vector = [0, 0];
        
        if(this.currentDirection === UP) vector[1] = 1;
        else if(this.currentDirection === DOWN) vector[1] = -1;
        else if(this.currentDirection === RIGHT) vector[0] = 1;
        else if(this.currentDirection === LEFT) vector[0] = -1;

        return vector;
    }

    Bounds()
    {
        return {
            x: this.tilePos.x * PIXEL_SCALE,
            y: this.tilePos.y * PIXEL_SCALE,
            w: PIXEL_SCALE,
            h: PIXEL_SCALE
        }
    }

    SetDirectionFromMap(dirMap)
    {
        this.spriteInfo.flipX = dirMap.flipX;
        this.spriteInfo.flipY = dirMap.flipY;
        this.spriteInfo.flipR = dirMap.flipR;

        this.currentDirection = dirMap.dir;
    }

    ChangeDir(dir)
    {
        //consoleLog("SET DIR: " + dir);

        var dirMap = GetArrowDirMapFromDir(dir);
        this.SetDirectionFromMap(dirMap);
    }

    Input(dir)
    {
        if(this.currentDirection !== dir)
        {
            this.ChangeDir(dir);
        }
    }

    Click()
    {
        /*
        consoleLog("Direction Switcher Clicked!");
        consoleLog(this);
        */
        if(this.isControllable)
        {
            if(em.Selected() !== this)
            {
                //consoleLog("Set selected!");
                em.SetSelected(this);
            }
            else
            {
                this.ChangeDir((this.currentDirection + 1) % 4);
            }
        }
    }
}