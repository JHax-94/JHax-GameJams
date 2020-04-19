class Technique
{
    constructor(techObj)
    {
        //console.log("construct technique");

        //console.log(techObj);
        this.name = techObj.name;
        this.baseDamage = techObj.baseDamage;
        this.baseExcitement = techObj.baseExcitement;
        this.moveToCentre = techObj.moveToCentre;
        this.equipped = techObj.equipped;
        this.owned = techObj.owned;

        this.reusePenalty = techObj.reusePenalty;
        this.cooldown = techObj.cooldown;
        this.usesWeapon = techObj.usesWeapon;

        this.currentPenalty = 0;
        this.lastUsedWithWeapon = "";
    }

    reset()
    {
        this.currentPenalty = 0;
        this.lastUsedWithWeapon = "";
    }

    iterateCooldown()
    {
        if(this.currentPenalty > 0)
        {
            this.currentPenalty -= this.cooldown;

            if(this.currentPenalty < 0)
            {
                this.currentPenalty = 0;
            }
        }
        
    }

    deductPenalty()
    {
        this.currentPenalty += this.reusePenalty;
        if(this.usesWeapon)
        {
            var weapon = getActiveWeapon();

            this.lastUsedWithWeapon = weapon.name;
        }
    }

    damage()
    {
        var weaponMod = 0;

        if(this.usesWeapon)
        {
            var weapon = getActiveWeapon();

            if(weapon != 0)
            {
                weaponMod = weapon.damageBonus;
            }
        }

        var totalDamage = this.baseDamage + weaponMod;

        //console.log("DAMAGE: " + totalDamage);

        return totalDamage;
    }

    generateVagueString(from)
    {
        var vague = "=";
        
        if(from <= -5 && from > -15)
        {
            vague = "-~";
        }
        else if(from <= -15 && from > -50)
        {
            vague = "-";
        }
        else if(from <= -50 && from > -100)
        {
            vague = "--";
        }
        else if(from <= -100)
        {
            vague = "---";
        }
        else if(from >= 5 && from < 15)
        {
            vague = "+~";
        }
        else if(from >= 15 && from < 50)
        {
            vague = "+";
        }
        else if(from >= 50 && from < 100)
        {
            vague = "++";
        }
        else if(from >= 100)
        {
            vague = "+++";
        }

        return vague;
    }

    getDamageString()
    {
        return this.generateVagueString(this.damage());
    }

    excitement(log)
    {
        var weaponMod = 0;

        var excitement = this.baseExcitement - this.currentPenalty;

        if(this.usesWeapon)
        {
            var weapon = getActiveWeapon();
            //if(log) console.log(weapon);
            if(weapon != 0)
            {
                if(weaponMod.lastUsedWithWeapon !== weapon.name)
                {
                    weaponMod = weapon.excitementBonus;
                    //if(log) console.log("Weapon Mod: " + weapon.excitmentBonus)
                }                
            }
        }

        var totalExcitement = excitement + weaponMod;

        //if(log) console.log(totalExcitement);

        return totalExcitement;
    }

    getExcitementString()
    {
        return this.generateVagueString(this.excitement());
    }
}