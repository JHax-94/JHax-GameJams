import { TILE_HEIGHT } from "../main";
import TutorialItem from "./TutorialItem";

export default class SortingTutorial extends TutorialItem
{
    constructor(control)
    {
        super(control, { x: 0, y: TILE_HEIGHT - 11, h: 5, w: 22 });

        this.timer = 15;
        
        this.hasDrawn = false;
    }

    ShouldDrawTut()
    {
        return this.Selected() != null && this.Selected().parcelStore.UnsortedParcels() > 0;
    }

    DrawTutorial()
    {
        if(this.ShouldDrawTut())
        {
            this.hasDrawn = true;

            this.DrawWindow();

            pen(1);
            this.DrawCentredText("Some cargo is marked with a question mark:", 0.5);
            this.DrawCentredSprite(33, 1.5)

            this.DrawCentredText("This cargo needs to be taken to a Space Station", 2.5);
            this.DrawCentredText("so it can be sorted. Then it can be taken to its", 3.25);
            this.DrawCentredText("destination.", 4);
            /*
            this.DrawCentredText("Fun fact: Weeks were decimalised after humanity expanded", 4.5);
            this.DrawCentredText("beyond the Solar System!", 5.25);*/
        }
    }

    Activate()
    {
    }    

    CheckTutorialEnd(deltaTime)
    {
        let end = false;

        if(this.hasDrawn)
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