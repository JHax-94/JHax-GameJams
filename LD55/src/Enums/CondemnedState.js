let CONDEMNED_STATE = {

    IDLE: 0,
    MOVING: 1,
    WORKING: 2,
    QUEUEING: 3,
    BOARDING: 4,
    ON_BOARD: 5,

    ToString: function(val)
    {
        let str  = "N/A";

        switch(val)
        {
            case this.IDLE:
                str = "IDLE";
                break;

            case this.MOVING:
                str = "MOVING";
                break;
            
            case this.WORKING:
                str = "WORKING";
                break;
            
            case this.QUEUEING:
                str = "QUEUEING";
                break;
            
            case this.BOARDING:
                str = "BOARDING";
                break;
            
            case this.ON_BOARD:
                str = "ON BOARD";
                break;
        }

        return str;
    }
};

export { CONDEMNED_STATE };