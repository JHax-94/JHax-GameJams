import AudioManager from "audio-manager";
import { EM, consoleLog } from "./main";
import TimeStepper from "./TimeStepper";

export default class AudioHelper
{
    constructor()
    {
        console.log("<> === AUDIO HELPER CONSTRUCTED! === <>");

        console.log(this.audioManager);
        this.audioManager = audioManager;

        this.ost = this.ShuffleOst(assets.music.tracks);
        this.vfx = assets.voice.voicefx;

        console.log(this);

        this.ostTimer = new TimeStepper(0, { onComplete: () => { this.NextTrack() } });

        this.vfxTimers = [];

        this.ostTrackNumber = 0;
    }

    NextTrack()
    {
        this.ostTrackNumber = (this.ostTrackNumber + 1) % this.ost.length;
    }

    ShuffleOst(tracks)
    {
        let ost = [];

        for(let i = 0; i < tracks.length; i ++)
        {
            tracks[i].order = Math.random();

            ost.push(tracks[i]);
        }

        return ost.sort((a, b) => { return a.order - b.order });
    }

    PlayFx(fxName)
    {
        //sfx(fxName)

        let vfx = null;

        for(let i = 0; i < this.vfx.length; i ++)
        {
            if(this.vfx[i].name === fxName)
            {
                vfx = this.vfx[i];
            }
        }

        if(vfx)
        {
            if(!this.IsVfxBlocked(vfx))
            {
                sfx(vfx.name);

                let vfxTimer = { vfx: vfx.name, timer: new TimeStepper(30) };

                vfxTimer.timer.StartTimer();

                this.vfxTimers.push(vfxTimer);
            }
        }
        else
        {
            assets.bleeper[fxName].play();
        }
    }

    IsVfxBlocked(vfx)
    {
        let blocked = false;

        for(let i = 0; i < this.vfxTimers.length; i ++)
        {
            if(this.vfxTimers[i].vfx === vfx.name)
            {   
                blocked = true;
            }
        }

        return blocked;
    }

    AlwaysUpdate(deltaTime)
    {
        this.ostTimer.TickBy(deltaTime);
        
        for(let i = 0; i < this.vfxTimers.length; i ++)
        {
            this.vfxTimers[i].timer.TickBy(deltaTime);
            if(this.vfxTimers[i].timer.IsFull())
            {
                this.vfxTimers.splice(i, 1);
            }
        }
    }

    PlayMusic()
    {
        let track = this.ost[this.ostTrackNumber];
        consoleLog("Play Track:");
        consoleLog(track);

        this.ostTimer.timer = track.time;
        this.ostTimer.StartTimer();

        music(track.file);
    }
}