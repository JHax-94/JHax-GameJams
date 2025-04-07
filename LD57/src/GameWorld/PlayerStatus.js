export default class PlayerStatus
{
    constructor()
    {
        this.credits = 1500;//1000;
        this.parcelsDelivered = 0;
        this.score = 0;
    }

    CalculateFinalScore()
    {
        return this.score + 10*this.parcelsDelivered;
    }
}