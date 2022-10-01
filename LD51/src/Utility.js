import { PIXEL_SCALE } from "./main";

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
}