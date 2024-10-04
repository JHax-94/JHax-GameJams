import { EM, PIXEL_SCALE, UTIL, consoleLog, getFont, setFont } from "../main";
import UiComponent from "./UiComponent";

export default class UiGroup extends UiComponent
{
    constructor(components, root, parent, animClock, opts)
    {
        super(parent);

        this.log = false;
        this.fontName = "Default"

        if(opts)
        {
            this.log = !!opts.log;

            if(opts.font)
            {
                this.fontName = opts.font;
            }
        }

        //this.parent = parent;
        this.root = { x: 0, y: 0 };
        this.visible = true;
        this.components = [];
        this.CopyComponents(components);

        this.bounds = {};

        this.bounds = this.CalculateComponentBounds();

        this.root = this.GetRoot(root);

        this.animClock = animClock;
        this.animTime = 0;

        this.BuildAnims()

        if(this.log)
        {
            consoleLog(">>> UI GROUP CONSTRUCTED <<<");
            consoleLog(this);    
        }
        
        this.font = getFont(this.font);
    }

    GetRoot(root)
    {
        let pDims = this.ParentDims();

        if(root.x === "c")
        {
            root.x = this.bounds.x + 0.5 * (pDims.w - this.bounds.w);        
        }

        if(root.y === "c")
        {
            root.y = this.bounds.y + 0.5 * (pDims.h - this.bounds.h);
        }

        return root;
    }

    CopyComponents(components)
    {
        for(let i = 0; i < components.length; i ++)
        {
            this.components.push(Object.assign({}, components[i]));
        }
    }

    CalculateComponentBounds()
    {
        let minX = 0;
        let minY = 0;
        let maxX = 0;
        let maxY = 0;

        for(let i = 0; i < this.components.length; i ++)
        {
            let c = this.components[i];
            let w = 0;
            let h = 0;

            if(c.i || c.a)
            {
                w = 1;
                h = 1;
            }
            else if(c.text)
            {
                h = UTIL.GetTextHeight(c.text, this.font);
                w = UTIL.GetTextWidth(c.text, this.font);
            }
            else
            {
                w = c.w;
                h = c.h;
            }

            if(c.x < minX)
            {
                minX = c.x;
            }

            if(c.y < minY)
            {
                minY = c.y;
            }

            if(c.x + w > maxX)
            {
                maxX = c.x + w;                
            }

            if(c.y + h > maxY)
            {
                maxY = c.y + h;
            }
        }

        return {
            x: minX,
            y: minY,
            w: maxX - minX,
            h: maxY - minY
        };
    }

    BuildAnims()
    {
        this.anims = [];

        for(let i = 0; i < this.components.length; i ++)
        {
            let c = this.components[i];

            if(c.a)
            {
                c.frame = 0;
            }
        }
    }

    GetBase()
    {
        let base = { 
            x: 0,
            y: 0
        };

        let rootPos = this.RootPos();
        base.x += rootPos.x;
        base.y += rootPos.y;

        if(this.root)
        {
            base.x += this.root.x;
            base.y += this.root.y;
        }

        return base;
    }

    SetVisibility(visibility)
    {
        this.visible = visibility;
    }

    DrawSpriteComponent(base, c)
    {
        let x = (base.x + c.x) * PIXEL_SCALE;
        let y = (base.y + c.y) * PIXEL_SCALE;

        sprite(c.i, x, y, c.h, c.v, c.r);
    }
    
    DrawLabelComponent(base, c)
    {
        setFont(this.font.img);
        pen(0);
        print(c.text, (base.x + c.x) * PIXEL_SCALE, (base.y + c.y) * PIXEL_SCALE);
    }

    DrawRectComponent(base, c)
    {
        paper(0);

        rectf((base.x + c.x) * PIXEL_SCALE, (base.y + c.y) * PIXEL_SCALE, c.w, c.h);
    }

    DrawAnimated(base, c)
    {
        let f = c.a[c.frame];

        /*consoleLog(`Anim frame: ${c.frame}`);
        consoleLog(f);*/
        sprite(f.i, (base.x + c.x) * PIXEL_SCALE, (base.y + c.y) * PIXEL_SCALE, f.h, f.v, f.r);
    }

    DrawBounds(base)
    {
        //let rp = this.GetBase();

        let boundsRect = {
            x: (base.x) * PIXEL_SCALE,
            y: (base.y) * PIXEL_SCALE,
            w: this.bounds.w * PIXEL_SCALE,
            h: this.bounds.h * PIXEL_SCALE
        };

        /*
        consoleLog("UI GROUP BOUNDS");
        consoleLog(boundsRect);
        */
        paper(18);
        rectf(boundsRect.x, boundsRect.y, boundsRect.w, boundsRect.h);
    }

    Draw()
    {
        if(this.visible)
        {
            if(this.log)
            {
                consoleLog("UI GROUP");
                consoleLog(this);
            }

            let base = this.GetBase();

            /*consoleLog("BASE ");
            consoleLog(base);*/
            this.DrawBounds(base);
            for(let i = 0; i < this.components.length; i ++)
            {
                let c = this.components[i];

                if(c.i)
                {
                    this.DrawSpriteComponent(base, c);
                }
                else if(c.a)
                {
                    this.DrawAnimated(base, c);
                }
                else if(c.text)
                {
                    this.DrawLabelComponent(base, c);
                }
                else
                {
                    this.DrawRectComponent(base, c);
                }
            }
        }
    }

    Update(deltaTime)
    {
        this.animTime += deltaTime;

        if(this.animTime >= this.animClock)
        {
            this.animTime -= this.animClock;

            for(let i = 0; i < this.components.length; i ++)
            {
                let c = this.components[i];

                if(c.a)
                {
                    c.frame = (c.frame + 1) % c.a.length;
                }
            }
        }
    }
}