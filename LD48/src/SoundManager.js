import { Circle } from "p2";
import { consoleLog, DATA_STORE, em, PIXEL_SCALE } from "./main";

export default class SoundManager
{
    constructor(position, spriteInfo)
    {
        this.spriteInfo = spriteInfo;
        this.pos = position;

        this.soundOn = false;
        audioManager.channels['sfx'].volume = 1;

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
        consoleLog("CURRENT:");
        consoleLog(this.currentSong)
        consoleLog("IS SONG PLAYING?");
        consoleLog(this.isSongPlaying);

        if(this.soundOn)
        {
            if((this.currentSong != songName && this.songElapsed >= 10) || this.isSongPlaying === false)
            {
                consoleLog("START SONG!");

                this.songElapsed = 0;
                if(this.soundOn) patatracker.playSong(songName);
                this.currentSong = songName;
                this.isSongPlaying = true;
            }
        }
    }

    PlayRandomSong()
    {
        var pickSong = random(this.levelSongs.length-1);

        this.PlaySong(this.levelSongs[pickSong]);
    }

    SetOn(powerOn)
    {
        if(powerOn != this.soundOn)
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
            else 
            {
                consoleLog("PLAY:"  + this.titleSong);
                this.PlaySong(this.titleSong);
            }

            DATA_STORE.soundOn = powerOn;
            DATA_STORE.Persist();
        }
        
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
        sprite(this.spriteInfo.speakerIndex, this.pos.x * PIXEL_SCALE, this.pos.y * PIXEL_SCALE);
        sprite(this.soundOn ? this.spriteInfo.speakerOnIndex : this.spriteInfo.speakerOffIndex, (this.pos.x + 1) * PIXEL_SCALE, this.pos.y * PIXEL_SCALE);
    }
}