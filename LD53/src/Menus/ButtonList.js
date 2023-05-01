import { PIXEL_SCALE, SETUP, consoleLog } from "../main";
import Button from "./Button";

export default class ButtonList
{
    constructor(rootDims, component)
    {
        this.src = Object.assign({}, component);

        this.buttons = [];

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

                    this.buttons.push(newButton);
                }
            }
        }
    }
}