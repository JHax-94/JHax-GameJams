class Sprite {
    constructor(animation, speed) {
        this.animation = animation;
        this.len = animation.length;
        this.speed = speed;
        this.index = 0;
    }

    showAt(pos) {
        var showIndex = floor(this.index) % this.len;
        imageMode(CENTER);
        
        image(this.animation[showIndex], pos.x, pos.y);
    }

    animate() {
        this.index += this.speed;
    }
     
}
