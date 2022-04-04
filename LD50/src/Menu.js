import Button from "./Button";
import CharacterSelect from "./CharacterSelect";
import { consoleLog, EM, SETUP } from "./main";

export default class Menu
{
    constructor(levelData)
    {
        this.menuData = levelData;
        let map = getMap(this.menuData.titleMap);
        /*
        consoleLog("TITLE MAP");
        consoleLog(map);
        */
        this.titleMap = map.copy(0, 0, map.width, map.height);

        this.buttons = [];

        this.characterSelect = null;

        this.BuildLevelButtons(levelData.levelButtons);

        this.inputWaits = {
            left: false,
            right: false,
            up: false,
            down: false,
            enter: true
        };

        this.focusedButton = 0;

        EM.RegisterEntity(this);

        this.SetFocus(this.focusedButton);

        this.ProcessMenuMap();
    }


    ProcessMenuMap()
    {
        consoleLog("Process menu map...");

        let menuObjects = assets.objectConfig.objectMap.filter(val => val.searchMenu);

        consoleLog(menuObjects);

        for(let i = 0; i < menuObjects.length; i ++)
        {
            let menuObj = menuObjects[i];

            let tiles = [];

            if(menuObj.index || menuObj.index === 0)
            {
                tiles = this.titleMap.find(menuObj.index);
            }
            else if(menuObj.indexList)
            {
                
                for(let j = 0; j < menuObj.indexList.length; j ++)
                {
                    let _tiles = this.titleMap.find(menuObj.indexList[j]);

                    for(let k = 0; k < _tiles.length; k ++)
                    {
                        tiles.push(_tiles[k]);
                    }
                }
            }

            for(let j = 0; j < tiles.length; j ++)
            {
                if(menuObj.name === "CharHead")
                {
                    if(!this.characterSelect)
                    {
                        this.characterSelect = new CharacterSelect({ x: tiles[j].x, y: tiles[j].y });
                    }
                }
                /*else if(menuObj.name === "CharBody")
                {
                    if(!this.characterSelect)
                    {
                        this.characterSelect = new CharacterSelect();
                    }
                }*/

                if(menuObj.replaceTile)
                {
                    
                    

                    this.titleMap.remove(tiles[j].x, tiles[j].y);
                }   
            }
        }
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

            btnObj.HoverCallback = function() {
                menu.ButtonHovered(btnObj)
            }

            this.buttons.push(btnObj);
        }
    }

    ButtonHovered(button)
    {
        consoleLog("BUTTON HOVERED");

        if(button.hoverOn && this.focusedButton >= 0)
        {
            this.focusedButton = -1;
            this.SetFocus(this.focusedButton);
        }
        
    }

    SetFocus(focusOn)
    {
        for(let i = 0; i < this.buttons.length; i ++)
        {
            this.buttons[i].SetFocus(i === focusOn);
        }
    }

    LevelButtonClick(btnData)
    {
        consoleLog(btnData);

        SETUP(btnData.levelName);

    }

    ChangeButton(amount)
    {
        this.focusedButton = (this.focusedButton + amount + this.buttons.length) % this.buttons.length;

        //consoleLog(`change button to ${this.focusedButton}`);

        this.SetFocus(this.focusedButton);
    }


    Input(input)
    {
        /*
        consoleLog(input);
        consoleLog(this.inputWaits);
        */

        if(input.up && this.inputWaits.up === false)
        {
            if(this.focusedButton < 0)
            {
                this.focusedButton = 1;
            }

            this.ChangeButton(-1);
            this.inputWaits.up = true;
        }
        else if(input.up === false && this.inputWaits.up)
        {
            this.inputWaits.up = false;
        }

        if(input.down && this.inputWaits.down === false)
        {
            this.ChangeButton(1);
            this.inputWaits.down = true;
        }
        else if(input.down === false && this.inputWaits.down)
        {
            this.inputWaits.down = false;
        }

        if(input.right && this.inputWaits.right === false)
        {
            this.characterSelect.ChangeCharacter(1);
            this.inputWaits.right = true;
        }
        else if(this.inputWaits.right && input.right === false)
        {
            this.inputWaits.right = false;
        }

        if(input.left && this.inputWaits.left === false)
        {
            this.characterSelect.ChangeCharacter(-1);
            this.inputWaits.left = true;
        }
        else if(this.inputWaits.left && input.left === false)
        {
            this.inputWaits.left = false;
        }

            /*
        consoleLog(input);
        consoleLog(this.inputWaits);
        */
        if(input.submit && this.inputWaits.enter === false)
        {
            if(this.focusedButton >= 0)
            {
                this.buttons[this.focusedButton].Click();
            }
        }
        else if(this.inputWaits.enter && input.submit === false)
        {
            this.inputWaits.enter = false;
        }
    }

    Draw()
    {
        this.titleMap.draw(0, 0);
    }    
}