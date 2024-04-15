import { EM } from "./main";

export default class AudioHelper
{
    constructor()
    {
    }

    PlayFx(fxName)
    {
        //sfx(fxName)

        assets.bleeper[fxName].play();
    }
}