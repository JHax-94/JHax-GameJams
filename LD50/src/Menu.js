import Button from "./Button";
import { consoleLog, SETUP } from "./main";

export default class Menu
{
    constructor(levelData)
    {
        this.menuData = levelData;
        this.BuildLevelButtons(levelData.levelButtons);
    }

    BuildLevelButtons(levelButtons)
    {
        consoleLog("Building level buttons...");
        consoleLog(levelButtons);

        let menu = this;

        for(let i = 0; i < levelButtons.length; i ++)
        {
            let lvlBtn = levelButtons[i];

            let btnObj = new Button(
                { x: this.menuData.buttonStart.x, y: this.menuData.buttonStart.y + (this.menuData.buttonDims.h + 1) * i }, 
                { w: this.menuData.buttonDims.w, h: this.menuData.buttonDims.h },
                lvlBtn);

            btnObj.ClickCallback = function(btnData)
            {
                menu.LevelButtonClick(btnData);
            }   
        }
    }

    LevelButtonClick(btnData)
    {
        consoleLog(btnData);

        SETUP(btnData.levelName);

    }

    
}