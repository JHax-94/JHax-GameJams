import Whistle from "../PlayerActions/Whistle";
import WhistleBeast from "./Whistlebeast";

export default class BeastFactory
{
    constructor()
    {

    }

    BuildABeast(beastConf)
    {
        let newBeast = null;
        if(beastConf.beastType === "WHISTLE")
        {
            newBeast = new WhistleBeast(beastConf.pos);
        }

        return newBeast;
    }
}