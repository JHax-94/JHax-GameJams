import Button from "./Button";
import { consoleLog, EM, SETUP } from "./main";

export default class Menu
{
    constructor(levelData)
    {
        this.menuData = levelData;
        this.titleMap = getMap(this.menuData.titleMap);

        this.BuildLevelButtons(levelData.levelButtons);

        EM.RegisterEntity(this);
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

    Draw()
    {
        this.titleMap.draw(0, 0);
    }    
}