function MyrTest() {
    this.a = 0;
}

MyrTest.prototype = {
    start() {
        myr = new Myr(document.getElementById("renderer"));
        myr.setClearColor(new myr.Color(0.2, 0.5, 0.7));
        
        this.sheet = new myr.Surface("sprites/spritesheet.png", 154, 17);
        
        for(let i = 0; i < sheet.length; ++i) {
            const sprite = sheet[i];
            
            myr.register(
                sprite.name,
                myr.makeSpriteFrame(this.sheet, sprite.x, sprite.y, sprite.width, sprite.height, 0, 0),
                myr.makeSpriteFrame(this.sheet, sprite.x, sprite.y, sprite.width, sprite.height, 0, 0),
                60);
        }
        
        this.sprite = new myr.Sprite("biemer_green");
        this.surface = new myr.Surface(200, 200);
        
        this.fish = new myr.Surface("https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png");
        
        this.lastDate = new Date();
        this.animate();
    },
    
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.update(this.getTimeStep());
        this.render();
    },
    
    getTimeStep() {
        var date = new Date();
        var timeStep = (date - this.lastDate) / 1000;
        
        if(timeStep < 0)
            timeStep += 1.0;
        
        this.lastDate = date;
        
        return timeStep;
    },
    
    update(timeStep) {
        this.a += 0.01;
    },
    
    render() {
        myr.bind();
        myr.push();
        myr.rotate(0.1);
        myr.clear();
        
        this.surface.draw(Math.cos(this.a) * 200 + 200, 200);
        
        myr.push();
        myr.translate(200, 200);
        myr.scale(2, 2);
        
        this.surface.draw(100, 100);
        
        myr.pop();
        
        this.surface.drawSheared(200, Math.sin(this.a) * 200 + 200, 0, 1);
        
        myr.pop();
		
        let t = new myr.Transform();
        t.translate(40, 40);
        t.shear(0.2, 0);
        
        this.fish.drawPartTransformed(t,
                           this.fish.getWidth() / 4,
                           this.fish.getHeight() / 4,
                           this.fish.getWidth() / 2,
                           this.fish.getHeight() / 2);
        this.sheet.draw(0, 0);
        this.sprite.draw(10, 50);
        this.sprite.draw(10, 70);
        this.sprite.draw(10, 90);
        
        myr.flush();
        
        this.surface.bind();
        this.surface.clear();
        this.fish.draw((this.surface.getWidth() -this.fish.getWidth()) / 2, (this.surface.getHeight() -this.fish.getHeight()) / 2);
    }
}

var test = new MyrTest();
test.start();