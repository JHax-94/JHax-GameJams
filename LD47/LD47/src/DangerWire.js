import Component from "./Component";
import { em, SAFE_TILES } from "./main";

export default class DangerWire extends Component
{
    constructor(tilePos, spriteData)
    {
        super(tilePos, spriteData, "DANGER_WIRE");
    }

    ElectronIsSafe(electron)
    {
        return em.ElectronIsSafe(this.tilePos, electron);
    }
}