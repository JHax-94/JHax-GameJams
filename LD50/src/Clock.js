import { EM } from "./main";

export default class Clock
{
    constructor()
    {
        this.penColour = 0;

        this.paused = false;

        this.time = 
        {
            ms: 0,
            s: 0,
            m: 0
        };

        EM.RegisterEntity(this);
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

        return `${this.time.m}:${secondString}.${Math.floor(this.time.ms)}`;
    }

    Draw()
    {
        pen(this.penColour);
        print(this.GetTimeString());
    }


}