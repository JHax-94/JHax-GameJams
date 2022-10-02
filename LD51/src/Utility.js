import { vectorXY } from "tina/src/interpolation";
import { DIRECTIONS, PIXEL_SCALE } from "./main";

export default class Utility
{
    GetTextCentred(rect, text)
    {
        return {
            x: (rect.x + 0.5 * rect.w) * PIXEL_SCALE - 2*text.length, 
            y: (rect.y + 0.5* rect.h) * PIXEL_SCALE - 3
        };
    }

    Lerp(from, to, amnt)
    {
        let result = from + (to-from) * amnt;
        return result;
    }

    Plerp(from, to, amnt)
    {
        let result = from + (to-from) * amnt * amnt;
        return result;
    }

    Clerp(from, to, amnt)
    {
        let result = from + (to-from) * amnt * amnt * amnt;
        return result;
    }

    CalculateTextWidth(text)
    {
        return text.length * 0.5 + (2/PIXEL_SCALE);
    }

    VecAdd(a, b)
    {
        return { x: a.x + b.x, y: a.y + b.y };
    }

    GetSqrDistance(a, b)
    {
        return Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2);
    }

    GetForwardVec(dir)
    {
        let vec = { x: 0, y: 0};

        if(dir === DIRECTIONS.UP)
        {
            vec.x = 0;
            vec.y = -1;
        }
        else if(dir === DIRECTIONS.DOWN)
        {
            vec.x = 0;
            vec.y = 1;
        }
        else if(dir === DIRECTIONS.LEFT)
        {
            vec.x = -1;
            vec.y = 0;
        }
        else if(dir === DIRECTIONS.RIGHT)
        {
            vec.x = 1;
            vec.y = 0;
        }

        return vec;
    }
}