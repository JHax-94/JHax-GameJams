import AudioManager from "audio-manager";
import Button from "./Menus/Button";
import { EM, PIXEL_SCALE, consoleLog, getPlayerPref, playFx, setPlayerPref } from "./main";

export default class SoundManager
{
    constructor(position)
    {
        this.trueMusicMax = 0.5;
        this.musicMax = 10;

        this.trueSfxMax = 0.5;
        this.sfxMax = 10;

        this.pos = position;

        this.songs = assets.songs;

        EM.RegisterEntity(this);

        this.musicIconIndex = 64;
        this.sfxIconIndex = 65;

        this.currentSong = null;
        this.songWaitTime = 3;
        this.songWaitTimer = 0;      

        this.songNum = 0;
        this.trackNames = ["Track1", "Track2"];

        this.defaultMusicVolume = 7;
        this.defaultSfxVolume = 5;

        let prefMusicVol = getPlayerPref("musicVolume");

        if(prefMusicVol || prefMusicVol === 0)
        {
            this.musicVolume = prefMusicVol;   
        }
        else
        {
            this.musicVolume = this.defaultMusicVolume;
        }

        let prefSfxVolume = getPlayerPref("sfxVolume");

        if(prefSfxVolume || prefSfxVolume === 0)
        {
            this.sfxVolume = prefSfxVolume
        }
        else 
        {
            this.sfxVolume = this.defaultSfxVolume;
        }

        this.SetMusicVolume(this.musicVolume);
        this.SetSfxVolume(this.sfxVolume);
        
        
    }

    GetMusicVolume()
    {
        return this.musicVolume;
    }

    SetMusicVolume(value)
    {
        if(value > this.musicMax)
        {
            value = this.musicMax;
        }
        else if(value < 0)
        {
            value = 0;
        }

        this.musicVolume = value;

        setPlayerPref("musicVolume", this.musicVolume);

        if(this.currentSong)
        {
            this.currentSong.volume = value / this.musicMax;
        }
    }

    GetSfxVolume()
    {
        return this.sfxVolume;
    }
    GetTrueSfxVolume()
    {
        return this.sfxVolume * 0.05;
    }

    SetSfxVolume(value, playSound)
    {
        if(value > this.sfxMax)
        {
            value = this.sfxMax;
        }
        else if(value < 0)
        {
            value = 0;
        }

        this.sfxVolume = value;

        setPlayerPref("sfxVolume", this.sfxVolume);

        if(playSound)
        {
            playFx('buy');
        }
        
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
            this.currentSong.volume = this.GetMusicVolume() / this.musicMax;
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
}