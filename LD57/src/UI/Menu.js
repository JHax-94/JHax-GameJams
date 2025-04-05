import Button from "./Button";
import LoadButton from "./LoadButton";
import { consoleLog, DESKTOP_MODE, EM, getObjectConfig, PIXEL_SCALE, SETUP, TILE_HEIGHT, TILE_WIDTH, UI_BUILDER, UTIL, utils } from "../main";
import Rect from "./Rect";
import UiComponent from "./UiComponent";



export default class Menu extends UiComponent
{
    constructor(menuData, menuParams, modeFilter, parent)
    {
        consoleLog("===Build Menu===");
        consoleLog(menuData);
        consoleLog(menuParams);
        consoleLog(modeFilter);
        let settings = null;
        
        if(menuData.settings)
        {
            settings = menuData.settings;
        }

        super(parent, settings);

        if(menuData.renderLayer)
        {
            this.renderLayer = menuData.renderLayer;
        }

        this.inputDelay = 0;

        this.logging = false;

        if(menuParams && menuParams.logging)
        {
            this.logging = true;
        }

        this.modeFilter = null;
        if(modeFilter)
        {
            this.modeFilter = modeFilter;
        }
        this.menuParams = menuParams;

        if(this.menuParams && this.menuParams.title)
        {
            consoleLog(`--- Constructing menu: ${this.menuParams} ---`);
            consoleLog(menuData);
            consoleLog(menuParams);
        }

        this.inputDetectFilter = "MENU";
        this.handleBack = false;

        if(menuData && menuData.handleBack)
        {
            this.handleBack = true;
        }

        this.variables = {};

        this.visible = true;
        this.focus = true;
        if(parent)
        {
            this.focus = false;
        }

        if(menuParams && menuParams.variables)
        {
            this.variables = menuParams.variables;
        }

        this.buttonWaits = {
            a: false,
            b: false,
            x: false,
            y: false,
            start: false
        };

        this.menuData = menuData;

        this.menuGroup = 0;

        this.componentSrc = [];
        this.components = [];
        this.conditionalComponents = [];
        /*
        this.highlightButton = -1;
        this.buttons = [];
        */
        this.highlightComponent = -1;

        this.baseDims = { x: 0, y: 0, w: TILE_WIDTH, h: TILE_HEIGHT };

        if(menuData.baseDims)
        {
            if(menuData.baseDims.x)
            {
                this.baseDims.x = menuData.baseDims.x;
            }
            if(menuData.baseDims.y)
            {
                this.baseDims.y = menuData.baseDims.y;
            }

            if(menuData.baseDims.w)
            {
                this.baseDims.w = menuData.baseDims.w;                
            }
            if(menuData.baseDims.h)
            {
                this.baseDims.h = menuData.baseDims.h;
            }
        }

        this.dims = {};
        
        this.UpdateDimsFromBase();

        this.yRests = [];
        this.xRests = [];

        this.actionQueue = [];

        this.CheckComponentsSource();
        this.BuildComponents();
        this.InitialiseConditionals();
        /*
        EM.LogRenderList();
        consoleLog("MENU CONSTRUCTED");
        consoleLog(this);*/

        if(menuData.vignette)
        {
            new Vignette(menuData.vignette);
        }

        this.unfocused = null;
        this.focusTimer = 0;
        this.focusTime = 0;

        if(menuData.unfocused)
        {
            this.unfocused = menuData.unfocused;

            this.focusTime = menuData.unfocused.time;
        }


        this.SetPositionForFocus();

        EM.RegisterEntity(this);
    }

    CheckComponentsSource()
    {
        let componentsSrc = this.menuData.components;

        if(!componentsSrc)
        {
            console.warn("Menu has no components");
        }
        else if(componentsSrc.constructor === [].constructor)
        {
            this.componentSrc = componentsSrc;
        }
        else if(componentsSrc.constructor === "".constructor)
        {
            this.componentSrc = getObjectConfig(componentsSrc, true).components;
        }
        else
        {
            console.error("Component Source not supported");
        }

        consoleLog("Component Source:");
        consoleLog(this.componentSrc);
    }

    SetPositionForFocus()
    {
        if(this.unfocused && this.unfocused.pos)
        {
            if(this.focus)
            {
                this.dims.x = this.baseDims.x;
                this.dims.y = this.baseDims.y;
            }
            else
            {
                if(this.unfocused.pos.x || this.unfocused.pos.x === 0) this.dims.x = this.unfocused.pos.x;
                if(this.unfocused.pos.y || this.unfocused.pos.y === 0) this.dims.y = this.unfocused.pos.y;
            }
        }
    }

    UpdateDimsFromBase()
    {
        this.dims.x = this.baseDims.x;
        this.dims.y = this.baseDims.y;
        this.dims.w = this.baseDims.w;
        this.dims.h = this.baseDims.h;
    }

    MoveToPositionForFocus()
    {
        
    }

    GetYRest(index)
    {
        let yRest = null;
        
        for(let i = 0; i < this.yRests.length; i ++)
        {
            if(this.yRests[i].index === index)
            {
                yRest = this.yRests[i];
                break;
            }
        }
        
        if(!yRest)
        {
            yRest = { index: index, wait: false };

            this.yRests.push(yRest);
        }

        return yRest;
    }

    GetXRest(index)
    {
        let xRest = null;

        for(let i = 0; i < this.xRests.length; i ++)
        {
            if(this.xRests[i].index === index)
            {
                xRest = this.xRests[i];
                break;
            }
        }

        if(!xRest)
        {
            xRest = { index: index, wait: false };

            this.xRests.push(xRest);
        }

        return xRest;
    }

    GetComponentOfType(type)
    {
        let component = null;

        for(let i = 0; i < this.components.length; i ++)
        {
            if(this.components[i] instanceof type)
            {
                component = this.components[i];
                break;
            }
        }

        return component;
    }

    InputDetectInternal(state, gamepadIndex)
    {

    }

    InputDetect(state, gamepadIndex)
    {
        if(this.inputDelay <= 0 && this.visible)
        {
            let yRest = this.GetYRest(gamepadIndex);
            let xRest = this.GetXRest(gamepadIndex);

            let yIn = state.GetAxis("y");
            let xIn = state.GetAxis("x");

            if(yIn > 0.3 && yRest.wait === false)
            {
                yRest.wait = true;
                this.actionQueue.push({ action: "Move", dir: 1 });
            }
            else if(yIn < -0.3 && yRest.wait === false)
            {
                yRest.wait = true;
                this.actionQueue.push({ action: "Move", dir: -1 });            
            }

            if(yRest.wait && Math.abs(yIn) < 0.2)
            {
                yRest.wait = false;
            }

            if(xIn > 0.4 && xRest.wait === false)
            {
                xRest.wait = true;
                this.actionQueue.push({ action: "Change", dir: 1 });
            }
            else if(xIn < -0.4 && xRest.wait === false)
            {
                xRest.wait = true;
                this.actionQueue.push({ action: "Change", dir: -1 });
            }
            
            if(xRest.wait && Math.abs(xIn) < 0.2)
            {
                xRest.wait = false;
            }

            let menu = this;

            this.ButtonCheck(state.GetAction("accept").state, `a_${gamepadIndex}`, () => { menu.ButtonAClick(); });
            this.ButtonCheck(state.GetAction("reject").state, `b_${gamepadIndex}`, () => { menu.ButtonBClick(gamepadIndex); });
            this.ButtonCheck(state.GetAction("antiClockSpin").state, `x_${gamepadIndex}`, () => { menu.ButtonXClick(); });
            this.ButtonCheck(state.GetAction("clockSpin").state, `y_${gamepadIndex}`, () => { menu.ButtonYClick(); });
            this.ButtonCheck(state.GetAction("pause").state, `start_${gamepadIndex}`, () => { menu.ButtonStartClick(); }); 

            this.InputDetectInternal(state, gamepadIndex);
        }
    }

    ButtonCheck(btn, waitKey, clickEvent)
    {
        if(btn && !this.buttonWaits[waitKey])
        {
            this.buttonWaits[waitKey] = true;
        }
        else if(this.buttonWaits[waitKey] && !btn)
        {
            this.buttonWaits[waitKey] = false;
            if(clickEvent)
            {
                clickEvent();
            }
        }
    }

    ButtonAClick()
    {
        if(this.highlightComponent >= 0)
        {
            if(this.components[this.highlightComponent].Submit)
            {
                this.components[this.highlightComponent].Submit();
            }
        }
    }

    ButtonBClick()
    {
        if(this.handleBack)
        {
            SETUP("MainMenu");
        }
    }

    ButtonXClick()
    {

    }

    ButtonYClick()
    {

    }

    ButtonStartClick()
    {

    }

    Focus(focus)
    {
        this.focus = focus;

        if(!this.focus)
        {
            this.highlightComponent = -1;
        }

        this.MoveToPositionForFocus();
    }

    ChangeSelection(dir)
    {
        consoleLog(`Change selection - group: ${this.menuGroup}, old highlight: ${this.highlightComponent}, dir: ${dir}`);

        if(this.components.length > 0)
        {
            let oldHighlight = this.highlightComponent;

            if(this.highlightComponent < 0)
            {
                dir = 1;
            }

            let newHighlight = -1;

            for(let i = 0; i < this.components.length; i ++)
            {
                let tryNew = (this.highlightComponent + this.components.length + (i+1)*dir) % this.components.length;

                if(this.components[tryNew].Focus)
                {
                    let canFocus = false;

                    if(this.menuGroup)
                    {
                        canFocus = this.menuGroup === this.components[tryNew].menuGroup;
                    }
                    else 
                    {
                        canFocus = true;
                    }

                    if(canFocus && this.components[tryNew].hide === true)
                    {
                        canFocus = false;
                    }

                    if(canFocus)
                    {
                        newHighlight = tryNew;
                        break;
                    }
                }
            }
            
            this.highlightComponent = newHighlight;
            
            if(this.highlightComponent != oldHighlight)
            {
                if(oldHighlight >= 0)
                {
                    this.components[oldHighlight].Focus(false);
                }
                /*
                consoleLog(`Set new focus: ${this.highlightComponent}`);
                consoleLog(this.components[this.highlightComponent]);
                */
                if(this.highlightComponent >= 0)
                {
                    this.components[this.highlightComponent].Focus(true);
                }
            }
        }
    }

    ClearComponents()
    {
        for(let i = 0; i < this.components.length; i ++)
        {
            EM.RemoveEntity(this.components[i]);
        }
    }

    SelectedComponentDoChange(dir)
    {
        let selected = this.components[this.highlightComponent];

        if(selected && selected.ChangeBy)
        {
            selected.ChangeBy(dir);

            this.CheckConditionals(selected);
        }
    }

    CheckConditionals(changed)
    {
        for(let i = 0; i < this.conditionalComponents.length; i ++)
        {
            let condition = this.conditionalComponents[i];

            if(changed.id === condition.triggerId)
            {
                condition.comp.Hide(condition.triggerVal !== changed.GetSelectedValue());
            }
        }
    }

    InitialiseConditionals()
    {
        for(let i = 0; i < this.conditionalComponents.length; i ++)
        {
            let condition = this.conditionalComponents[i];

            let triggerComp = this.GetComponentById(condition.triggerId);

            condition.comp.Hide(condition.triggerVal !== triggerComp.GetSelectedValue());
        }
    }

    UpdateInternal(deltaTime) {}

    Update(deltaTime)
    {
        if(this.inputDelay > 0)
        {
            consoleLog("Decrement input delay...");
            this.inputDelay -= deltaTime;
        }
        else
        {
            for(let i = 0; i < this.actionQueue.length; i ++)
            {
                let action = this.actionQueue[i];

                if(action.action === "Move")
                {
                    this.ChangeSelection(action.dir);
                }
                else if(action.action === "Change")
                {
                    this.SelectedComponentDoChange(action.dir);
                }
            }
        }

        if(this.unfocused)
        {
            let timerChanged = false;

            let changeMode = null;

            if(this.focus && this.focusTimer < this.focusTime)
            {
                timerChanged = true;
                changeMode = "+";
                this.focusTimer += deltaTime;

                if(this.focusTimer >= this.focusTime)
                {
                    this.focusTimer = this.focusTime;
                    this.ChangeSelection(1);
                }
            }
            else if(!this.focus && this.focusTimer > 0)
            {
                changeMode = "-";
                timerChanged = true;
                this.focusTimer -= deltaTime;

                if(this.focusTimer <= 0)
                {
                    this.focusTimer = 0;
                }
            }

            EM.hudLog.push(`Menu ${this.id} Focus timer: ${this.focusTimer} / ${this.focusTime} [${changeMode}]`);

            if(timerChanged && this.unfocused.pos)
            {
                if(this.unfocused.pos.x || this.unfocused.pos.x === 0)
                {
                    this.dims.x = utils.lerp(this.unfocused.pos.x, this.baseDims.x, this.focusTimer / this.focusTime);
                }

                if(this.unfocused.pos.y || this.unfocused.pos.y === 0)
                {
                    this.dims.y = utils.lerp(this.unfocused.pos.y, this.baseDims.y, this.focusTimer / this.focusTime);
                }
            }

        }  

        this.UpdateInternal(deltaTime);

        this.actionQueue = [];
    }

    CharSelectAllReady(completeSelect)
    {
    }

    Pos()
    {
        return this.dims;
    }

    CustomButtonEvents(button, comp)
    {
        let bound = false;

        if(comp.buttonClass !== "Load")
        {
            //consoleLog(`Button Calls: ${comp.settings.buttonCalls}`);

            if(comp.settings.buttonCalls && this[comp.settings.buttonCalls])
            {
                //consoleLog("Button event found!");

                let menu = this;

                button.ClickEvent = () => { menu[comp.settings.buttonCalls](); }
                bound = true;
            }
        }

        if(!bound && this.parent)
        {
            this.parent.CustomButtonEvents(button, comp);
        }
    }

    CloseApplication()
    {
        window.close();
    }

    GetComponentById(id)
    {
        let component = null;
        
        /*consoleLog(`Find component with ID: ${id} in list:`);
        consoleLog(this.components);*/
        let subMenus = [];

        for(let i = 0; i < this.components.length; i ++)
        {
            if(this.components[i].id && this.components[i].id === id)
            {
                component = this.components[i];
                break;
            }
            else if(this.components[i] instanceof Menu)
            {
                subMenus.push(this.components[i]);
            }
        }

        if(!component)
        {
            for(let i = 0; i < subMenus.length; i ++)
            {
                let subComp = subMenus[i].GetComponentById(id);

                if(subComp)
                {
                    component = subComp;
                    break;
                }
            }
        }

        return component;
    }

    SkipComponent(comp)
    {
        /*consoleLog("Check component skips?");
        consoleLog(comp);*/
        let skip = false;

        let modeFilterSkip = this.modeFilter && comp.mode && comp.mode !== this.modeFilter;
        let envSkip = comp.env === "DESKTOP_ONLY" && !DESKTOP_MODE;

        //consoleLog(`Mode skip: ${modeFilterSkip}, EnvSkip: ${envSkip}`);

        skip = modeFilterSkip || envSkip;

        return skip;
    }

    GetMenuParam(key)
    {
        let paramVal = null;
        if(this.menuParams)
        {
            paramVal = this.menuParams[key];
        }

        if(!paramVal && this.parent && this.parent.GetMenuParam)
        {
            paramVal = this.parent.GetMenuParam(key);
        }

        return paramVal;
    }

    BindChangeEvent(componentId, eventCallback)
    {
        let component = this.GetComponentById(componentId);

        if(!component)
        {
            console.warn(`Failed to bind event, component with id: ${componentId} is missing`);
        }
        else if(component.AddChangeEventListener)
        {
            component.AddChangeEventListener(eventCallback);
        }
    }

    SetVisibility(visibility)
    {
        if(this.visible !== visibility)
        {
            for(let i = 0; i < this.components.length; i ++)
            {
                this.components[i].SetVisibility(visibility);
            }

            this.visible = visibility;
        }
    }

    BuildComponents()
    {
        consoleLog("Build Components...");

        let menu = this;

        for(let i = 0; i < this.componentSrc.length; i ++)
        {
            let comp = this.componentSrc[i];

            if(comp.configName)
            {
                let rootConfig  = getObjectConfig(comp.configName, true);

                comp = UTIL.MergeConfigs(rootConfig, comp);
            }

            if(this.SkipComponent(comp))
            {
                consoleLog("Skip Component:");
                consoleLog(comp);
                continue;
            }

            let newComp = null;
            
            let newBase = { x: null, y: null };

            let dims = UI_BUILDER.CalculateDims(comp, this, newBase)

            if(comp.type === "Rect" )
            {
                let renderLayer = "MENU_UI";

                if(comp.renderLayer)
                {
                    renderLayer = comp.renderLayer;
                }

                newComp = new Rect(dims.x, dims.y, dims.w, dims.h, comp.colour, renderLayer, this);
            }
            else if(comp.type === "Button")
            {
                let newButton = null;

                if(comp.buttonClass === "Load")
                {
                    newButton = new LoadButton(dims, comp.settings, "MENU_UI", this);
                }
                else
                {
                    newButton = new Button(dims, comp.settings, "MENU_UI", this);
                }

                this.CustomButtonEvents(newButton, comp);

                newButton.Submit = () => { newButton.Click(0); };

                newComp = newButton;
            }
            else if(comp.type === "Group")
            {
                let group = new Menu(comp, null, this.modeFilter, this);
                newComp = group;
            }
            else if(comp.type === "Label")
            {
                newComp = UI_BUILDER.BuildUiElement(comp, this);
            }
            /*else if(comp.type === "Carousel")
            {
                newComp = UI_BUILDER.BuildUiElement(comp, this);
            }*/
            else if(comp.type === "Text")
            {
                newComp = UI_BUILDER.BuildUiElement(comp, this);
            } 
            else if(comp.type === "Pages")
            {
                newComp = UI_BUILDER.BuildUiElement(comp, this);
            }
            
            if(newBase.x !== null && newBase.y !== null)
            {
                this.baseDims.x = newBase.x;
                this.baseDims.y = newBase.y;
                this.baseDims.w = newBase.w;
                this.baseDims.h = newBase.h;

                this.UpdateDimsFromBase();
            }

            if(newComp)
            {
                if(comp.id)
                {
                    newComp.id = comp.id;
                }

                if(comp.menuGroup)
                {
                    newComp.menuGroup = comp.menuGroup;
                }

                
                if(comp.visibilityCondition)
                {
                    this.conditionalComponents.push({
                        triggerId: comp.visibilityCondition.id,
                        triggerVal: comp.visibilityCondition.value,
                        comp: newComp
                    });
                }

                /*
                consoleLog("Pushing to compsList");
                consoleLog(newComp);
                consoleLog("SRC:");
                consoleLog(comp);*/
                
                this.components.push(newComp);

                let addedAtIndex = this.components.length - 1;

                if(comp.startFocused)
                {   /*
                    consoleLog("Focusing:");
                    consoleLog(newComp);*/
                    newComp.Focus(true);
                    this.highlightComponent = addedAtIndex;
                    if(newComp.menuGroup)
                    {
                        this.menuGroup = newComp.menuGroup;
                    }
                }
            }
        }
    }
}
