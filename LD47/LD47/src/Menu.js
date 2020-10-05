import Button from "./Button";
import Label from "./Label";
import { COLOURS, consoleLog } from "./main";

export default class Menu
{
    constructor(position, pageLength, buttonOptions, pagesLabel, prevButton, nextButton)
    {
        this.position = position;
        this.currentPage = 0;
        this.pageLength = pageLength;
        this.buttonOptions = buttonOptions;
        consoleLog(pagesLabel);
        
        this.pagesLabel = new Label({ tileX: pagesLabel.tileX, tileY: pagesLabel.tileY }, "NULL", pagesLabel.colour);
        this.prevButton = new Button(prevButton.tileRect, prevButton.text, { type: "MENU_PREV", menu: this }, prevButton.colours);
        this.nextButton = new Button(nextButton.tileRect, nextButton.text, { type: "MENU_NEXT", menu: this }, nextButton.colours);

        this.buttons = [];

        consoleLog("MENU CONSTRUCTED");
        consoleLog(this);
    }
    
    AddButton(button)
    {
        var newButtonIndex = this.buttons.length;

        var positionOnPage = newButtonIndex % this.pageLength;

        consoleLog("Adding button: " + newButtonIndex);
        consoleLog("Position on page: " + positionOnPage);

        button.SetTileRect({ 
            x: this.position.tileX, 
            y: this.position.tileY + positionOnPage * this.buttonOptions.ySpacing,
            w: this.buttonOptions.w,
            h: this.buttonOptions.h
        });

        consoleLog("New tileRect: ");
        consoleLog(button.tileRect);

        this.buttons.push(button);

        this.totalPages = Math.ceil(this.buttons.length / this.pageLength);
    }

    NextPage()
    {
        this.OpenPage(this.currentPage + 1);
    }

    PrevPage()
    {
        this.OpenPage(this.currentPage - 1);
    }

    OpenPage(pageNumber)
    {
        //consoleLog("OPEN PAGE: " + pageNumber);
        this.currentPage = clamp(pageNumber, 0, this.totalPages);

        var firstOnPage = this.currentPage * this.pageLength;
        var lastOnPage = firstOnPage + this.pageLength;

        for(var i = 0; i < this.buttons.length; i ++)
        {
            //consoleLog("Show from: " + firstOnPage + " to " + lastOnPage);
            var buttonVisible = i >= firstOnPage && i < lastOnPage;

            //consoleLog("Button " + i + " visible? " + buttonVisible);

            this.buttons[i].SetIsVisible(buttonVisible);
        }

        this.prevButton.SetIsVisible(this.currentPage > 0);
        this.nextButton.SetIsVisible(this.currentPage < this.totalPages-1);

        this.pagesLabel.text = (this.currentPage + 1) + " / " + this.totalPages;
    }
}