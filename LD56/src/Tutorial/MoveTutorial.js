import TutorialItem from "./TutorialItem";
import { vec2 } from "p2";

export default class MoveTutorial extends TutorialItem
{
    constructor(control)
    {
        super(control, { y: 4, h: 6, w: 18 });

        this.arrowGrid = [
            [ null, { sprite: 238}, null ],
            [ {sprite: 238, h: true, r: true, off: { x: -1, y: 2}}, { sprite: 238, v: true, off: { y: 1} }, { sprite: 238, r: true, off: { y: 2 } } ]
        ];

        this.timer = 2;

    }

    DrawTutorial()
    {
        this.DrawWindow();

        pen(1);
        this.DrawCentredText("Use the arrow", 1);
        this.DrawCentredText("keys to move", 2);
        this.DrawGridCentred(this.arrowGrid, this.dims.y + 3);
    }

    CheckTutorialEnd(deltaTime)
    {
        let end = false;

        if(vec2.sqrLen(this.control.player.phys.velocity) > 0.01)
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