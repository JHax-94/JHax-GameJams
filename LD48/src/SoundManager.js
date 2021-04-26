import { Circle } from "p2";
import Button from "./Button";
import { consoleLog, DATA_STORE, em, PIXEL_SCALE, SFX } from "./main";
import ProgressBar from "./ProgressBar";

export default class SoundManager
{
    constructor(position, spriteInfo)
    {
        this.trueMusicMax = 0.5;
        this.musicMax = 5;

        this.trueSfxMax = 0.5;
        this.sfxMax = 5;

        this.spriteInfo = spriteInfo;
        this.pos = position;

        this.soundOn = true;
        audioManager.channels['sfx'].volume = 0.3;

        consoleLog("AUDIO MANAGER");        
        consoleLog(audioManager);
        consoleLog("PATATRACKER");
        consoleLog(patatracker);

        patatracker.output.gain.value = 0.3;

        this.songElapsed = 0;
        this.currentSong = "";

        this.isSongPlaying = false;

        consoleLog(assets.songs);
        this.titleSong = assets.songs.title;
        this.levelSongs = assets.songs.levels;

        this.musicVolume = 3;
        this.sfxVolume = 2;

        consoleLog("LOAD VOLUMES");
        consoleLog(DATA_STORE.volumes);
        if(DATA_STORE.volumes)
        {
            this.musicVolume = DATA_STORE.volumes.music;
            this.sfxVolume = DATA_STORE.volumes.sfx;
        }

        this.musicUpButton = new Button({ x: this.pos.x + 5, y: this.pos.y, w:1, h:1 }, ">", { shadow: 0, foreground: 34, text: 51, hover: 32 }, "MUSICUP", this);
        this.musicBar = new ProgressBar({x: this.pos.x + 1.25, y: this.pos.y, w: 3.5, h: 1}, { unfilled: 2, filled: 29} );
        this.musicBar.SetFill(this.musicVolume, this.musicMax);
        this.musicDownButton = new Button({ x: this.pos.x - 1.25, y: this.pos.y, w:1, h:1 }, "<", { shadow: 0, foreground: 34, text: 51, hover: 32 }, "MUSICDOWN", this);

        this.sfxUpButton = new Button({ x: this.pos.x + 5, y: this.pos.y + 1.25, w:1, h:1 }, ">", { shadow: 0, foreground: 34, text: 51, hover: 32 }, "SFXUP", this);
        this.sfxBar = new ProgressBar({x: this.pos.x + 1.25, y: this.pos.y + 1.25, w: 3.5, h: 1}, { unfilled: 2, filled: 29} );
        this.sfxBar.SetFill(this.sfxVolume, this.sfxMax);
        this.sfxDownButton = new Button({ x: this.pos.x- 1.25, y: this.pos.y + 1.25, w:1, h:1 }, "<", { shadow: 0, foreground: 34, text: 51, hover: 32 }, "SFXDOWN", this);

        this.SetMusicVolume(this.musicVolume);
        this.SetSfxVolume(this.sfxVolume);
    }

    AddToEntityManager()
    {
        em.AddRender(this);
        this.musicUpButton.AddToEntityManager();
        this.musicBar.AddToEntityManager();
        this.musicDownButton.AddToEntityManager();

        this.sfxUpButton.AddToEntityManager();
        this.sfxBar.AddToEntityManager();
        this.sfxDownButton.AddToEntityManager();
    }

    ChangeVolume(progressBar, original, changeBy, max)
    {
        consoleLog("CHANGE: " + original + " by " + changeBy);
        var newVal = original + changeBy;

        if(newVal > max)
        {
            newVal = max;
        }
        else if(newVal < 0)
        {
            newVal = 0;
        }

        progressBar.SetFill(newVal, max);

        return newVal;
    }

    SetMusicVolume(val)
    {
        patatracker.output.gain.value = (val * this.trueMusicMax / this.musicMax);
    }

    SetSfxVolume(val, playSound)
    {
        audioManager.channels['sfx'].volume = (val * this.trueSfxMax / this.sfxMax);
        if(playSound)
        {
            sfx(SFX.pearlGet);
        }
        
    }

    ButtonClicked(btn)
    {
        consoleLog(btn);
        var sfxChange = false;

        if(btn.type === "MUSICUP")
        {
            this.musicVolume = this.ChangeVolume(this.musicBar, this.musicVolume, 1, this.musicMax);
        }
        else if(btn.type === "MUSICDOWN")
        {
            this.musicVolume = this.ChangeVolume(this.musicBar, this.musicVolume, -1, this.musicMax);
        }
        else if(btn.type === "SFXUP")
        {
            sfxChange = true;
            this.sfxVolume = this.ChangeVolume(this.sfxBar, this.sfxVolume, 1, this.sfxMax);   
        }
        else if(btn.type === "SFXDOWN")
        {
            sfxChange = true;
            this.sfxVolume = this.ChangeVolume(this.sfxBar, this.sfxVolume, -1, this.sfxMax);
        }

        if(!sfxChange)
        {
            this.SetMusicVolume(this.musicVolume);
        }
        else
        {
            this.SetSfxVolume(this.sfxVolume, true);
        }

        DATA_STORE.SaveVolumes({ music: this.musicVolume, sfx: this.sfxVolume });
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

        sprite(this.spriteInfo.sfxIndex, this.pos.x * PIXEL_SCALE, (this.pos.y + 1) * PIXEL_SCALE);
    }
}