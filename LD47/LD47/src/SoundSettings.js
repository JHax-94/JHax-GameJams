import { consoleLog, PIXEL_SCALE } from "./main";

export default class SoundSettings
{
    constructor(position, spriteInfo)
    {
        this.spriteInfo = spriteInfo;
        this.pos = position;

        this.soundOn = true;
        audioManager.channels['sfx'].volume = 5;

        this.songElapsed = 0;
        this.currentSong = "";

        this.isSongPlaying = false;

        consoleLog(assets.songs);
        this.titleSong = assets.songs.title;
        this.levelSongs = assets.songs.levels;
    }

    PlayTitle()
    {
        this.PlaySong(this.titleSong);
    }

    PlaySong(songName)
    {
        if((this.currentSong != songName && this.songElapsed >= 10) || this.isSongPlaying === false)
        {
            this.songElapsed = 0;
            if(this.soundOn) patatracker.playSong(songName);
            this.currentSong = songName;
            this.isSongPlaying = true;
        }
    }

    PlayRandomSong()
    {
        var pickSong = random(this.levelSongs.length-1);

        this.PlaySong(this.levelSongs[pickSong]);
    }

    SetOn(powerOn)
    {
        consoleLog("SWITCH SOUND: " + powerOn);
        this.soundOn = powerOn;
        consoleLog(audioManager);
        audioManager.muted = !powerOn;
        
        if(!powerOn)
        {
            patatracker.stop();
            this.isSongPlaying = false;
        } 
        else PlaySong(this.titleSong);
    }

    Toggle()
    {
        this.SetOn(!this.soundOn);
    }

    Update(deltaTime)
    {
        if(this.soundOn)
        {
            this.songElapsed += deltaTime;
        }
    }

    Draw()
    {
        sprite(this.spriteInfo.speakerIndex, this.pos.tileX * PIXEL_SCALE, this.pos.tileY * PIXEL_SCALE);
        sprite(this.soundOn ? this.spriteInfo.speakerOnIndex : this.spriteInfo.speakerOffIndex, (this.pos.tileX + 1) * PIXEL_SCALE, this.pos.tileY * PIXEL_SCALE);
    }
}