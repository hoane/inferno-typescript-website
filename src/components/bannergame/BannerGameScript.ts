import cat_left from './assets/cat_left_1_29_23.png';
import cat_right from './assets/cat_right_1_29_23.png';
import cat_sit from './assets/cat_sit_1_29_23.png';
import cat_sleep from './assets/cat_sleep_1_29_23.png';
import heart_1 from './assets/heart_1_16_16.png';
import heart_2 from './assets/heart_2_16_16.png';

/**
 * TYPES
 */
interface CanvasEntity {
    update: () => boolean;
    draw: (ctx: CanvasRenderingContext2D) => void;
}
interface CanvasRect {
    readonly x: number;
    readonly y: number;
    readonly w?: number;
    readonly h?: number;
}

/**
 * CANVAS STATE
 */
class CanvasState {
    public valid: boolean;
    public canvasEntities: CanvasEntity[];
    public rect: CanvasRect;
    public bg: string;

    constructor(canvasEntities: CanvasEntity[], rect: CanvasRect, bg: string) {
        this.valid = false;
        this.canvasEntities = canvasEntities;
        this.rect = rect;
        this.bg = bg;
    }

    public update() {
        this.valid = this.canvasEntities.map((entity) => entity.update()).every((x) => x);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        if (this.valid) {
            return;
        }

        ctx.fillStyle = this.bg;
        ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);

        this.canvasEntities.forEach((entity) => {
            entity.draw(ctx);
        });
    }
}

/**
 * CAT STATE
 */

class CatState {
    public facing: 'left' | 'right';
    public state: 'sleep' | 'sit' | 'walk';
    public timeUntilStateChange: number;

    constructor() {
        this.state = 'sit';
        this.facing = 'right';
        this.timeUntilStateChange = randTime(100, 200);
    }

    public moving = () => this.state === 'walk';

    public update() {
        if (this.timeUntilStateChange <= 0) {
            switch (this.state) {
                case 'sleep':
                case 'walk':
                    this.state = 'sit';
                    this.timeUntilStateChange = randTime(300, 600);
                    break;
                case 'sit':
                    if (Math.random() < 0.5) {
                        this.state = 'walk';
                        if (Math.random() < 0.5) {
                            this.facing = 'left';
                        } else {
                            this.facing = 'right';
                        }
                        this.timeUntilStateChange = randTime(100, 200);
                    } else {
                        this.state = 'sleep';
                        this.timeUntilStateChange = randTime(1000, 2000);
                    }

            }
        } else {
            this.timeUntilStateChange--;
        }
    }
}

const entropy = 1;
function randTime(min: number, max: number): number {
    return Math.floor((1.0 / entropy) * (min + (Math.random() * (max - min))));
}

/**
 * CAT ENTITY
 */
interface CatImages {
    walk_left: CanvasImageSource;
    walk_right: CanvasImageSource;
    sit: CanvasImageSource;
    sleep: CanvasImageSource;
}

type PetCallback = (x: number, y: number, s: HeartType) => void;

class CatEntity {
    public rect: CanvasRect;
    public bounds: CanvasRect;
    public images: CatImages;
    public petCallback: PetCallback;
    public state: CatState;

    constructor(rect: CanvasRect, bounds: CanvasRect, images: CatImages, petCallback: PetCallback) {
        this.rect = rect;
        this.bounds = bounds;
        this.images = images;
        this.petCallback = petCallback;
        this.state = new CatState();
    }

    public pet() {
        const heartType = this.state.state === 'sleep' ? 'sleep' : 'love';
        this.petCallback(this.rect.x, this.rect.y, heartType);
    }

    public updatePosition() {
        switch (this.state.state) {
            case 'walk':
                switch (this.state.facing) {
                    case 'left':
                        this.rect = {...this.rect, x: this.rect.x - 1};
                        break;
                    case 'right':
                        this.rect = {...this.rect, x: this.rect.x + 1};
                        break;
                }
                break;
            case 'sit':
                break;
            case 'sleep':
                break;
        }

        if (this.rect.x + this.rect.w > this.bounds.x + this.bounds.w) {
            this.rect = {...this.rect, x: this.bounds.x + this.bounds.w - this.rect.w};
        }

        if (this.rect.x < 0) {
            this.rect = {...this.rect, x: 0};
        }
    }

    public update(): boolean {
        this.state.update();
        this.updatePosition();
        return false;
    }

    public chooseImage(): CanvasImageSource {
        switch (this.state.state) {
            case 'walk':
                switch (this.state.facing) {
                    case 'left':
                        return this.images.walk_left;
                    case 'right':
                        return this.images.walk_right;
                }
            case 'sit':
                return this.images.sit;
            case 'sleep':
                return this.images.sleep;
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        const image = this.chooseImage();
        ctx.drawImage(image, this.rect.x, this.rect.y, this.rect.w, this.rect.h);
    }
}

/**
 * HEART STATE
 */
type HeartType = 'love' | 'sleep';

class HeartState {
    public visible: boolean;
    public type: HeartType;
    public timeVisible: number;

    constructor() {
        this.visible = false;
        this.type = 'love';
        this.timeVisible = 0;
    }

    public setVisible(heartType: HeartType) {
        this.visible = true;
        this.type = heartType;
        this.timeVisible = 0;
    }

    public update() {
        if (this.visible) {
            if (this.timeVisible >= maxVisibleTime) {
                this.visible = false;
            } else {
                this.timeVisible++;
            }
        }
    }
}

const maxVisibleTime = 60;

/**
 * HEART ENTITY
 */
interface HeartImages {
    love: CanvasImageSource;
    sleep: CanvasImageSource;
}

class HeartEntity {
    public rect: CanvasRect;
    public images: HeartImages;
    public state: HeartState;

    constructor(rect: CanvasRect, images: HeartImages) {
        this.rect = rect;
        this.images = images;
        this.state = new HeartState();
    }

    public spawn(x: number, y: number, heartType: HeartType) {
        if (!this.state.visible) {
            this.state.setVisible(heartType);
            this.rect = {
                ...this.rect,
                x: x + this.rect.w / 2,
                y: y - this.rect.h / 2
            };
        }
    }

    public update(): boolean {
        this.state.update();
        return this.state.visible;
    }

    public chooseImage(): CanvasImageSource {
        switch (this.state.type) {
            case 'love':
                return this.images.love;
            case 'sleep':
                return this.images.sleep;
        }
    }

    public draw = function(ctx: CanvasRenderingContext2D) {
        if (!this.state.visible) {
            return;
        }

        const image = this.chooseImage();
        const offset = Math.floor(5 * Math.cos((this.state.timeVisible) / 5.0));
        ctx.drawImage(image, this.rect.x, this.rect.y + offset, this.rect.w, this.rect.h);
    };
}

/**
 * CLICK LISTENER
 */
function getClickListener(catEntity: CatEntity) {
    const clickListener = (event: MouseEvent) => {
        const dx = event.offsetX - (catEntity.rect.x + catEntity.rect.w / 2);
        const dy = event.offsetY - (catEntity.rect.y + catEntity.rect.y / 2);
        const sq_dist = dx * dx + dy * dy;

        if (sq_dist < 150.0) {
            catEntity.pet();
        }
    };
    return clickListener;

}

/**
 * LOAD AND RUN
 */

function loadImage(src: string): CanvasImageSource {
     const img = new Image();
     img.src = src;
     return img;
 }

function loadCatEntity(w: number, h: number, petCallback: PetCallback): CatEntity {
    return new CatEntity(
        {x: 10, y: h - 23, w: 29, h: 23},
        {x: 0, y: 0, w, h},
        {
            sit: loadImage(cat_sit),
            sleep: loadImage(cat_sleep),
            walk_left: loadImage(cat_left),
            walk_right: loadImage(cat_right)
        },
        petCallback
    );
}

function loadHeartEntity(): HeartEntity {
    return new HeartEntity(
        {x: 0, y: 0, w: 16, h: 16},
        {
            love: loadImage(heart_1),
            sleep: loadImage(heart_2)
        }
    );
}

export function init() {
    const canvas_div = document.getElementById('footer-canvas');
    const canvas = document.createElement('canvas');
    canvas.height = 50;
    canvas.width = canvas_div.clientWidth;
    canvas_div.appendChild(canvas);
    const HEIGHT = canvas.height;
    const WIDTH = canvas.width;
    const ctx = canvas.getContext('2d');

    const heartEntity = loadHeartEntity();
    const catEntity = loadCatEntity(WIDTH, HEIGHT, (x: number, y: number, s: HeartType) => heartEntity.spawn(x, y, s));
    const myState = new CanvasState([catEntity, heartEntity], {x: 0, y: 0, w: WIDTH, h: HEIGHT}, '#ffffff');

    canvas.addEventListener('click', getClickListener(catEntity), false);

    myState.draw(ctx);

    setInterval(() => { myState.update(); myState.draw(ctx); }, 30);
}
