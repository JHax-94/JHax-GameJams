import { EM, PIXEL_SCALE, TILE_HEIGHT, TILE_WIDTH } from "../main";

export default class OffscreenIndicator
{
    constructor(celestial)
    {
        this.renderLayer = "INDICATORS";

        this.celestial = celestial;

        EM.RegisterEntity(this);
    }

    Draw()
    {
        let screenPos = this.celestial.GetScreenPos();
        let indicatorPos = { x: screenPos.x, y: screenPos.y }
        let drawIndicator = false;

        if(indicatorPos.x < -PIXEL_SCALE)
        {
            drawIndicator = true;
            indicatorPos.x = 0;
        }
        else if(indicatorPos.x >= TILE_WIDTH * PIXEL_SCALE)
        {
            indicatorPos.x = TILE_WIDTH * PIXEL_SCALE - PIXEL_SCALE;
            drawIndicator = true;
        }

        if(indicatorPos.y < -PIXEL_SCALE)
        {
            drawIndicator = true;
            indicatorPos.y = 0;
        }
        else if(indicatorPos.y >= TILE_HEIGHT * PIXEL_SCALE)
        {
            indicatorPos.y = TILE_HEIGHT *PIXEL_SCALE - PIXEL_SCALE
            drawIndicator = true;
        }

        if(drawIndicator)
        {
            paper(0);
            rectf(indicatorPos.x, indicatorPos.y, PIXEL_SCALE, PIXEL_SCALE);
            pen(1);
            rect(indicatorPos.x, indicatorPos.y, PIXEL_SCALE, PIXEL_SCALE);
            this.celestial.symbolTex._drawEnhanced(indicatorPos.x, indicatorPos.y);
        }
    }
    
}