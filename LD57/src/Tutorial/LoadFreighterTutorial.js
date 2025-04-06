import Planet from "../GameWorld/Planet";
import { TILE_HEIGHT } from "../main";
import TutorialItem from "./TutorialItem";

export default class LoadFreighterTutorial extends TutorialItem
{
    constructor(control)
    {
        super(control, { x: 0, y: TILE_HEIGHT - 11, h: 6, w: 14 });

        this.timer = 1;
    }

    ShouldDrawTut()
    {
        return this.Selected() instanceof Planet && this.Selected().parcelStore.Count() > 0 && this.Selected().spacecraftRoster.length > 0;
    }

    DrawTutorial()
    {
        if(this.ShouldDrawTut())
        {
            this.watchingParcelStore = this.Selected().parcelStore;

            this.DrawWindow();

            pen(1);
            this.DrawCentredText("Left click cargo in the ", 0.5);
            this.DrawCentredText("bottom left to select it.", 1.5);
            this.DrawCentredText("Then right click a freighter  ", 3);
            this.DrawCentredText("near this planet to", 4)
            this.DrawCentredText("load cargo onto the freighter", 5);    
        }

        //this.DrawGridCentred(this.arrowGrid, this.dims.y + 3);
    }

    CheckTutorialEnd(deltaTime)
    {
        let end = false;
        
        if(this.watchingParcelStore != null && this.watchingParcelStore.Count() === 0)
        {
            end = true;
        }

        return end;
    }
}