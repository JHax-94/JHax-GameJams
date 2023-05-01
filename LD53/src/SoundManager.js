import { EM, PIXEL_SCALE, consoleLog } from "./main";

export default class SoundManager
{
    constructor(position)
    {
        this.trueMusicMax = 0.5;
        this.musicMax = 20;

        this.trueSfxMax = 0.5;
        this.sfxMax = 20;

        this.pos = position;

        consoleLog("SOUND MANAGER");
        this.songs = assets.songs;

        EM.RegisterEntity(this);
        consoleLog(this);

        this.currentSong = null;
        this.songWaitTime = 3;
        this.songWaitTimer = 0;      

        this.songNum = 0;
        this.trackNames = ["Track1", "Track2"];
    }

    PlayNextSong()
    {
        this.songNum = (this.songNum + 1) % this.trackNames.length;
        this.Start();
    }

    Start()
    {
        let song = this.trackNames[this.songNum];
        this.PlaySong(this.songs[song]);
    }

    PlaySong(songObj)
    {
        if(songObj)
        {
            this.currentSong = songObj;
            this.currentSong.play();
        }
    }

    Reregister()
    {
        EM.RegisterEntity(this);
    }

    Update(deltaTime)
    {        
        if(this.currentSong)
        {
            if(this.currentSong.ended)
            {
                this.currentSong = null;
                this.songWaitTimer = this.songWaitTime;
            }
        }
        else if(this.songWaitTimer > 0)
        {
            this.songWaitTimer -= deltaTime;

            if(this.songWaitTimer <= 0)
            {
                this.songWaitTimer = 0;
                this.PlayNextSong();
            }
        }
    }

    Draw()
    {        
        sprite(this.musicIconIndex, this.pos.x * PIXEL_SCALE, this.pos.y * PIXEL_SCALE);

        sprite(this.sfxIconIndex, this.pos.x * PIXEL_SCALE, (this.pos.y + 1.25) * PIXEL_SCALE);
    }
}