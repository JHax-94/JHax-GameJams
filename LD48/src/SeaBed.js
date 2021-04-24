import { consoleLog, em, PIXEL_SCALE } from "./main";

export default class SeaBed
{
    constructor(mapName)
    {
        this.map = getMap(mapName);
        tilesheet(assets.tilesheet_dive);
        
        this.mapPosition = { x: 4, y: 0 };

        this.seaBedPos = { x: 0 , y: 14};
        
        var phys = {
            tileTransform: { 
                x: this.mapPosition.x + this.seaBedPos.x, 
                y: this.mapPosition.y + this.seaBedPos.y,
                w: 16,
                h: 2
            },
            isKinematic: true,
            isSensor: false,
            tag: "SEABED",
        };

        em.AddRender(this);
        em.AddPhys(this, phys);
    }

    Draw()
    {
        var pos = em.GetPosition(this);

        draw(this.map, this.mapPosition.x * PIXEL_SCALE, this.mapPosition.y * PIXEL_SCALE);

        /*
        if(em.drawColliders)
        {
            em.DrawColliders(this.phys);
        }*/
    }
}
