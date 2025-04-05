import { EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH, consoleLog } from "../main";
import FloatControl from "./FloatControl";

export default class UiComponent
{
    constructor(parent, settingSrc = null)
    {
        this.settings = settingSrc;
        this.changeListeners = [];
        this.parent = null;
        this.pos = { x: 0, y: 0 };
        this.dims = { w: 0, h: 0 };

        this.floatControl = null;
        if(this.settings && this.settings.floatControl)
        {
            this.floatControl = new FloatControl(this.settings.floatControl, this);
        }
    
        this.visible = true;

        this.children = [];

        this.preBuiltTree = null;

        if(parent)
        {
            this.parent = parent;

            if(this.parent.AddChild)
            {
                this.parent.AddChild(this);
            }

            this.renderLayer = this.parent.renderLayer;
        }
    }

    SetVisibility(visibility)
    {
        this.visible = visibility;
    }

    Destruct()
    {
        if(this.floatControl)
        {
            EM.RemoveEntity(this.floatControl);
        }
    }

    Visible()
    {
        return this.visible;
    }

    GetSetting(settingName, setSetting = null)
    {
        let log = false;
        if(log)
        {
            consoleLog(`Find setting ${settingName} in:`);
            consoleLog(this.settings);
        }

        let settingVal = null;

        if(this.settings && this.settings[settingName] != null)
        {
            settingVal = this.settings[settingName];
        }
        else if(this.parent && this.parent.GetSetting)
        {
            settingVal = this.parent.GetSetting(settingName);
        }

        if(settingVal != null && setSetting)
        {
            setSetting(settingVal);
        }

        return settingVal;
    }

    AddChangeEventListenerToComponent(callback)
    {
        this.changeListeners.push(callback);
    }

    ChangeEvent()
    {
        for(let i = 0; i < this.changeListeners.length; i ++)
        {
            consoleLog("Change event:");
            consoleLog(this.changeListeners[i]);


            this.changeListeners[i](this);
        }
    }

    Focus(setFocus)
    {
        this.focused = setFocus;
    }

    AddChild(child)
    {
        this.children.push(child);
    }

    ParentPos()
    {
        let pos = {
            x: 0,
            y: 0
        };

        if(this.parent)
        {
            if(this.parent.GetScreenPos)
            {
                let screenPos = this.parent.GetScreenPos();

                //EM.hudLog.push(`>>>>> Pos wrt: (${screenPos.x}, ${screenPos.y})`);

                pos.x = screenPos.x;
                pos.y = screenPos.y;
            }
            else if(this.parent.pos)
            {
                pos.x = this.parent.pos.x;
                pos.y = this.parent.pos.y;
            }
        }

        return pos;
    }

    ParentDims()
    {
        let dims = {
            w: TILE_WIDTH,
            h: TILE_HEIGHT
        };

        if(this.parent && this.parent.dims)
        {
            dims.w = this.parent.dims.w;
            dims.h = this.parent.dims.h;
        }

        return dims;
    }

    CalculateBounds()
    {
        let minX = 0;
        let minY = 0;
        let maxX = 0;
        let maxY = 0;

        for(let i = 0; i < this.children.length; i ++)
        {
            let c = this.children[i];

            if(c.pos.x < minX)
            {
                minX = c.pos.x;            
            }

            if(c.pos.y < minY)
            {
                minY = c.pos.y;
            }

            if(c.pos.x + c.dims.w > maxX)
            {
                maxX = c.pos.x + c.dims.w;
            }

            if(c.pos.y + c.dims.h > maxY) 
            {
                maxY = c.pos.y + c.dims.h;
            }
        }

        return {
            x: minX,
            y: minY,
            w: maxX - minX,
            h: maxY - minY
        };
    }

    GetRect(log = false)
    {
        let pos = this.RootPos(log);
        
        let rect = {
            x: pos.x,
            y: pos.y,
            w: this.dims.w,
            h: this.dims.h
        };

        if(log)
        {
            consoleLog(rect);
        }

        return rect;
    }

    GetTree()
    {
        let tree = [];
        if(this.preBuiltTree)
        {
            tree = this.preBuiltTree;
        }
        else
        {
            let node = this;
            let maxDepth = 5;
            let depth = 0;

            while(node && depth < maxDepth) 
            {
                depth ++;
                tree.push(node);

                node = node.parent;
            }
        
            if(!this.preBuiltTree)
            {
                this.preBuiltTree = tree;
            }
        }

        /*consoleLog("Returning Tree:");
        consoleLog(tree);*/

        return tree;
    }

    Pos()
    {
        let p = { x: this.pos.x, y: this.pos.y }; 

        if(this.floatControl)
        {
            this.floatControl.ApplyFloat(p);
        }

        return p;
    }

    RootPos(log = false)
    {
        let pos = { x:0, y: 0};
        let uiTree = this.GetTree();
        
        if(log)
        {
            consoleLog("Root pos from tree:");
            consoleLog(uiTree);
        }
    
        for(let i = 0; i < uiTree.length; i ++)
        {
            if(uiTree[i].Pos)
            {
                let treePos = uiTree[i].Pos();

                pos.x += treePos.x;
                pos.y += treePos.y;
            }
            else if(uiTree[i].GetScreenPos)
            {
                let treePos = uiTree[i].GetScreenPos();

                pos.x += treePos.x / PIXEL_SCALE;
                pos.y += treePos.y / PIXEL_SCALE;
            }
        }

        return pos;
    }
}