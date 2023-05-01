import { SOUND, consoleLog } from "../main";
import Menu from "./Menu";

export default class SoundMenu extends Menu
{
    constructor(config)
    {
        super(config);
    }

    GetMusicVolume()
    {
        return SOUND.GetMusicVolume();
    }

    GetSfxVolume()
    {
        return SOUND.GetSfxVolume();
    }

    MusicVolumeUp()
    {
        SOUND.SetMusicVolume(this.GetMusicVolume() + 1);
    }

    MusicVolumeDown()
    {
        SOUND.SetMusicVolume(this.GetMusicVolume() - 1);
    }

    SfxVolumeUp()
    {
        consoleLog("SFX Volume Up");
        SOUND.SetSfxVolume(this.GetSfxVolume() + 1, true);
    }

    SfxVolumeDown()
    {   
        consoleLog("SFX Volume Down");
        SOUND.SetSfxVolume(this.GetSfxVolume() - 1, true);
    }

    Update(deltaTime)
    {

        this.musicVol = this.texComponents.find(c => c.id === "MusicVolume");
        this.musicVol.lines[0] = this.GetMusicVolume();

        this.sfxVol = this.texComponents.find(c => c.id === "SfxVolume");
        this.sfxVol.lines[0] = this.GetSfxVolume(); 

        this.menuTex = this.BuildMenuTexture();
    }
}