import { consoleLog, em } from "./main";

export default class BedTile
{
    constructor(physParams)
    {
        em.AddPhys(this, physParams);

        consoleLog("Construct bed tiles...");
        consoleLog("Add to renders? " + em.drawColliders);

        if(em.drawColliders)
        {
            consoleLog("Adding render...");
            em.AddRender(this);
        }
    }

    Draw()
    {

    }
}