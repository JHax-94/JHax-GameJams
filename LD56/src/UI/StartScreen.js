
import { AUDIO, consoleLog, EM, PIXEL_SCALE } from "../main";
import TutorialControl from "../Tutorial/TutorialControl";
import EndScreen from "./EndScreen";

export default class StartScreen extends EndScreen
{
    constructor()
    {
        super("", { w: 26, h: 22});

        let _this = this;

        this.BuildButtons([ 
            { text: "CLICK TO START", callback: () => _this.StartGame() }, 
            { text: "START (NO TUTORIAL)", callback: () => { _this.StartGame(true); 
        }}]);

        this.insetY = 1;

        this.lineHeight= 1.5;

        this.intro = [
            "This old bee hive has",
            "seen better days!",
            { sprite: 1, rect: 3 },            
            "Guide the colony to",
            "a shiny new hive!",
            { sprite: 4, rect: 3 }
        ];

        this.titleGrid = [
            [ 176, 177, 178, ],
            [  null, 193, 194 ],
            [  null, 209, 210, 211, null],
            [  null, 225 ]
        ];

        this.overGrid = [
            [ null, null, null, null, 35 ],
            [ 212, null, null, null, 216 ],
            [ null, 229, 230, 231, 232 ]
        ]

        this.grassGrid = [ 
            [ 86, 70, 86, 86, 86, 86, 86, 86, 86, 86, 86, 86, 86, 71, 86 ]
        ];

        this.trailGrid = [
          [  null, 118, 119, 118, 119, 118, 119, 118, 119, 118, 119, 118, null ]
        ];
        this.trailOverGrid = [
            [ null, 1, null, 135, null, 134, null, { sprite: 35, v: true, r: true}, null, null, null, null, null, 4, null ]
        ]

    }

    StartGame(skipTutorial = false)
    {
        EM.Unpause();
        this.Destroy();

        let gameWorld = EM.GetEntity("GAMEWORLD");

        if(!skipTutorial)
        {
            gameWorld.tutorial = new TutorialControl(gameWorld);
        }

        AUDIO.PlayMusic();
    }

    Draw()
    {
        super.Draw();

        this.DrawGridCentred(this.titleGrid, this.dims.y + this.insetY);

        this.DrawGridCentred(this.overGrid, this.dims.y + this.insetY + 1);

        pen(1);
        print('Game by', this.dims.x * PIXEL_SCALE + 1, this.dims.y * PIXEL_SCALE + 2);
        print('JHax', this.dims.x * PIXEL_SCALE + 1, (this.dims.y + 1) * PIXEL_SCALE + 2);
        
        print("Made with", (this.dims.x + 20) * PIXEL_SCALE - 7, this.dims.y * PIXEL_SCALE + 2);
        print("PixelBox ", (this.dims.x + 20) * PIXEL_SCALE - 7, (this.dims.y + 1) * PIXEL_SCALE +2 );
        print("P2.js ", (this.dims.x + 20) * PIXEL_SCALE - 7, (this.dims.y + 2) * PIXEL_SCALE + 2);

        for(let i = 0; i < this.intro.length; i ++)
        {
            pen(1)
            let item = this.intro[i];

            if(item.sprite)
            {
                this.DrawCentredSprite(item.sprite, this.insetY + 4.5 + i * this.lineHeight, item.rect);
            }
            else
            {
                this.DrawCentredText(item,  this.insetY + 4.5 + i * this.lineHeight);
            }
        }

        this.DrawGridCentred(this.grassGrid, this.dims.y + 15, true);
        this.DrawGridCentred(this.trailGrid, this.dims.y + 15);
        this.DrawGridCentred(this.trailOverGrid, this.dims.y + 15);
    }
}