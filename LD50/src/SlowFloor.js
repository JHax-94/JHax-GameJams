import { EM } from "./main";

export default class SlowFloor 
{
    constructor(position, settings)
    {
        EM.RegisterEntity(
            this, 
            { 
                physSettings:
                {
                    tileTransform: {
                        x: position.x,
                        y: position.y,
                        w: 1,
                        h: 1
                    },
                    mass: 10,
                    isSensor: true,
                    isKinematic: true,
                    tag: "SLOWFLOOR"
                }
            });
    }    
}