import { consoleLog, DATA_STORE, EM, getObjectConfig, getPlayerPref, PIXEL_SCALE, setPlayerPref, SFX } from "./main";
import ProgressBar from "./ProgressBar";
import Button from "./Ui/Button";

export default class SoundManager
{
    constructor(position)
    {
        this.trueMusicMax = 0.5;
        this.musicMax = 20;

        this.trueSfxMax = 0.5;
        this.sfxMax = 20;

        this.pos = position;

        this.tensionLevel = 0;

        this.rampModeOn = false;

        this.soundOn = true;
        audioManager.channels['sfx'].volume = 0.3;
        /*
        consoleLog("AUDIO MANAGER");        
        consoleLog(audioManager);
        consoleLog("PATATRACKER");
        consoleLog(patatracker);
        consoleLog("ASSETS.PATATRACKER");
        consoleLog(assets.patatracker);
        */
        this.albumData = assets.patatracker;

        this.barTimer = 0;

        patatracker.output.gain.value = 0.3;

        this.config = getObjectConfig("SoundManager");

        /*
        consoleLog("=== SOUND TRACK CONFIG ===");
        consoleLog(this.config);
        */
        this.songElapsed = 0;
        this.currentSong = "";

        
        this.musicIconIndex = this.config.musicIconIndex;
        this.sfxIconIndex = this.config.sfxIconIndex;

        this.titleSong = this.config.titleSong;
        this.levelMusic = this.config.levelMusic;

        this.fadeoutTime = this.config.fadeoutTime;

        this.alarmDelay = this.config.alarmDelay;
        this.alarmDelayTime = 0;
        this.trackDelay = this.config.trackDelay;
        this.trackDelayTime = 0;

        this.isSongPlaying = false;

        this.musicVolume = this.config.defaultVolume.music;
        this.sfxVolume = this.config.defaultVolume.sfx;
        
        let storedMusicVol = getPlayerPref("MUSIC_VOLUME");

        if(storedMusicVol !== null)
        {
            this.musicVolume = parseFloat(storedMusicVol);
        }

        let storedSfxVol = getPlayerPref("SFX_VOLUME");

        if(storedSfxVol !== null)
        {
            this.sfxVolume = parseFloat(storedSfxVol);
        }

        this.SetMusicVolume(this.musicVolume);
        this.SetSfxVolume(this.sfxVolume);

        let soundManRef = this;

        this.musicBar = new ProgressBar({ x: (this.pos.x + 3), y: this.pos.y+0.25, w: 3.5, h: 0.5 }, { filled: 1, unfilled: 6 });
        this.musicBar.SetFill(this.musicVolume, this.musicMax);
        
        this.musicUpButton = new Button({ x: this.pos.x + 7.5, y: this.pos.y }, { w: 1, h: 1 }, {display: ">", offset: { x: 1, y: 1 }});
        this.musicUpButton.ClickCallback = function() { soundManRef.MusicVolumeUp(); };

        this.musicDownButton = new Button({ x: this.pos.x + 1.5, y: this.pos.y }, { w: 1, h: 1 }, {display: "<", offset: { x: 1, y: 1 }});
        this.musicDownButton.ClickCallback = function() { soundManRef.MusicVolumeDown(); }

        this.sfxBar = new ProgressBar({ x: this.pos.x + 3, y: this.pos.y + 1.25, w: 3.5, h: 0.5 }, {filled: 1, unfilled: 6});
        this.sfxBar.SetFill(this.sfxVolume, this.sfxMax);

        this.sfxDownButton = new Button({ x: this.pos.x + 1.5, y: this.pos.y + 1.25 }, { w: 1, h: 1 }, {display: "<", offset: { x: 2, y: 2 }});
        this.sfxDownButton.ClickCallback = function () { soundManRef.SfxVolumeDown(); };

        this.sfxUpButton = new Button({ x: this.pos.x + 7.5, y: this.pos.y + 1.25 }, { w: 1, h: 1 }, {display: ">", offset: { x: 2, y: 2 }});
        this.sfxUpButton.ClickCallback = function () { soundManRef.SfxVolumeUp(); };

        EM.RegisterEntity(this);
        EM.constructedWithSound = true;
    }
    /*
    AddToEntityManager()
    {
        em.AddRender(this);
        this.musicUpButton.AddToEntityManager();
        this.musicBar.AddToEntityManager();
        this.musicDownButton.AddToEntityManager();

        this.sfxUpButton.AddToEntityManager();
        this.sfxBar.AddToEntityManager();
        this.sfxDownButton.AddToEntityManager();
    }*/

    Reregister()
    {
        if(!EM.constructedWithSound)
        {
            EM.RegisterEntity(this.sfxBar);
            EM.RegisterEntity(this.musicBar);

            EM.RegisterEntity(this.sfxUpButton);
            EM.RegisterEntity(this.sfxDownButton);

            EM.RegisterEntity(this.musicUpButton);
            EM.RegisterEntity(this.musicDownButton);
        }
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

    MusicVolumeUp()
    {
        this.musicVolume = this.ChangeVolume(this.musicBar, this.musicVolume, 1, this.musicMax);

        this.SetMusicVolume(this.musicVolume);

        setPlayerPref("MUSIC_VOLUME", this.musicVolume);
    }

    MusicVolumeDown()
    {
        this.musicVolume = this.ChangeVolume(this.musicBar, this.musicVolume, -1, this.musicMax);

        this.SetMusicVolume(this.musicVolume);

        setPlayerPref("MUSIC_VOLUME", this.musicVolume);
    }

    SfxVolumeUp()
    {
        consoleLog(this);

        this.sfxVolume = this.ChangeVolume(this.sfxBar, this.sfxVolume, 1, this.sfxMax);

        this.SetSfxVolume(this.sfxVolume, true);

        setPlayerPref("SFX_VOLUME", this.sfxVolume);
    }

    SfxVolumeDown()
    {
        this.sfxVolume = this.ChangeVolume(this.sfxBar, this.sfxVolume, -1, this.sfxMax);

        this.SetSfxVolume(this.sfxVolume, true);

        setPlayerPref("SFX_VOLUME", this.sfxVolume);
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
            sfx(SFX.collect);
        }
    }
    /*
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
    }*/

    PlayTitle()
    {
        this.rampModeOn = false;

        this.SetMusicVolume(this.musicVolume);
        this.PlaySong(this.titleSong);

        this.Reregister();
    }

    PlaySong(songName)
    {
        /*
        consoleLog("CURRENT:");
        consoleLog(this.currentSong)
        consoleLog("IS SONG PLAYING?");
        consoleLog(this.isSongPlaying);
        */

        if(this.soundOn)
        {
            if((this.currentSong != songName) || this.isSongPlaying === false)
            {
                this.songElapsed = 0;
                if(this.soundOn) patatracker.playSong(songName);
                this.currentSong = songName;
                this.isSongPlaying = true;
            }
        }
    }

    GetTrackForTensionLevel(tensionLevel)
    {
        let trackListing = null;

        for(let i = 0; i < this.levelMusic.length; i ++)
        {
            if(this.levelMusic[i].order === tensionLevel)
            {
                trackListing = this.levelMusic[i];
                break;
            }
        }

        return trackListing;
    }

    PlayLevelMusic()
    {
        this.tensionLevel = 0;
        this.SetMusicVolume(this.musicVolume);
        this.ResetTimers();
        this.PlaySongForTensionLevel(0);
    }

    ResetTimers()
    {
        this.songElapsed = 0;
        this.alarmDelayTime = 0;
        this.trackDelayTime = 0;
    }

    PlayNextLevelMusic()
    {
        this.tensionLevel ++;

        if(this.tensionLevel >= this.levelMusic.length)
        {
            this.tensionLevel = this.levelMusic.length -1;
        }

        this.SetMusicVolume(this.musicVolume);

        this.PlaySongForTensionLevel(this.tensionLevel);        
    }

    PlaySongForTensionLevel(tensionLevel)
    {
        let tensionSong = this.GetTrackForTensionLevel(tensionLevel);

        let tensionTrackData = null;
        /*
        consoleLog("--- PLAY LEVEL MUSIC ---");

        consoleLog(this.albumData);

        consoleLog(`find track data for:`);
        consoleLog(tensionSong);
        */
        for(let i = 0; i < this.albumData.s.length; i ++)
        {            
            let track = this.albumData.s[i];
            /*
            consoleLog("TRACK DATA");
            consoleLog(track);

            consoleLog(`Compare: ${track.n} with ${tensionSong.name}`);
            */
            if(track.n === tensionSong.name)
            {
                tensionTrackData = track;
                break;
            }
        }

        this.tempo = tensionTrackData.b;
        this.bars = tensionTrackData.l;
        this.beatsPerBar = tensionTrackData.s;

        this.rampModeOn = true;

        this.trackTime = tensionSong.duration; //((this.bars * this.beatsPerBar) / this.tempo) * 60;

        this.PlaySong(tensionTrackData.n);
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
            //consoleLog("SWITCH SOUND: " + powerOn);
            this.soundOn = powerOn;
            //consoleLog(audioManager);
            audioManager.muted = !powerOn;
            
            if(!powerOn)
            {
                patatracker.stop();
                this.isSongPlaying = false;
            } 
            else 
            {
                //consoleLog("PLAY:"  + this.titleSong);
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
    }

    Draw()
    {        
        sprite(this.musicIconIndex, this.pos.x * PIXEL_SCALE, this.pos.y * PIXEL_SCALE);

        sprite(this.sfxIconIndex, this.pos.x * PIXEL_SCALE, (this.pos.y + 1) * PIXEL_SCALE);
    }
}