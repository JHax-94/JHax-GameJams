import Planet from "../GameWorld/Planet";
import { TILE_HEIGHT } from "../main";
import TutorialItem from "./TutorialItem";

export default class SelectPlanetTutorial extends TutorialItem
{
    constructor(control)
    {
        super(control, { x: 0, y: TILE_HEIGHT - 8, h: 1.25, w: 14 });

        this.timer = 1.5;
    }

    DrawTutorial()
    {
        this.DrawWindow();

        pen(1);
        this.DrawCentredText("Left click on a planet to select it", 0.5);
        //this.DrawGridCentred(this.arrowGrid, this.dims.y + 3);
    }

    CheckTutorialEnd(deltaTime)
    {
        let end = false;
        
        if(this.Selected() !== null && this.Selected() instanceof Planet)
        {
            this.timer -= deltaTime;

            if(this.timer <= 0)
            {
                end = true;
            }
        }
        
        return end;
    }
}