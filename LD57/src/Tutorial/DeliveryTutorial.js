import Planet from "../GameWorld/Planet";
import { TILE_HEIGHT } from "../main";
import TutorialItem from "./TutorialItem";

export default class DeliveryTutorial extends TutorialItem
{
    constructor(control)
    {
        super(control, { x: 0, y: TILE_HEIGHT - 11, h: 5, w: 14 });

        this.timer = 1;
    }

    ShouldDrawTut()
    {
        return this.Selected() instanceof Planet && this.Selected().parcelStore.Count() > 0 && this.Selected().spacecraftRoster.length > 0;
    }

    DrawTutorial()
    {
        this.DrawWindow();

        pen(1);
        this.DrawCentredText("Now send your freighter ", 0.5);
        this.DrawCentredText("to a planet with a symbol", 1.5);
        this.DrawCentredText("matching the symbol on the", 2.5);
        this.DrawCentredText("cargo", 4);
    }

    CheckTutorialEnd(deltaTime)
    {
        let end = false;

        if(this.control.gameWorld.player.parcelsDelivered > 0)
        {
            end = true;
        }

        return end;
    }
}