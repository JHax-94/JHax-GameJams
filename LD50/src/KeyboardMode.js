import AbstractMenu from "./AbstractMenu";
import { getKeyboardMode,setKeyboardMode, keyboardModes } from "./main";

export default class KeyboardMode extends AbstractMenu
{
    constructor()
    {
        super("KeyMappingMenu");

        let menuRef = this;

        this.buttonMethods.CycleKeyboard = function() { menuRef.CycleKeyboardMode(); };

        this.BuildComponents();

        this.UpdateKeyModeText();
    }

    UpdateKeyModeText()
    {
        for(let i = 0; i < this.components.length; i ++)
        {
            let comp = this.components[i];

            if(comp.type === "Text" && comp.text === "##KEY_MODE##")
            {
                comp.overwriteText = keyboardModes[getKeyboardMode()];

                break;
            }
        }
    }

    CycleKeyboardMode()
    {
        let currentKeyboardMode = getKeyboardMode();

        let newKeyboardMode = (currentKeyboardMode + 1) % keyboardModes.length;

        setKeyboardMode(newKeyboardMode);

        this.UpdateKeyModeText();
    }
}