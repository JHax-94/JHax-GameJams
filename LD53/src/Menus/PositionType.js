let POS_TYPE = {
    TOP_LEFT: { wMod: 0, hMod: 0 },
    CENTRE_LEFT: { wMod: 0, hMod: 0.5 },
    CENTRE: { wMod: 0.5, hMod: 0.5 },
    CENTRE_RIGHT: { wMod: 1, hMod: 0.5 },

    Parse: (str) => { return PARSE_POS_TYPE(str); }
};


function PARSE_POS_TYPE(posTypeString)
{
    let posType = null;

    if(POS_TYPE[posTypeString])
    {
        posType = POS_TYPE[posTypeString];
    }

    return posType;
}

export { POS_TYPE }; 