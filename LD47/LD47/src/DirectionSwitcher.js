import Component from "./Component";
import { consoleLog, UP, DOWN, RIGHT, LEFT, em, GetArrowDirMapFromDir, GetArrowDirMapFromName,  PIXEL_SCALE, HOVER_SPRITE } from "./main";

export default class DirectionSwitcher extends Component
{
    constructor(tilePos, spriteData, direction, validDirections)
    {
        //consoleLog("Constructing Direction Switcher!");
        super(tilePos, spriteData, "POINTS");

        this.validDirections = validDirections;

        //consoleLog(this.tilePos);

        this.isControllable = direction.isControllable;

        var dirMap = GetArrowDirMapFromName(direction.dir);

        this.SetDirectionFromMap(dirMap);
        
        consoleLog("DIR SWITCHER CONSTRUCTED");
        consoleLog(this);

        this.hover = false;

        if(this.isControllable)
        {
            em.AddHover(this);
        }
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

    IsValidDir(dir)
    {
        var valid = false;

        for(var i = 0; i < this.validDirections.length; i ++)
        {
            if(this.validDirections[i].dir === dir)
            {
                valid = true;
                break;
            }
        }

        return valid;
    }

    Input(dir)
    {
        if(this.currentDirection !== dir)
        {
            if(this.IsValidDir(dir))
            {
                this.ChangeDir(dir);
            }
        }
    }

    Draw() 
    {
        super.Draw();

        if(this.hover)
        {
            sprite(HOVER_SPRITE, this.tilePos.x * PIXEL_SCALE, this.tilePos.y * PIXEL_SCALE);
        }       
    }

    NextValidDirection()
    {
        var returnDir = this.currentDirection;

        for(var i = 1; i < 4; i ++)
        {
            var newDir = (this.currentDirection + i) % 4;
            consoleLog("IS " + newDir + " VALID?");

            if(this.IsValidDir(newDir))
            {
                returnDir = newDir;
                break;
            }
        }
        
        return returnDir;
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
                var dir = this.NextValidDirection();

                this.ChangeDir(dir);
            }
        }
    }
}