import { consoleLog, EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH } from "../main";

export default class Warning
{
    constructor(object, gameWorld, tracker)
    {
        this.renderLayer = "UI";

        this.object = object;
        this.gameWorld = gameWorld;
        this.tracker = tracker;

        this.warningSprite = 20;        

        this.blinkOnTime = 1;
        this.blinkOffTime = 0.5;
        
        this.blinkTimer = 0;
        this.elapsedTimer = 0;

        this.totalTime = 3*(this.blinkOnTime + this.blinkOffTime);
        
        consoleLog("CREATING WARNING FOR");
        consoleLog(object);

        EM.RegisterEntity(this);
    }

    Update(deltaTime)
    {
        this.blinkTimer += deltaTime;
        this.elapsedTimer += deltaTime;

        if(this.blinkTimer > this.blinkOnTime + this.blinkOffTime)
        {
            this.blinkTimer -= (this.blinkOnTime + this.blinkOffTime);
        }

        if(this.elapsedTimer >= this.totalTime)
        {
            this.EndWarning();
        }   
    }

    EndWarning()
    {
        this.tracker.RemoveWarning();
        this.object.hasWarning = false;
        EM.RemoveEntity(this);
    }

    ExtendWarning()
    {
        this.elapsedTimer = 0;
    }

    GetWarningPosition()
    {
        let drawPos = this.object.GetScreenPos();

        //EM.hudLog.push(`WarningPos: ${drawPos.x}`)

        if(drawPos.y < 0)
        {
            drawPos.y = 0;
            drawPos.offScreen = true;
        }
        else if(drawPos.y > (TILE_HEIGHT - 1) *PIXEL_SCALE)
        {
            drawPos.y = (TILE_HEIGHT - 1) * PIXEL_SCALE;
            drawPos.offScreen = true;
        }

        if(drawPos.x < 0)
        {
            drawPos.x = 0;
            drawPos.offScreen = true;
        }
        else if(drawPos.x > (TILE_WIDTH -1) * PIXEL_SCALE)
        {
            drawPos.x = (TILE_WIDTH - 1) * PIXEL_SCALE;
            drawPos.offScreen = true;
        }
        
        return drawPos;
    }

    BlinkOn()
    {   
        let blinkOn = this.blinkTimer > 0 && this.blinkTimer < (this.blinkOnTime);

        EM.hudLog.push(`W${blinkOn ? "1" : "0" } | ${this.blinkTimer.toFixed(3)} `)

        return blinkOn;
    }

    Draw()
    {
        let screenPos = this.GetWarningPosition();

        if(this.BlinkOn())
        {
            if(screenPos.offScreen || !this.object.DrawWarning)
            {
                sprite(this.warningSprite, screenPos.x, screenPos.y);
            }
            else
            {
                //this.object.DrawWarning();
            }
        }
    }
}