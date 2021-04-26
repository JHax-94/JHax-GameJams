import { em } from "./main"

export default class LevelBound 
{
    constructor(tileBounds)
    {
        var phys = 
        {
            tileTransform: tileBounds,
            isKinematic: true,
            mass: 0,
            tag: "BOUND"
        };

        em.AddPhys(this, phys);
    }
}