import { consoleLog, EM, SETUP } from "../main";
import Button from "./Button";
import Carousel from "./Carousel";

export default class Menu
{
    constructor(levelData)
    {
        this.modeSelectRoot = { x: levelData.modeSelectRoot.x, y: levelData.modeSelectRoot.y };
        this.modeSelectButtonDim = { w: levelData.modeSelectRoot.w, h: levelData.modeSelectRoot.h, s: levelData.modeSelectRoot.s };

        this.modeOptionsRoot = { x: levelData.modeOptionsRoot.x, y: levelData.modeOptionsRoot.y };
        this.modeOptionsDims = { w: levelData.modeOptionsRoot.w, h: levelData.modeOptionsRoot.h, s: levelData.modeOptionsRoot.s };

        this.confirmData = levelData.confirmButton;

        this.confirmButton = null;
        
        this.selectedMode = null;

        this.modeButtons = [];
        this.modeOptionControls = [];

        this.modeData = levelData.modes;
        this.modeOptionData = levelData.modeOptions;

        this.BuildModeSelection(this.modeData);

        EM.RegisterEntity(this);
    }

    ModeButtonClick(buttonData)
    {
        for(let i = 0; i < this.modeData.length; i ++)
        {
            let mode = this.modeData[i];

            if(mode.name === buttonData.display)
            {
                this.ClearOptions();
                this.selectedMode = mode;
                this.LoadModeOptions(mode, this.modeOptionData);
                break;
            }
        }
    }

    ClearOptions()
    {
        for(let i = 0; i < this.modeOptionControls.length; i ++)
        {
            if(this.modeOptionControls[i].Delete)
            {
                this.modeOptionControls[i].Delete();
            }
            EM.RemoveEntity(this.modeOptionControls[i]);            
        }

        if(this.confirmButton)
        {
            EM.RemoveEntity(this.confirmButton);
        }

        this.modeOptionControls = [];
    }

    CreateConfirmButton()
    {
        this.confirmButton = new Button(
            {
                x: this.confirmData.x,
                y: this.confirmData.y,               
            },
            {
                w: this.confirmData.w,
                h: this.confirmData.h
            },
            {
                display: this.confirmData.display,
                renderLayer: "MENU_UI"
            });

        let caller = this;

        this.confirmButton.ClickCallback = () => { caller.LoadConfiguredArena(); }
    }

    GetControl(controlName)
    {
        let returnControl = null;
        for(let i = 0; i < this.modeOptionControls.length; i ++)
        {
            if(this.modeOptionControls[i].controlName === controlName)
            {
                returnControl = this.modeOptionControls[i];
                break;
            }
        }

        return returnControl;
    }

    LoadConfiguredArena()
    {
        let arenaControl = this.GetControl("Arena");

        consoleLog(`Load in mode:`);
        consoleLog(this.selectedMode);
        
        let players = 1;
        if(this.selectedMode.name === "2 Player")
        {
            players = 2;
        }



        let ai = null;  

        if(players ===  1)
        {
            let aiControl = this.GetControl("AI");

            ai = aiControl.GetSelectedValue();
        }

        let mapDeteriorateControl = this.GetControl("Map Damage");

        let levelConfig = {
            players: players,
            ai: ai,
            mapDeteriorate: mapDeteriorateControl.GetSelectedValue(),
        };

        SETUP(arenaControl.GetSelectedValue(), levelConfig);
    }

    LoadModeOptions(mode, modeOptionControls)
    {
        for(let i = 0; i < mode.options.length; i ++)
        {
            let optName = mode.options[i];

            for(let j = 0; j < modeOptionControls.length; j ++)
            {
                let moControl = null;
                let moc = modeOptionControls[j];

                if(optName === moc.name)
                {
                    if(moc.type === "Carousel")
                    {
                        let x = this.modeOptionsRoot.x;
                        let y = this.modeOptionsRoot.y + i * (this.modeOptionsDims.h + this.modeOptionsDims.s);

                        moControl = new Carousel(
                            { 
                                x: x, 
                                y: y, 
                                w: this.modeOptionsDims.w, 
                                h: this.modeOptionsDims.h 
                            },
                            moc.options,
                            `${moc.name}:`);
                    }
                    else
                    {                        
                        let buttonPos = { x: this.modeSelectRoot.x + 10, y: this.modeSelectRoot.y + i * (this.modeSelectButtonDim.h + this.modeSelectButtonDim.s)  };
                        let buttonDims = { w: this.modeSelectButtonDim.w, h: this.modeSelectButtonDim.h };

                        moControl = new Button(buttonPos, buttonDims, 
                            { 
                                display: moc.name, 
                                renderLayer: "MENU_UI",
                                offset: { x: 2, y: 2 }
                            });
                    }
                }

                if(moControl)
                {
                    moControl.controlName = moc.name;
                    this.modeOptionControls.push(moControl);
                }
            }
        }

        this.CreateConfirmButton();
    }

    BuildModeSelection(modes)
    {
        for(let i = 0; i < modes.length; i ++)
        {
            let buttonPos = { x: this.modeSelectRoot.x, y: this.modeSelectRoot.y + i * (this.modeSelectButtonDim.h + this.modeSelectButtonDim.s)  };
            let buttonDims = { w: this.modeSelectButtonDim.w, h: this.modeSelectButtonDim.h };

            let newButton = new Button(buttonPos, buttonDims, 
                { 
                    display: modes[i].name, 
                    renderLayer: "MENU_UI",
                    offset: { x: 2, y: 2 }
                });

            let caller = this;
            newButton.ClickCallback = (buttonData) => { caller.ModeButtonClick(buttonData); };

            this.modeButtons.push(newButton);
        }
    }
}