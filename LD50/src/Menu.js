import { circIn } from "tina/src/easing";
import Button from "./Button";
import CharacterSelect from "./CharacterSelect";
import { consoleLog, EM, getObjectConfig, getPlayerPref, PIXEL_SCALE, SETUP } from "./main";
import MenuMissile from "./MenuMissile";

export default class Menu
{
    constructor(levelData)
    {
        this.renderLayer = "MENU_UI";
        this.y = 0;

        this.menuData = levelData;
        let map = getMap(this.menuData.titleMap);
        /*
        consoleLog("TITLE MAP");
        consoleLog(map);
        */
        this.titleMap = map.copy(0, 0, map.width, map.height);

        this.buttons = [];

        this.root = levelData.componentsRoot;
        this.pages = levelData.pages;

        this.pbs = [];

        this.characterSelect = null;

        this.pageButtons = [];

        this.BuildLevelButtons(levelData.levelButtons);

        

        this.inputWaits = {
            left: false,
            right: false,
            up: false,
            down: false,
            enter: true
        };

        this.currentPage = 0;

        this.focusedButton = 0;

        EM.RegisterEntity(this);

        this.LoadPage();

        this.SetFocus(this.focusedButton);

        this.ProcessMenuMap();
    }

    LoadPage()
    {
        this.BuildPageComponents(this.pages[this.currentPage]);
    }

    BuildPageComponents(page)
    {
        let menuRef = this;
        
        for(let i = 0; i < this.pageButtons.length; i ++)
        {
            EM.RemoveEntity(this.pageButtons[i]);
        }

        for(let i = 0; i < page.components.length; i ++)
        {
            let comp = page.components[i];

            if(comp.type === "Button")
            {
                consoleLog("CREATING BUTTON!");

                let newButton = new Button(
                    { x: (this.root.x + comp.x), y: (this.root.y + comp.y) },
                    { w: comp.w, h: comp.h }, 
                    { display: comp.text, renderLayer: "MENU_UI", offset: comp.offset });
                
                
                if(comp.trigger === "NextPage")
                {
                    newButton.ClickCallback = function() { menuRef.NextPage(); }
                }
                
                newButton.y = 10;

                this.pageButtons.push(newButton);
            }
        }
        
    }


    NextPage()
    {
        this.currentPage = (this.currentPage + 1) % this.pages.length;

        this.LoadPage();
    }

    ProcessMenuMap()
    {
        consoleLog("Process menu map...");

        let menuObjects = assets.objectConfig.objectMap.filter(val => val.searchMenu);

        consoleLog(menuObjects);

        let menuRef = this;

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

                if(menuObj.name === "MissileTopLeft")
                {
                    new MenuMissile({ x: tiles[j].x, y: tiles[j].y });
                }

                if(menuObj.name === "LeftButton")
                {
                    let button = new Button({ x: tiles[j].x, y: tiles[j].y +0.5 }, { w: 1, h: 1 }, { index: menuObj.index, hoverIndex: menuObj.hoverIndex });

                    button.ClickCallback = function() { menuRef.characterSelect.ChangeCharacter(-1); }
                }

                if(menuObj.name === "RightButton")
                {
                    let button = new Button({ x: tiles[j].x, y: tiles[j].y +0.5 }, { w: 1, h: 1 }, { index: menuObj.index, hoverIndex: menuObj.hoverIndex });
                    
                    button.ClickCallback = function() { menuRef.characterSelect.ChangeCharacter(1); }
                }

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
        
        let clockConfig = getObjectConfig("Clock");

        let menu = this;

        let upConf = getObjectConfig("UpButton");        

        let downConf = getObjectConfig("DownButton");

        let arrowX = this.menuData.buttonStart.x + 0.5 * this.menuData.buttonDims.w - 0.5;

        let menuUp = new Button(
            { x: arrowX, y: this.menuData.buttonStart.y - 1.25 }, 
            { w: 1, h: 1 },
            { index: upConf.index, hoverIndex: upConf.hoverIndex });
        
        menuUp.ClickCallback = function() { menu.ChangeButton(-1); };

        let menuDown = new Button(
            { x: arrowX, y: this.menuData.buttonStart.y + (this.menuData.buttonDims.h + 1) * levelButtons.length - 0.75  }, 
            { w: 1, h: 1 },
            { index: downConf.index, hoverIndex: downConf.hoverIndex });

        menuDown.ClickCallback = function() { menu.ChangeButton(1); };

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

            let levelName = lvlBtn.levelName; 

            let pb = getPlayerPref(`PB_${levelName}`);

            let levelScore = 0;

            if(pb !== null) 
            {
                levelScore = parseFloat(pb);
            }


            if(levelScore > 0)
            {
                this.pbs.push({ 
                    x: btnObj.pos.x + btnObj.dims.w + 0.5, y: btnObj.pos.y + 0.25, 
                    w: clockConfig.rect.w, h: clockConfig.rect.h, 
                    offX: clockConfig.offset.x, offY: clockConfig.offset.y,
                    time: this.TimeToClockString(levelScore) });
            }
            

        }
    }

    GetTimeString(time)
    {
        let secondString = "";

        if(time.s < 10)
        {
            secondString = `0${time.s}`;
        }
        else 
        {
            secondString = `${time.s}`;
        }

        let minuteString = "";

        if(time.m < 10)
        {
            minuteString = `00${time.m}`;
        }
        else if(this.time.m < 100)
        {
            minuteString = `0${time.m}`;
        }
        else
        {
            minuteString = `${time.m}`;
        }

        return `${minuteString}:${secondString}.${Math.floor(time.ms)}`;
    }

    TimeToClockString(elapsedTime)
    {
        let time = {
            m: 0,
            s: 0,
            ms: 0
        }

        let ms = (elapsedTime - Math.floor(elapsedTime));

        elapsedTime -= ms;

        time.ms = ms*1000;

        time.s = elapsedTime % 60;
        time.m = (elapsedTime - time.s) / 60;

        return this.GetTimeString(time);
    }

    ButtonHovered(button)
    {
        //consoleLog("BUTTON HOVERED");

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

        for(let i = 0 ; i< this.pbs.length; i++)
        {
            let pb = this.pbs[i];

            paper(0);
            rectf(pb.x * PIXEL_SCALE, pb.y * PIXEL_SCALE, pb.w * PIXEL_SCALE, pb.h * PIXEL_SCALE);

            pen(1);
            print(pb.time, (pb.x + pb.offX) * PIXEL_SCALE, (pb.y + pb.offY) * PIXEL_SCALE);
        }

        for(let i = 0; i < this.pages[this.currentPage].components.length; i ++)
        {
            let component = this.pages[this.currentPage].components[i];

            if(component.type === "Rect")
            {
                paper(component.colour);
                rectf((this.root.x + component.x) * PIXEL_SCALE, (this.root.y + component.y) * PIXEL_SCALE, component.w * PIXEL_SCALE, component.h * PIXEL_SCALE);
            }

            if(component.type === "Text")
            {
                let text = component.text;
                
                if(component.overwriteText)
                {
                    text = component.overwriteText;
                }
                
                
                pen(component.colour);

                if(component.ignoreRoot)
                {
                    print(text, (component.x) * PIXEL_SCALE, (component.y) * PIXEL_SCALE);
                }
                else
                {
                    print(text, (this.root.x + component.x) * PIXEL_SCALE, (this.root.y + component.y) * PIXEL_SCALE);
                }
                
            }

            if(component.type === "Sprite")
            {
                sprite(component.index, (this.root.x + component.x) * PIXEL_SCALE, (this.root.y + component.y) * PIXEL_SCALE);
            }
        }
    }    
}