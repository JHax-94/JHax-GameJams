export default class PlayerStatus
{
    constructor()
    {
        this.credits = 2000;//1000;
        this.parcelsDelivered = 0;
        this.score = 0;
    }

    CalculateFinalScore()
    {
        return this.score + 10*this.parcelsDelivered;
    }
}