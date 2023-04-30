import CuriousBeast from "./CuriousBeast";
import HunterBeast from "./HunterBeast";
import VeggieBeast from "./VeggieBeast";
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
        else if(beastConf.beastType === "HUNTER")
        {
            newBeast = new HunterBeast(beastConf.pos);
        }
        else if(beastConf.beastType === "VEGGIE")
        {
            newBeast = new VeggieBeast(beastConf.pos);
        }

        return newBeast;
    }
}