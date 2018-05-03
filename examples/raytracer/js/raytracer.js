const Raytracer = function(myr) {
    const UP_SCALING = 7;
    const COLOR_CLEAR = new myr.Color(0.2, 0.3, 0.8);
    const TIME_STEP_MAX = 0.5;

    let lastDate = null;

    const width = myr.getWidth() / UP_SCALING;
    const height = myr.getHeight() / UP_SCALING;
    const renderSurface = new myr.Surface(width, height);

    let spheres = [new Sphere(new Vector3(0.2 * width, 0.5 * height, 0), 0.1 * width),
                   new Sphere(new Vector3(width - 0.2 * width, 0.5 * height, 0), 0.1 * width)];

    const eye   = new Vector3(width/2, height/2, 1000);
    const light = new Vector3(width/2, height/2, 0);

    const getTimeStep = () => {
        const date = new Date();
        let timeStep = (date - lastDate) / 1000;
        
        if(timeStep < 0)
            timeStep += 1.0;
        else if(timeStep > TIME_STEP_MAX)
            timeStep = TIME_STEP_MAX;
        
        lastDate = date;
        
        return timeStep;
    };
    
    const update = timeStep => {
        for(let i = 0; i < spheres.length; ++i)
            spheres[i].update(timeStep);
    };

    const shade = (viewDir, point, normal) => {
        const MATERIAL_AMBIENT    = 0.3,
              MATERIAL_DIFFUSE    = 0.5,
              MATERIAL_SPECULAR   = 0.3,
              MATERIAL_SPECULAR_N = 6;

        let lightDir = light.subtract(point).normalize();
        let diffuse = Math.max(normal.dot(lightDir), 0);

        let reflectDir = normal.multiply(normal.dot(lightDir)).multiply(2).subtract(lightDir);
        let specAngle = Math.max(reflectDir.dot(viewDir), 0);
        let specular = Math.pow(specAngle, MATERIAL_SPECULAR_N);

        return MATERIAL_AMBIENT +
               MATERIAL_DIFFUSE * diffuse +
               MATERIAL_SPECULAR * specular;
    };

    const trace = ray => {
        let closestHit = new Hit(Infinity);
        let sphere;

        for(let i = 0; i < spheres.length; ++i) {
            let hit = spheres[i].intersect(ray);
            if (hit.getDistance() < closestHit.getDistance()) {
                closestHit = hit;
                sphere = spheres[i];
            }
        }

        if (!sphere) return;

        let viewDir = ray.getDirection().multiply(-1);
        let hitPoint = ray.at(closestHit.getDistance());
        let normal = closestHit.getNormal();
        let intensity = shade(viewDir, hitPoint, normal);

        return new myr.Color(intensity, intensity, intensity, 1);
    };

    const render = () => {
        renderSurface.bind();
        renderSurface.clear();
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                let pixel = new Vector3(x + 0.5, height - 1 - y + 0.5, 0);
                let ray = new Ray(eye, pixel.subtract(eye).normalize());
                let color = trace(ray);
                if (color)
                    myr.primitives.drawPoint(trace(ray), x, y);
            }
        }

        myr.bind();
        myr.clear();
        renderSurface.drawScaled(0, 0, UP_SCALING, UP_SCALING);
        myr.flush();
    };
    
    const animate = () => {
        requestAnimationFrame(animate.bind());
        
        update(getTimeStep());
        render();
    };

    this.start = () => {
        lastDate = new Date();

        myr.setClearColor(COLOR_CLEAR);
        renderSurface.setClearColor(COLOR_CLEAR);
        animate();
    };
};

const renderer = document.getElementById("renderer");
const tracer = new Raytracer(new Myr(renderer));

tracer.start();