import { PIXEL_SCALE } from "../../main";
import SeekBehaviour from "./SeekBehaviour";

export default class HuntBehaviour extends SeekBehaviour
{
    constructor(beast)
    {
        super(beast, { perceiveDistance: 4 * PIXEL_SCALE });

        this.leftScan = { angle: Math.PI *0.5, min: 0, max: Math.PI * 0.3, direction: 1 };
        this.rightScan = { angle: -Math.PI * 0.5, min: - Math.PI * 0.3, max: 0, direction: 1 };
    }
}