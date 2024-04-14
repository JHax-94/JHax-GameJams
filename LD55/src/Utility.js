import { PIXEL_SCALE, consoleLog } from "./main";

export default class Utility
{
    MergeObjects(key, target, src)
    {
        if(typeof(src[key]) === typeof({}))
        {
            let keysToCopy = Object.keys(src[key]);

            for(let i = 0; i < keysToCopy.length; i ++)
            {
                let subKey = keysToCopy[i];
                if(target[key] == null)
                {
                    target[key] = {};
                }

                this.MergeObjects(subKey, target[key], src[key]);
            }
        }
        else
        {
            target[key] = src[key];
        }
    }

    MergeConfigs(rootConfig, overConfig)
    {
        let newConfig = Object.assign({}, rootConfig);

        let overKeys = Object.keys(overConfig);

        for(let i = 0; i < overKeys.length; i ++)
        {
            let key = overKeys[i];

            this.MergeObjects(key, newConfig, overConfig);
        }

        return newConfig;
    }

    IsString(obj)
    {
        let isString = false;

        if(obj instanceof String)
        {
            isString = true;
        }
        else if(typeof(obj) === typeof(""))
        {
            isString = true;
        }

        return isString;
    }

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

    GetSpaceString(length)
    {
        let str = "";
        for(let i = 0; i < length; i ++)
        {
            str += " ";
        }
        return str;
    }

    PixelScaleRect(rect)
    {
        rect.x = PIXEL_SCALE * rect.x;
        rect.y = PIXEL_SCALE * rect.y;
        rect.w = PIXEL_SCALE * rect.w;
        rect.h = PIXEL_SCALE * rect.h;
    }
}