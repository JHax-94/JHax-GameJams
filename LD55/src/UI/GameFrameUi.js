import { CONDEMNED_MARK } from "../Enums/CondemnedMark";
import { EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH, UTIL, consoleLog } from "../main";

export default class GameFrame
{

    constructor()
    {
        this.renderLayer = "FRAME"

        this.scheduler = null;

        this.x = PIXEL_SCALE * 16;
        this.y = 0;
        this.h = PIXEL_SCALE * TILE_HEIGHT;
        this.w = TILE_WIDTH * PIXEL_SCALE - this.x;

        this.padding = 2 / 16;

        this.lineHeight = UTIL.GetTextHeight("") * PIXEL_SCALE + 2;

        this.titleAt = { x: 0.5, y: 0.5 };
        this.title = [ 
            {
                offset: 4,
                elements: [ 252, 253, 254, 255 ]
            },
            {
                offset: 0,
                elements: [ 236, 237, 237, 238 ]
            }
        ];
        

        EM.RegisterEntity(this);

        this.imp = EM.GetEntity("PLAYER");
        this.levelGuide = null;
    }

    DrawTitle()
    {
        for(let i = 0; i < this.title.length; i ++)
        {
            let t = this.title[i];

            for(let e = 0; e < t.elements.length; e ++)
            {
                let drawAt = {
                    x: this.x + this.titleAt.x * PIXEL_SCALE + e * PIXEL_SCALE + t.offset,
                    y: this.y + this.titleAt.y * PIXEL_SCALE + i * PIXEL_SCALE
                } 

                //EM.IgnoreCamera(drawAt);

                sprite(t.elements[e], drawAt.x, drawAt.y);
            }
        }
    }

    DrawQuota()
    {
        let quotaPos = { x: this.padding, y: 3 };

        let drawAt = { x: quotaPos.x * PIXEL_SCALE + this.x, y: quotaPos.y * PIXEL_SCALE + this.y };

        pen(1);

        let quota = `${this.scheduler.completedTasks.length} / ${this.scheduler.allTasks.length}`;

        print(`Quota:`, drawAt.x, drawAt.y);
        print(quota, drawAt.x, drawAt.y + this.lineHeight);
    }

    DrawWorkers()
    {
        let workPos = { x: this.padding, y: 5 };
        let drawAt = { x: workPos.x * PIXEL_SCALE + this.x, y: workPos.y * PIXEL_SCALE + this.y };

        let lines = 0;

        let marks = [
             { m: CONDEMNED_MARK.WORKING, col: 1 }, 
             { m: CONDEMNED_MARK.CLOCKED_OFF, col: 7 },
             { m: CONDEMNED_MARK.OBLITERATED, col: 9 }
        ];

        pen(1);
        print(`Workers:`, drawAt.x, drawAt.y);
       
        for(let i = 0; i < marks.length; i ++)
        {
            let count = this.scheduler.MarkedWorkers(marks[i].m);

            if(count > 0)
            {
                pen(marks[i].col);
                print(`${CONDEMNED_MARK.ToString(marks[i].m)}: ${count}`, drawAt.x, drawAt.y + (this.lineHeight) * (lines + 1));
                lines++;
            }
        }        

        /*
        print(`Working: ${this.scheduler.MarkedWorkers(CONDEMNED_MARK.WORKING)}`, drawAt.x, drawAt.y + this.lineHeight);
        pen(7)
        print(`Clocked off: ${this.scheduler.MarkedWorkers(CONDEMNED_MARK.CLOCKED_OFF)}`, drawAt.x, drawAt.y + this.lineHeight * 2);
        pen(9)
        print(`Obliterated: ${this.scheduler.MarkedWorkers(CONDEMNED_MARK.OBLITERATED)}`, drawAt.x, drawAt.y + this.lineHeight * 3);*/
    }

    Draw()
    {
        paper(0);
        /*consoleLog("DRAW FRAME:");
        consoleLog(this);*/

        rectf(this.x, this.y, this.w, this.h);

        this.DrawTitle();

        if(this.levelGuide)
        {
            this.levelGuide.AddToFrame(this);
        }

        if(this.scheduler)
        {
            this.DrawQuota();
            this.DrawWorkers();
        }

        if(this.imp)
        {
            this.imp.instructions.DrawInstructions(this);
        }
    }


}
