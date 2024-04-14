let CONDEMNED_MARK = {
    WORKING: 0,
    OBLITERATED: 1,
    CLOCKED_OFF: 2,
    ToString: function (mark)
    {
        let str = "";
        switch(mark)
        {
            case CONDEMNED_MARK.WORKING:
                str = "Working";
                break;
            case CONDEMNED_MARK.OBLITERATED:
                str = "Obliterated";
                break;
            case CONDEMNED_MARK.CLOCKED_OFF:
                str = "Clocked Off";
                break;
        }

        return str;
    }
};

export { CONDEMNED_MARK }