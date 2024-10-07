import { vec2 } from "p2";
import Texture from "pixelbox/Texture";
import { consoleLog, EM, PIXEL_SCALE } from "../main";

export default class PathIndicator 
{
    constructor(parent, child, options)
    {
        this.renderLayer = "WORLD";

        this.minDim = 4;

        this.visible = true;
        this.log = false;
        this.blipColour = 1;
        this.phase = 0;
        this.phases = 10;
        this.phaseTime = 0.5;
        this.phaseTimer = 0;
        
        if(options)
        {
            if(options.log)
            {
                this.log = options.log;
            }    

            if(options.blipColour || options.blipColour === 0)
            {
                this.blipColour = options.blipColour   
            }

            if(options.phases)
            {
                this.phases = options.phases;
            }

            if(options.phaseTime)
            {
                this.phaseTime = options.phaseTime;
            }
        }

        this.parent = parent;
        this.child = child;

        this.connectorTexture = null;
        this.texturePos = { x: 0, y: 0 };

        EM.RegisterEntity(this);
    }

    SetVisibility(visibility)    
    {
        this.visible = visibility;
    }

    GetNodeScreenPosition(node)
    {
        if(node.GetDrawPosition)
        {
            return node.GetDrawPosition();
        }

        return node.GetScreenPos();
    }

    BuildConnectorTexture()
    {
        let parentScreenPos = this.GetNodeScreenPosition(this.parent);
        let childScreenPos = this.GetNodeScreenPosition(this.child);

        let tl = {
            x: (parentScreenPos.x < childScreenPos.x ? parentScreenPos.x : childScreenPos.x) + 0.5 * PIXEL_SCALE,
            y: (parentScreenPos.y < childScreenPos.y ? parentScreenPos.y : childScreenPos.y) + 0.5 * PIXEL_SCALE
        }

        let br = {
            x: (parentScreenPos.x > childScreenPos.x ? parentScreenPos.x : childScreenPos.x) + 0.5 * PIXEL_SCALE,
            y: (parentScreenPos.y > childScreenPos.y ? parentScreenPos.y : childScreenPos.y) + 0.5 * PIXEL_SCALE
        }

        let w = br.x - tl.x;
        let h = br.y - tl.y;

        if(w < this.minDim) w = this.minDim;
        if(h < this.minDim) h = this.minDim;

        if(!this.connectorTexture)
        {
            this.connectorTexture = new Texture(w, h);
        }
        else
        {
            this.connectorTexture.clear();
            this.connectorTexture.resize(w, h);
        }
        
        let childTexturePos = { x: childScreenPos.x + 0.5 * PIXEL_SCALE - tl.x, y: childScreenPos.y + 0.5 * PIXEL_SCALE - tl.y };
        let parentTexturePos = { x: parentScreenPos.x + 0.5 * PIXEL_SCALE - tl.x, y: parentScreenPos.y + 0.5 * PIXEL_SCALE - tl.y };

        let childToParentVector = { x: parentTexturePos.x - childTexturePos.x, y: parentTexturePos.y - childTexturePos.y };
        
        let v = [ childToParentVector.x, childToParentVector.y ];
        let cv = [ childTexturePos.x, childTexturePos.y ];
        let nv = [];

        vec2.normalize(nv, v);

        let vectorLength = Math.ceil(vec2.len(v));

        this.connectorTexture.pen(this.blipColour);
        this.connectorTexture.paper(this.blipColour);

        for(let i = 0; i < vectorLength; i ++)
        {
            let mv = [];

            vec2.scale(mv, nv, i);

            let dv = [];

            vec2.add(dv, cv, mv);

            if(i%this.phases===this.phase)
            {
                this.connectorTexture.rectf(dv[0], dv[1], 1, 1);
            }
        }

        this.texturePos.x = tl.x;
        this.texturePos.y = tl.y;
    }

    UpdatePhaseTimer(deltaTime)
    {
        this.phaseTimer += deltaTime;

        if(this.phaseTimer >= this.phaseTime)
        {
            this.phaseTimer -= this.phaseTime;

            this.phase = (this.phase + 1) % this.phases;
        }
    }

    Delete()
    {
        EM.RemoveEntity(this);
    }

    Update(deltaTime)
    {
        this.UpdatePhaseTimer(deltaTime);
    }

    Draw()
    {
        if(this.visible)
        {
            this.BuildConnectorTexture();

            draw(this.connectorTexture, this.texturePos.x, this.texturePos.y); 
        }
    }


}