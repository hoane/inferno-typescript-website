import cat_left from './assets/cat_left_1_29_23.png';
import cat_right from './assets/cat_right_1_29_23.png';
import cat_sit from './assets/cat_sit_1_29_23.png';
import cat_sleep from './assets/cat_sleep_1_29_23.png';
import heart_1 from './assets/heart_1_16_16.png';
import heart_2 from'./assets/heart_2_16_16.png';

/**
 * CANVAS STATE
 */

function CanvasState(canvasEntities, rect, bg) {
	this.valid = false;
	this.canvasEntities = canvasEntities;
	this.rect = rect;
	this.bg = bg;
}

CanvasState.prototype.update = function() {
	this.valid = this.canvasEntities.map((entity) => entity.update()).every(x => x);
};

CanvasState.prototype.draw = function(ctx) {
	if (this.valid) {
		return;
	}

	ctx.fillStyle = this.bg;
	ctx.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);

	this.canvasEntities.forEach((entity) => {
		entity.draw(ctx);
	})
};

/**
 * CAT STATE
 */

const CatFacings = {
	LEFT: 'left',
	RIGHT: 'right'
};

const CatStates = {
	SLEEP: 'sleep',
	SIT: 'sit',
	WALK: 'walk'
};

function CatState() {
	this.state = CatStates.WALK;
	this.facing = CatFacings.RIGHT;
	this.timeUntilStageChange = randTime(100, 200);
}

CatState.prototype.getState = function() {
	return this.state;
};

CatState.prototype.getFacing = function() {
	return this.facing;
};

CatState.prototype.moving = function() {
	return this.state == CatStates.WALK;
}

const entropy = 1;
function randTime(min, max) {
	return Math.floor((1.0 / entropy) * (min + (Math.random() * (max - min))));
}

CatState.prototype.update = function() {
	if (this.timeUntilStageChange <= 0) {
		switch (this.state) {
			case CatStates.SLEEP:
			case CatStates.WALK:
				this.state = CatStates.SIT;
				this.timeUntilStageChange = randTime(300, 600);
				break;
			case CatStates.SIT:
				if (Math.random() < 0.5) {
					this.state = CatStates.WALK;
					if (Math.random() < 0.5) {
						this.facing = CatFacings.LEFT;
					} else {
						this.facing = CatFacings.RIGHT;
					}
					this.timeUntilStageChange = randTime(100, 200);
				} else {
					this.state = CatStates.SLEEP;
					this.timeUntilStageChange = randTime(1000, 2000);
				}

		}
	} else {
		this.timeUntilStageChange--;
	}
};

/**
 * CAT ENTITY
 */

function CatEntity(rect, bounds, walk_left_image, walk_right_image, sit_image, sleep_image, petCallback) {
	this.rect = rect;
	this.bounds = bounds;
	this.walk_left_image = walk_left_image;
	this.walk_right_image = walk_right_image;
	this.sit_image = sit_image;
	this.sleep_image = sleep_image;
	this.petCallback = petCallback;
	this.state = new CatState();
}

CatEntity.prototype.pet = function() {
	var heartType = this.state.getState() == CatStates.SLEEP ? HeartTypes.SLEEP : HeartTypes.LOVE;
	this.petCallback(this.rect.x, this.rect.y, heartType);
}

CatEntity.prototype.updatePosition = function() {
	switch (this.state.getState()) {
		case CatStates.WALK:
			switch (this.state.getFacing()) {
				case CatFacings.LEFT:
					this.rect.x -= 1;
					break;
				case CatFacings.RIGHT:
					this.rect.x += 1;
					break;
			}
		case CatStates.SIT:
		case CatStates.SLEEP:
			break;
	}

	if (this.rect.x + this.rect.w > this.bounds.x + this.bounds.w) {
		this.rect.x = this.bounds.x + this.bounds.w - this.rect.w;
	}

	if (this.rect.x < 0) {
		this.rect.x = 0;
	}
};

CatEntity.prototype.update = function() {
	this.state.update();
	this.updatePosition();
	return false;
};

CatEntity.prototype.chooseImage = function() {
	switch (this.state.getState()) {
		case CatStates.WALK:
			switch (this.state.getFacing()) {
				case CatFacings.LEFT:
					return this.walk_left_image;
				case CatFacings.RIGHT:
					return this.walk_right_image;
			}
		case CatStates.SIT:
			return this.sit_image;
		case CatStates.SLEEP:
			return this.sleep_image;
	}
};

CatEntity.prototype.draw = function(ctx) {
	var image = this.chooseImage();
	ctx.drawImage(image, this.rect.x, this.rect.y, this.rect.w, this.rect.h);
};

/**
 * HEART STATE
 */

const HeartStates = {
	VISIBLE: 'visible',
	INVISIBLE: 'invisible'
};

const HeartTypes = {
	LOVE: 'love',
	SLEEP: 'sleep'
};

function HeartState() {
	this.state = HeartStates.INVISIBLE;
	this.heartType = HeartTypes.LOVE;
	this.timeVisible = 0;
}

HeartState.prototype.getState = function() {
	return this.state;
};

HeartState.prototype.getType = function() {
	return this.heartType;
};

const maxVisibleTime = 60;

HeartState.prototype.setVisible = function(heartType) {
	this.state = HeartStates.VISIBLE;
	this.heartType = heartType;
	this.timeVisible = 0;
};

HeartState.prototype.update = function() {
	switch (this.state) {
		case HeartStates.VISIBLE:
			if (this.timeVisible >= maxVisibleTime) {
				this.state = HeartStates.INVISIBLE;
			} else {
				this.timeVisible++;
			}
			break;
		case HeartStates.INVISIBLE:
			break;
	}
};

/**
 * HEART ENTITY
 */

function HeartEntity(rect, love_image, sleep_image) {
	this.rect = rect;
	this.love_image = love_image;
	this.sleep_image = sleep_image;
	this.state = new HeartState();
}

HeartEntity.prototype.spawn = function(x, y, heartType) {
	if (this.state.getState() == HeartStates.INVISIBLE) {
		this.state.setVisible(heartType);
		this.rect.x = x + this.rect.w/2;
		this.rect.y = y - this.rect.h/2;
	}
};

HeartEntity.prototype.update = function() {
	this.state.update();
	return this.state.getState() == HeartStates.INVISIBLE;
};

HeartEntity.prototype.chooseImage = function() {
	switch (this.state.getType()) {
		case HeartTypes.LOVE:
			return this.love_image;
		case HeartTypes.SLEEP:
			return this.sleep_image;
	}
};


HeartEntity.prototype.draw = function(ctx) {
	if (this.state.getState() == HeartStates.INVISIBLE) {
		return;
	}

	var image = this.chooseImage();
	var offset = Math.floor(5 * Math.cos((this.state.timeVisible) / 5.0));
	ctx.drawImage(image, this.rect.x, this.rect.y + offset, this.rect.w, this.rect.h);
};

/**
 * CANVAS RECT
 */

function CanvasRect(x, y, w, h) {
	this.x = x || 0;
	this.y = y || 0;
	this.w = w || 0;
	this.h = h || 0;
}

/**
 * CLICK LISTENER
 */

function getClickListener(catEntity) {
	var clickListener = (event) => {
		const dx = event.offsetX - (catEntity.rect.x + catEntity.rect.w/2);
		const dy = event.offsetY - (catEntity.rect.y + catEntity.rect.y/2);
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

 function loadImage(src) {
 	var img = new Image();
 	img.src = src;
 	return img;
 }

function loadCatEntity(w, h, petCallback) {
	return new CatEntity(
		new CanvasRect(10,h-23, 29, 23),
		new CanvasRect(0, 0, w, h),
		loadImage(cat_left),
		loadImage(cat_right),
		loadImage(cat_sit),
		loadImage(cat_sleep),
		petCallback);
}

function loadHeartEntity() {
	return new HeartEntity(
		new CanvasRect(0, 0, 16, 16),
		loadImage(heart_1),
		loadImage(heart_2));
}

export function init() {
	const canvas_div = document.getElementById('footer-canvas');
	const canvas = document.createElement('canvas');
	canvas.height = 50;
	canvas.width = canvas_div.clientWidth
	canvas_div.appendChild(canvas)
	const HEIGHT = canvas.height;
	const WIDTH = canvas.width;
	const ctx = canvas.getContext('2d');

	const heartEntity = loadHeartEntity();
	const catEntity = loadCatEntity(WIDTH, HEIGHT, (x, y, s) => heartEntity.spawn(x, y, s));
	const myState = new CanvasState([catEntity, heartEntity], new CanvasRect(0, 0, WIDTH, HEIGHT), '#ffffff');

	canvas.addEventListener('click', getClickListener(catEntity), false);

	myState.draw(ctx);

	setInterval(() => { myState.update(); myState.draw(ctx); }, 30);
}