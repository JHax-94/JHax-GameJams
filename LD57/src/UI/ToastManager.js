import ToastAlert from "./ToastAlert";

export default class ToastManager
{
    constructor()
    {
        this.basePos = {x: 2, y: 20};

        this.messageHeight = 12;

        this.messages = [];
    }

    AddMessage(message, colour)
    {
        let newToast = new ToastAlert(message, { x: this.basePos.x, y: this.basePos.y + this.messageHeight * this.messages.length}, colour, this);

        this.messages.push(newToast);
    }

    RemoveMessage(toast)
    {
        let index = this.messages.indexOf(toast);

        if(index >= 0)
        {
            this.messages.splice(index, 1);
        }

        for(let i = index; i < this.messages.length; i ++)
        {
            this.messages[i].ShiftY(this.basePos.y + this.messageHeight * i, 2);
        }
    }


}