import Whistle from "../PlayerActions/Whistle";
import CuriousBeast from "./CuriousBeast";
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
        else if(beastConf.beastType === "CURIO")
        {
            newBeast = new CuriousBeast(beastConf.pos);
        }

        return newBeast;
    }
}