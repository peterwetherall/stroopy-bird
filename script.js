//Refresh on resize
window.addEventListener("resize", () => {
	location.reload();
});

//Keyboard/mouse binds
let keyboard = {
	isLeft: false,
	isRight: false
};
window.addEventListener("keydown", e => {
	//If space bar is pressed ...
	if (e.keyCode == 32) {
		b.jump();
	}
});

//Ball class
class Ball {
	constructor () {
		this.alive = true;
		this.r = (canvas.width > canvas.height) ? Math.round(canvas.height / 40) : Math.round(canvas.width / 40);
		this.x = canvas.width / 4 - this.r;
		this.y = canvas.height / 2 - this.r;
		this.v = {x: 0, y: 0};
		this.c = "#FFFFFF";
		this.g = 0; //Gravity -> 0.8
		this.j = Math.round(canvas.height / 4) * 0.07; //Jump velocity
	}
	draw () {
		//Gravity
		//Implementing a terminal velocity relative to wall speed so gravity isn't too fast
		if (this.v.y < speed * 3) {
			this.v.y += this.g;
		}
		//Add velocity to position
		let prevY = this.y;
		this.y += this.v.y;
		//If off bottom of screen
		if (this.y + this.r > canvas.height) {
			this.alive = false;
		}
		//If at top of screen
		if (this.y < this.r) {
			this.alive = false;
		}
		//Check for wall collisions
		for (let w of walls) {
			if (w.x < this.x + this.r && w.x + this.r > this.x - this.r) {
				//If ball collides with wrong section of the wall
				for (let bl of w.blocks) {
					if (bl !== w.target) {
						if (this.y - this.r < bl.y + bl.h && this.y + this.r > bl.y) {
							this.alive = false;
						}
					}
				}
			}
		}
		//Draw it on the canvas
		ctx.beginPath();
		ctx.fillStyle = b.c;
		ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
		ctx.fill();
	}
	jump () {
		if (this.g === 0) {
			this.g = window.innerHeight / 1250;
		}
		if (speed === 0) {
			speed = canvas.width / 300;
		}
		this.v.y = -this.j;
	}
}

//Obstacle class
class Wall {
	constructor () {
		this.x = canvas.width + 100;
		this.w = 4;
		this.h = Math.round(canvas.height / this.w);
		this.blocks = [];
		this.c = ["#E50000", "#00E500", "#FFFF00", "#800080", "#FFA500", "#00FFFF", "#FF748C", "#8B4513"];
		for (let i = 0; i < this.w; i++) {
			this.blocks.push({y: i * this.h, w: b.r, h: this.h, c: null});
			this.rand = Math.round(Math.random() * (this.c.length - 1));
			this.blocks[i].c = this.c[this.rand];
			this.c.splice(this.rand, 1);
		}
		//Set ball to random colour in wall - disabled
		//b.c = this.blocks[Math.round((this.w - 1) * Math.random())].c;
		this.target = this.blocks[Math.round((this.w - 1) * Math.random())];
		mode = Math.random() >= 0.5 ? "word" : "colour";
		if (mode == "word") {
			$(".mode-word").css("color", "#FFFFFF");
			$(".mode-colour").css("color", "inherit");
			$("h1").animate({opacity: "0"}, 250, () => {
				$("h1").html(words[this.target.c]);
				let t1 = this.target;
				while (t1 === this.target) {
					t1 = this.blocks[Math.round((this.w - 1) * Math.random())];
				}
				$("h1").css("color", t1.c).animate({opacity: "1"}, 250, () => {
					$("h1").finish();
				});
			});
		} else {
			$(".mode-colour").css("color", "#FFFFFF");
			$(".mode-word").css("color", "inherit");
			$("h1").animate({opacity: "0"}, 250, () => {
				$("h1").css("color", this.target.c);
				let t2 = this.target;
				while (t2 === this.target) {
					t2 = this.blocks[Math.round((this.w - 1) * Math.random())];
				}
				$("h1").html(words[t2.c]).animate({opacity: "1"}, 250, () => {
					$("h1").finish();
				});
			});
		}
	}
	draw () {
		this.x -= speed;
		if (this.x + b.r < 0) {
			score++;
			walls[0] = new Wall();
		}
		for (let block of this.blocks) {
			ctx.fillStyle = block.c;
			ctx.fillRect(this.x, block.y, block.w, block.h);
		}
	}
}

//Setup canvas
let canvas = document.getElementsByTagName("canvas")[0];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight / 20 * 17;
let ctx = canvas.getContext("2d");

//Setup game
let gameInveral;
let tick = 0;
let speed = 0;
let score = 0;
let mode = "word";
let backDir = true;
let words = {
	"#E50000": "Red",
	"#00E500": "Green",
	"#FFFF00": "Yellow",
	"#800080": "Purple",
	"#FFA500": "Orange",
	"#00FFFF": "Blue",
	"#FF748C": "Pink",
	"#8B4513": "Brown"
};
let b = new Ball();
let walls = [new Wall()];

//Main loop
let game = () => {
	tick++;
	if (speed !== 0) {
		if (tick % 240 === 0) {
			speed += 0.1;
		}
	}
	if (tick % 1000 == 0) {
		backDir = !backDir;
	}
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//Draw moving stripes
	for (let i = 0; i < Math.ceil(canvas.width / 10) * 2; i++) {
		let offset = tick % 20;
		if (i % 2 === 0) {
			ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
			if (backDir) {
				ctx.fillRect(i * 10 - offset, 0, 10, canvas.height);
			} else {
				ctx.fillRect(i * 10 + offset, 0, 10, canvas.height);
			}
		}
	}
	//Draw wall
	for (let w of walls) {
		w.draw();
	}
	//Draw ball
	b.draw();
	//Ensure player is alive, end if not
	if (b.alive) {
		requestAnimationFrame(game);
	} else {
		$(".score").html(score);
		if (b.r < window.innerHeight) {
			b.r += window.innerHeight / 20;
			requestAnimationFrame(game);
		} else {
			$("h1").animate({opacity: "0"}, 250);
			$("#end").animate({top: "0px"}, 500);
		}
	}
};

//Auto resize text from: https://stackoverflow.com/a/30607374
$.fn.resizeText = function (options) {
    var settings = $.extend({ maxfont: 40, minfont: 4 }, options);
    var style = $('<style>').html('.nodelays ' +
    '{ ' +
        '-moz-transition: none !important; ' +
        '-webkit-transition: none !important;' +
        '-o-transition: none !important; ' +
        'transition: none !important;' +
    '}');
    function shrink(el, fontsize, minfontsize)
    {
        if (fontsize < minfontsize) return;
        el.style.fontSize = fontsize + 'px';
        if (el.scrollHeight > el.offsetHeight) shrink(el, fontsize - 1, minfontsize);
    }
    $('head').append(style);
    $(this).each(function(index, el)
    {
        var element = $(el);
        element.addClass('nodelays');
        shrink(el, settings.maxfont, settings.minfont);
        element.removeClass('nodelays');
    });
    style.remove();
}

//Jump to it ...
$(document).ready(() => {
	$("h1, h2").resizeText();
	game();
	$("body").on(("ontouchstart" in document.documentElement)  ? "touchstart" : "mousedown", e => {
		e.preventDefault();
		b.jump();
	});
	$(".again").click(e => {
		$("#end").animate({top: "100%"}, 500, () => {
			$("#end").css("top", "-100%");
		});
		backDir = true;
		tick = 0;
		speed = 0;
		score = 0;
		b = new Ball();
		walls = [new Wall()];
		game();
	});
});