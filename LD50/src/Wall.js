import { EM } from "./main";

export default class Wall
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
                    isSensor: false,
                    isKinematic: true,
                    tag: "WALL",
                    material: "wallMaterial"
                }
            });
    }    

    /*
    Draw()
    {

    }*/
}