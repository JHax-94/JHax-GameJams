import { consoleLog, EM, getFont, PIXEL_SCALE, setFont, TILE_HEIGHT, TILE_WIDTH, UTIL } from "../main";

import Button from "./Button";

export default class LevelUpMenu
{
    constructor(player)
    {
        this.renderLayer = "UI";

        this.player = player;

        this.font = getFont("LargeNarr");

        this.title = "Level Up!".toUpperCase();

        this.subtitle = [ 
            `Click on a level ${player.level + 1} perk`,
            `to level up!`
        ];

        this.buttons = [];

        let upgradeGen = EM.GetEntity("GAMEWORLD").upgradeGenerator;

        this.options = upgradeGen.GenerateUpgrades();

        this.dims = {
            w: 20,
            h: 12,
            x: 0,
            y: 0
        };

        this.dims.x = (TILE_WIDTH - this.dims.w) * 0.5;
        this.dims.y = (TILE_HEIGHT - this.dims.h) * 0.5;

        this.pos = this.dims;

        EM.RegisterEntity(this);
        this.BuildButtons(this.options);
        EM.Pause(false);
    }

    Pos()
    {
        return this.dims;
    }

    ApplyLevelUp(option)
    {
        consoleLog("Levelling up with option:");
        consoleLog(option);

        option.ApplyUpgrade();

        this.player.IncrementLevel();

        this.Close();
    }

    Close()
    {
        for(let i = 0; i < this.buttons.length; i ++)
        {
            EM.RemoveEntity(this.buttons[i]);
        }
        EM.RemoveEntity(this);
        EM.Unpause();
    }

    BuildButtons(options)
    {
        let levelUp = this;

        let buttonHeight = 1.5;
        let buttonSpace= 0.5;

        let buttonY = this.dims.h - (options.length) * (buttonHeight + buttonSpace);

        for(let i = 0; i < options.length; i ++)
        {
            let buttonDims = { x: 0, y: buttonY + (buttonHeight + buttonSpace) * i, w: 16, h: buttonHeight};

            buttonDims.x = (this.dims.w - buttonDims.w) * 0.5;

            let button = new Button(
                buttonDims, 
                { 
                    font: "LargeNarr",
                    rect: 
                    { 
                        colour: 5, textColour: 1, borderColor: 0,
                        text: options[i].description,
                    } 
                }, 
                "UI", 
                this);

            button.ClickEvent = () => { consoleLog(`Click[${i}]!`); levelUp.ApplyLevelUp(options[i]); };

            this.buttons.push(button);            
        }

        consoleLog("Built buttons:");
        consoleLog(this.buttons);
    }

    DrawCentredText(text, y)
    {
        let textW = UTIL.GetTextWidth(text, this.font);
        print(text, (this.dims.x + (this.dims.w - textW) * 0.5) * PIXEL_SCALE, (this.dims.y + y) * PIXEL_SCALE);
    }

    Draw()
    {
        setFont(this.font);

        pen(12);
        paper(8);
        rectf(this.dims.x * PIXEL_SCALE, this.dims.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
        rect(this.dims.x * PIXEL_SCALE, this.dims.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);

        let lineHeight = UTIL.GetTextHeight("", this.font);

        pen(1);
        this.DrawCentredText(this.title, lineHeight);

        for(let i = 0; i < this.subtitle.length; i ++)
        {
            pen(1);
            this.DrawCentredText(this.subtitle[i],(2+i) * lineHeight + 0.25);
        }
        
    }
}