import Texture from "pixelbox/Texture";
import { EM, PIXEL_SCALE, SETUP, consoleLog, getPlayerPref } from "../main";
import Button from "./Button";

export default class ButtonList
{
    constructor(rootDims, component)
    {
        consoleLog("---BUILD BUTTON LIST---");
        this.renderLayer = "BUTTONS_UI";
        
        this.src = Object.assign({}, component);

        this.buttons = [];

        this.scoresTextures = [];

        if(this.src.source)
        {
            let baseList = [];

            if(this.src.source === "Levels")
            {
                baseList = assets.levels.data;
            }

            let filterKey = this.src.filter.key;
            let filterVal = this.src.filter.value;

            for(let i = 0; i < baseList.length; i ++ )
            {
                let item = baseList[i];

                let dims = this.src.btnDims;
                let spacing = this.src.spacing;

                if(item[filterKey] === filterVal)
                {
                    let newBtnDims = { x: rootDims.x, y: rootDims.y + this.buttons.length * (dims.h + spacing.y), w: dims.w, h: dims.h };

                    consoleLog(`Create button @: (${newBtnDims.x}, ${newBtnDims.y})`);

                    let newButton = new Button(
                        newBtnDims,
                        {
                            style: this.src.style,
                            text: item[this.src.btnText.key],
                            btnObj: item
                        },
                        "BUTTONS_UI");
                
                    newButton.ClickEvent = (btn) => { SETUP(item.levelName); }

                    let scoreTex = new Texture(2 * PIXEL_SCALE, PIXEL_SCALE);

                    let bestGoldKey = `topGold_${item.levelName}`;
                    let bestGold = getPlayerPref(bestGoldKey);

                    consoleLog(`Set best gold UI: ${bestGold}`);

                    if(bestGold)
                    {
                        
                        
                        scoreTex.pen(1);
                        scoreTex.print(bestGold, 0 , 5),

                        scoreTex.sprite(4, PIXEL_SCALE, 0);
                    }

                    this.scoresTextures.push(scoreTex);
                    this.buttons.push(newButton);
                }
            }
        }

        EM.RegisterEntity(this);
    }

    Draw()
    {
        for(let i = 0; i < this.scoresTextures.length; i ++)
        {
            let scoreDims = {
                x: (this.buttons[i].dims.x + this.buttons[i].dims.w * 2 + 0.5) * PIXEL_SCALE,
                y: (this.buttons[i].dims.y - 0.25) * PIXEL_SCALE
            };

            this.scoresTextures[i]._drawEnhanced(scoreDims.x, scoreDims.y, { scale: 2});
        }
    }
}