class Technique
{
    constructor(techObj)
    {
        console.log("construct technique");

        console.log(techObj);
        this.name = techObj.name;
        this.baseDamage = techObj.baseDamage;
        this.baseExcitement = techObj.baseExcitement;
        this.moveToCentre = techObj.moveToCentre;
    }

    damage()
    {
        return this.baseDamage;
    }

    excitement()
    {
        return this.baseExcitement;
    }
}