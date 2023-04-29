import { PIXEL_SCALE, SETUP, consoleLog } from "../main";
import Button from "./Button";

export default class ButtonList
{
    constructor(component)
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
                    let newButton = new Button(
                        { x: 0, y: i * (dims.h + spacing.y), w: dims.w, h: dims.h },
                        {
                            style: this.src.style,
                            text: item[this.src.btnText.key],
                            btnObj: item
                        });
                
                    newButton.ClickEvent = (btn) => { SETUP(item.levelName); }

                    this.buttons.push(newButton);
                }
            }
        }
    }
}