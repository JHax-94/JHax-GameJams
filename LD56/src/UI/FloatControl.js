import { EM, consoleLog } from "../main";

class Float 
{
    constructor(src)
    {
        this.baseF = (2 * Math.PI);
        this.amp = src.amp;
        this.frequency = src.frequency;
        this.timer = 0;
    }

    Value()
    {
        return this.amp * Math.sin(this.baseF * this.frequency * this.timer);
    }
}

export default class FloatControl
{
    constructor(settings)
    {
        this.settings = settings;

        this.floatX = null;
        this.floatY = null;

        if(this.settings.y)
        {
            this.floatY = this.CreateFloat(this.settings.y);
        }

        if(this.settings.x)
        {
            this.floatX = this.CreateFloat(this.settings.x);
        }

        EM.RegisterEntity(this);
        consoleLog("CREATED FLOAT CONTROL:");
        consoleLog(this);
    }

    CreateFloat(src)
    {
        return new Float(src);
    }

    UpdateTarget(float, deltaTime)
    {
        float.timer += deltaTime;
    }

    Update(deltaTime)
    {
        if(this.floatX) this.UpdateTarget(this.floatX, deltaTime);
        if(this.floatY) this.UpdateTarget(this.floatY, deltaTime);
    }

    ApplyFloat(pos)
    {
        pos.x += this.floatX ? this.floatX.Value() : 0;
        pos.y += this.floatY ? this.floatY.Value() : 0;
    }

}