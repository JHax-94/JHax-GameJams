import { EM } from "./main";

export default class TimeStepper
{
    constructor(maxTime, opts = null)
    {
        this.on = false;
        this.time = maxTime;
        this.timer = 0;

        this.onTick = null;
        this.onComplete = null;

        this.reverse = false;

        if(opts)
        {
            if(opts.onTick)
            {
                this.onTick = opts.onTick;
            }

            if(opts.onComplete)
            {
                this.onComplete = opts.onComplete;
            }
        }
    }

    StartTimer()
    {
        if(this.timer >= this.time)
        {
            this.timer = 0;
        }
        this.on = true;
        this.reverse = false;
    }

    Reset()
    {
        this.timer = 0;
        this.on = false;
        this.reverse = false;
    }

    IsFull()
    {
        return this.timer >= this.time;
    }

    IsEmpty()
    {
        return this.timer <= 0;
    }

    InProgress()
    {
        return !(this.IsFull() || this.IsEmpty());
    }

    ReverseTimer()
    {
        this.on = true;
        this.reverse = true;
        if(this.timer <= 0)
        {
            this.timer = this.time;
        }
    }

    HudLog(name)
    {
        let logString = this.on ? `${name}: ${this.timer.toFixed(3)} / ${this.time.toFixed(3)}` : `${name}: OFF`;

        EM.hudLog.push(logString);
    }

    Value()
    {
        return this.timer / this.time;
    }

    TickBy(deltaTime)
    {
        if(this.on)
        {
            let complete = false;
            this.timer += deltaTime * (this.reverse ? -1 : 1);

            if(!this.reverse && this.timer >= this.time)
            {
                this.timer = this.time;
                complete = true;
            }
            else if(this.reverse && this.timer <= 0)
            {
                this.timer = 0;
                complete = true;
            }

            if(this.onTick)
            {
                this.onTick();
            }

            if(complete)
            {
                this.on = false;
                if(this.onComplete)
                {
                    this.onComplete();
                }
            }
        }
    }

}
