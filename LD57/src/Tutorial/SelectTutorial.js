import { EM, TILE_HEIGHT } from "../main";
import Freighter from "../Spacecraft/Freighter";
import TutorialItem from "./TutorialItem";
import { vec2 } from "p2";

export default class SelectTutorial extends TutorialItem
{
    constructor(control)
    {
        super(control, { y: (TILE_HEIGHT / 2)-6, h: 4, w: 10 });

        this.timer = 1;
    }

    DrawTutorial()
    {
        this.DrawWindow();

        pen(1);
        this.DrawCentredText("Left click a freighter:", 0.5);
        this.DrawCentredSprite(0, 1.5);
        this.DrawCentredText("to select it", 2.5);
        //this.DrawGridCentred(this.arrowGrid, this.dims.y + 3);
    }

    CheckTutorialEnd(deltaTime)
    {
        let end = false;
        
        if(this.Selected() !== null && this.Selected() instanceof Freighter)
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