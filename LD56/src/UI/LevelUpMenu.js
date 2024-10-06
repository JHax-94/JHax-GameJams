import { consoleLog, EM, getFont, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH, UTIL } from "../main";
import UpgradeCitizenSpeed from "../Upgrades/UpgradeCitizenSpeed";
import UpgradeRespawnTime from "../Upgrades/UpgradeRespawnTime";
import UpgradeSwarmSize from "../Upgrades/UpgradeSwarmSize";
import Button from "./Button";

export default class LevelUpMenu
{
    constructor(player)
    {
        this.renderLayer = "UI";

        this.player = player;

        this.font = getFont("LargeNarr");

        this.title = "Level Up!".toUpperCase();

        this.subtitle = `Choose a level ${player.level + 1} upgrade`;

        this.buttons = [];

        this.options = [
            new UpgradeSwarmSize(1),
            new UpgradeRespawnTime(0.1),
            new UpgradeCitizenSpeed(1)
        ];

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

        this.Close();
    }

    Close()
    {
        for(let i = 0; i < this.buttons.length; i ++)
        {
            EM.RemoveEntity(this.buttons[i]);
        }
        EM.RemoveEntity(this);
        EM.Pause();
    }

    BuildButtons(options)
    {
        let levelUp = this;
        for(let i = 0; i < options.length; i ++)
        {
            let buttonDims = { x: 0, y: 4 + 2 * i, w: 16, h: 1.5 };

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
        pen(12);
        paper(8);
        rectf(this.dims.x * PIXEL_SCALE, this.dims.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);
        rect(this.dims.x * PIXEL_SCALE, this.dims.y * PIXEL_SCALE, this.dims.w * PIXEL_SCALE, this.dims.h * PIXEL_SCALE);

        let lineHeight = UTIL.GetTextHeight("", this.font);

        this.DrawCentredText(this.title, lineHeight);
        this.DrawCentredText(this.subtitle, lineHeight * 2 + 0.25);

        


    }
}