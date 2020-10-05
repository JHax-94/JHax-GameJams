import { consoleLog, PIXEL_SCALE } from "./main";

export default class SoundSettings
{
    constructor(position, spriteInfo)
    {
        this.spriteInfo = spriteInfo;
        this.pos = position;

        this.soundOn = true;
    }

    SetOn(powerOn)
    {
        consoleLog("SWITCH SOUND: " + powerOn);
        this.soundOn = powerOn;
        consoleLog(audioManager);
        audioManager.muted = !powerOn;
    }

    Toggle()
    {
        this.SetOn(!this.soundOn);
    }

    Draw()
    {
        sprite(this.spriteInfo.speakerIndex, this.pos.tileX * PIXEL_SCALE, this.pos.tileY * PIXEL_SCALE);
        sprite(this.soundOn ? this.spriteInfo.speakerOnIndex : this.spriteInfo.speakerOffIndex, (this.pos.tileX + 1) * PIXEL_SCALE, this.pos.tileY * PIXEL_SCALE);
    }
}