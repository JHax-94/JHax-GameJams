import { clockAdded, EM, getClockCount, getObjectConfig, PIXEL_SCALE } from "./main";

export default class Clock
{
    constructor()
    {
        this.clockNumber = getClockCount();

        this.renderLayer = "OVERLAY_UI";

        this.penColour = 1;

        this.paused = false;

        let clockConfig = getObjectConfig("Clock");

        this.rect = clockConfig.rect;
        this.offset = clockConfig.offset;

        this.time = 
        {
            ms: 0,
            s: 0,
            m: 0
        };

        EM.RegisterEntity(this);

        clockAdded();
    }

    Update(deltaTime)
    {
        if(!this.paused)
        {
            this.time.ms += deltaTime * 1000;

            if(this.time.ms >= 1000)
            {
                this.time.ms -= 1000;
                this.time.s ++;
            }

            if(this.time.s >= 60)
            {
                this.time.s -= 60;
                this.time.m ++;
            }
        }
    }

    Pause()
    {
        this.paused = true;
    }

    GetTimeString()
    {
        let secondString = "";

        if(this.time.s < 10)
        {
            secondString = `0${this.time.s}`;
        }
        else 
        {
            secondString = `${this.time.s}`;
        }

        let minuteString = "";

        if(this.time.m < 10)
        {
            minuteString = `00${this.time.m}`;
        }
        else if(this.time.m < 100)
        {
            minuteString = `0${this.time.m}`;
        }
        else
        {
            minuteString = `${this.time.m}`;
        }

        return `${minuteString}:${secondString}.${Math.floor(this.time.ms)}`;
    }

    TotalSeconds()
    {
        return (this.time.m * 60) + this.time.s + (this.time.ms * 0.001);
    } 

    Draw()
    {
        paper(0);
        rectf(this.rect.x * PIXEL_SCALE, this.rect.y * PIXEL_SCALE, this.rect.w * PIXEL_SCALE, this.rect.h * PIXEL_SCALE);

        pen(this.penColour);
        print(this.GetTimeString(), (this.rect.x + this.offset.x) * PIXEL_SCALE, (this.rect.y + this.offset.y) * PIXEL_SCALE);
    }
}