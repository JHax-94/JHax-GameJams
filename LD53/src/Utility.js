import { PIXEL_SCALE } from "./main";

export default class Utility
{
    GetTextHeight(text, font)
    {
        let height = 0;

        if(font)
        {
            height = font.charHeight / PIXEL_SCALE;
        }
        else 
        {
            height = 5 / PIXEL_SCALE;
        }

        return height;
    }

    GetTextWidth(text, font)
    {
        let width = 0;

        if(font)
        {
            width = font.charWidth * text.length / PIXEL_SCALE;
        }
        else 
        {
            width = ((4 * text.length) - 1) / PIXEL_SCALE;
        }

        return width;
    }

    GetTextCentred(rect, text, font)
    {
        let coords = null;
        
        if(!font)
        {
            coords = {
                x: (rect.x + 0.5 * rect.w) * PIXEL_SCALE - 2*text.length, 
                y: (rect.y + 0.5* rect.h) * PIXEL_SCALE - 3
            };
        }
        else
        {
            coords = {
                x: (rect.x + 0.5 * rect.w) * PIXEL_SCALE - 0.5*font.charWidth*text.length, 
                y: (rect.y + 0.5* rect.h) * PIXEL_SCALE - Math.round(0.5*font.charHeight)
            };
        }
        
        return coords;
    }
}