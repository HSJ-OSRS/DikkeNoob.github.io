// Ritalin tbow needs gp PM him
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var currroom = "l";
var reset_button = document.getElementById("reset");
reset_button.onclick = function(){init_room(currroom);};
var reset_button = document.getElementById("rooml");
reset_button.onclick = function(){init_room("l");};
var reset_button = document.getElementById("roomr");
reset_button.onclick = function(){init_room("r");};
var reset_button = document.getElementById("rooms");
reset_button.onclick = function(){init_room("s");};
var undo_button = document.getElementById("undo");
undo_button.onclick = function(){uinput.pop(); update();};
var help_button = document.getElementById("help");
var help_text = document.getElementById("helptext");
help_button.onclick = function(){help_text.style.visibility=="hidden"?help_text.style.visibility="visible":help_text.style.visibility="hidden";};
var img_poison0 = new Image();
img_poison0.src = "assets/poison0.png";
var img_poison1 = new Image();
img_poison1.src = "assets/poison1.png";
var img_poison2 = new Image();
img_poison2.src = "assets/poison2.png";
var img_poison3 = new Image();
img_poison3.src = "assets/poison3.png";
var img_sel = new Image();
img_sel.src = "assets/sel.png";
var img_pot = new Image();
img_pot.src = "assets/pot.png";
var uinput = [];
var rem = [];
var chests = [];

var room_l = [[1,16,17,55],
[1,17,38,54],
[3,5,19,30],
[4,22,27,46],
[5,9,19,45],
[6,24,26,41],
[6,26,32,52],
[7,13,44,59],
[8,14,41,43],
[8,10,28,33],
[8,31,47,50],
[10,35,54,63],
[10,30,32,59],
[12,40,53,56],
[12,13,42,54],
[13,22,27,46],
[14,18,23,51],
[15,43,44,58],
[15,16,42,45],
[20,29,45,51],
[20,28,32,34],
[21,39,41,58],
[23,31,47,55],
[23,33,37,55],
[24,34,55],
[26,50,63,27],
[29,39,41,61],
[33,46,52,57],
[34,45,49,60]];

var room_r = [[1,6,28,41],
[1,42,55,60],
[2,10,31,44],
[3,31,43,46],
[3,5,21,48],
[4,20,24,33],
[5,21,48],
[5,17,35,63],
[7,17,45,47],
[8,13,42,48],
[8,20,24,30],
[9,15,23,35],
[11,18,37,39],
[12,14,27,34],
[16,22,29,32],
[18,28,31,64],
[22,29,56,61],
[23,53,71,74],
[26,35,53,59],
[27,30,55,57],
[34,57,58,70],
[38,56,61,70],
[42,46,65],
[48,62,69],
[9,19,32,41],
[16,26,36,39]];

var room_s = [[3,10,42,44],
[4,14,38,52],
[5,6,35,41],
[7,16,34,49],
[9,12,26,27],
[13,25,30,31],
[15,20,53],
[19,26,47,65],
[21,33,36,61],
[21,54,66],
[22,25,35,46],
[24,34,58],
[28,40,52,62],
[29,41,42,63],
[30,32,37,64],
[39,43,51],
[43,45,50,60],
[51,53,56,59]];

var room = room_l;
class chest{
	constructor(orientation, number, px, py) {
		this.orient = orientation;
		this.state = "idle";
		this.number = number;
		this.cx = px*14+2;
		this.cy = py*14+6;
	}
	updatec(clicked, locx, locy){
		if(rem.includes(this.number) && (this.state == "idle" || this.state == "sel")){
			this.state = "pot";
		}
		if((this.state == "pot" || this.state == "potsel") && !rem.includes(this.number)){
			this.state = "idle";
		}
		if(this.state == "clicked" && !uinput.includes(this.number)){
			this.state = "idle";
			setTimeout(function(){update(false, 0, 0);}, 10)
		}
		if ((locx >= this.cx && locx <= this.cx + 13) && (locy >= this.cy && locy <= this.cy + 13)){
			if((this.state != "clicked") && clicked){
				uinput.push(this.number);
			}
			if(this.state == "idle"){
				this.state = "sel";
			}
			if(this.state == "pot"){
				this.state = "potsel";
			}
			
			if(clicked){
				this.state = "clicked";
				setTimeout(function(){update(false, 0, 0);}, 10)
			}
		}
		else{
			if(this.state == "potsel"){
				this.state = "pot";
			}
			if(this.state == "sel"){
				this.state = "idle";
			}
		}
		//ctx.fillText(this.number, this.cx, this.cy);
		if (this.state == "sel"){
			ctx.drawImage(img_sel,this.cx-3,this.cy-3);
		}
		if (this.state == "clicked"){
			if(this.orient == 0){
				ctx.drawImage(img_poison0,this.cx,this.cy);
			}
			if(this.orient == 1){
				ctx.drawImage(img_poison1,this.cx,this.cy);
			}
			if(this.orient == 2){
				ctx.drawImage(img_poison2,this.cx,this.cy);
			}
			if(this.orient == 3){
				ctx.drawImage(img_poison3,this.cx,this.cy);
			}
		}
		if (this.state == "pot"){
			ctx.drawImage(img_pot,this.cx-3,this.cy-3);
		}
		if (this.state == "potsel"){
			ctx.drawImage(img_sel,this.cx-3,this.cy-3);
			ctx.drawImage(img_pot,this.cx-3,this.cy-3);
		}
	}
	
	setstate(){
		if(this.state != "clicked"){
			this.state = "pot";
		}
	}
}

c.onmousemove = function (e) {
   var loc = windowToCanvas(c, e.clientX, e.clientY);
   update(false, loc.x, loc.y);
};

c.onclick = function (e) {
   var loc = windowToCanvas(c, e.clientX, e.clientY);
   update(true, loc.x, loc.y);
};

function windowToCanvas(canvas, x, y) {
   var bbox = c.getBoundingClientRect();

   return { x: x - bbox.left * (canvas.width  / bbox.width),
            y: y - bbox.top  * (canvas.height / bbox.height)
          };
}

function update(clicked, locx, locy){
	ctx.clearRect(0, 0, c.width, c.height);
	for (var h = 0, len = chests.length; h < len; h++) {
		chests[h].updatec(clicked, locx, locy)
	}
	rem.length = 0;
	for (var i = 0, len = room.length; i < len; i++) {
		if ((room[i].includes(uinput[0]) && uinput[0] != undefined) && (room[i].includes(uinput[1]) || uinput[1] == undefined) && (room[i].includes(uinput[2]) || uinput[2] == undefined) && (room[i].includes(uinput[3]) || uinput[3] == undefined)){
			for (var j = 0, lenj = room[i].length; j < lenj; j++){
				if (room[i][j] != uinput){
					rem.push(room[i][j]);
				}
			}
		}
	}
	
	//ctx.fillText(String(Math.floor((locx-2)/14)) + " " + String(Math.floor((locy-6)/14)), 30, 30);
}

function init_room(troom){
	if (troom == "l"){
		room = room_l;
		c.style.background = "url('./assets/thieving_L.png')";
	}
	if (troom == "r"){
		room = room_r;
		c.style.background = "url('./assets/thieving_R.png')";
	}
	if (troom == "s"){
		room = room_s;
		c.style.background = "url('./assets/thieving_S.png')";
	}
	currroom = troom;
	chests.length = 0;
	uinput.length = 0;
	rem.length = 0;
	ctx.clearRect(0, 0, c.width, c.height);
	
	if (troom == "l"){
		chests.push(new chest(0, 1, 9, 13));
		chests.push(new chest(0, 2, 10, 15));
		chests.push(new chest(1, 3, 11, 9));
		chests.push(new chest(3, 4, 12, 17));
		chests.push(new chest(1, 5, 12, 11));
		chests.push(new chest(2, 6, 13, 14));
		chests.push(new chest(3, 7, 14, 13));
		chests.push(new chest(1, 8, 14, 16));
		chests.push(new chest(0, 9, 14, 18));
		chests.push(new chest(0, 10, 15, 7));
		chests.push(new chest(0, 11, 15, 10));
		chests.push(new chest(0, 12, 16, 15));
		chests.push(new chest(3, 13, 16, 20));
		chests.push(new chest(1, 14, 17, 5));
		chests.push(new chest(3, 15, 17, 17));
		chests.push(new chest(1, 16, 17, 18));
		chests.push(new chest(2, 17, 18, 11));
		chests.push(new chest(3, 18, 18, 21));
		chests.push(new chest(3, 19, 19, 10));
		chests.push(new chest(2, 20, 19, 15));
		chests.push(new chest(2, 21, 19, 19));
		chests.push(new chest(1, 22, 20, 13));
		chests.push(new chest(0, 23, 20, 15));
		chests.push(new chest(3, 24, 20, 18));
		chests.push(new chest(1, 25, 20, 20));
		chests.push(new chest(0, 26, 21, 12));
		chests.push(new chest(0, 27, 21, 19));
		chests.push(new chest(3, 28, 21, 22));
		chests.push(new chest(2, 29, 22, 9));
		chests.push(new chest(2, 30, 23, 6));
		chests.push(new chest(0, 31, 23, 9));
		chests.push(new chest(3, 32, 23, 14));
		chests.push(new chest(0, 33, 23, 15));
		chests.push(new chest(2, 34, 23, 21));
		chests.push(new chest(3, 35, 24, 5));
		chests.push(new chest(1, 36, 24, 7));
		chests.push(new chest(2, 37, 24, 18));
		chests.push(new chest(0, 38, 25, 6));
		chests.push(new chest(2, 39, 25, 11));
		chests.push(new chest(2, 40, 25, 15));
		chests.push(new chest(3, 41, 25, 17));
		chests.push(new chest(1, 42, 25, 19));
		chests.push(new chest(1, 43, 26, 4));
		chests.push(new chest(1, 44, 26, 13));
		chests.push(new chest(0, 45, 26, 15));
		chests.push(new chest(0, 46, 26, 18));
		chests.push(new chest(1, 47, 27, 3));
		chests.push(new chest(3, 48, 27, 10));
		chests.push(new chest(2, 49, 28, 7));
		chests.push(new chest(0, 50, 28, 11));
		chests.push(new chest(2, 51, 28, 14));
		chests.push(new chest(3, 52, 29, 6));
		chests.push(new chest(1, 53, 29, 8));
		chests.push(new chest(3, 54, 29, 13));
		chests.push(new chest(1, 55, 29, 15));
		chests.push(new chest(0, 56, 30, 7));
		chests.push(new chest(0, 57, 30, 14));
		chests.push(new chest(3, 58, 30, 18));
		chests.push(new chest(2, 59, 31, 11));
		chests.push(new chest(2, 60, 31, 16));
		chests.push(new chest(2, 61, 32, 9));
		chests.push(new chest(2, 62, 32, 15));
		chests.push(new chest(2, 63, 33, 10));
		chests.push(new chest(2, 64, 33, 13));
	}
		if (troom == "r"){
		chests.push(new chest(0, 1, 13, 14));
		chests.push(new chest(0, 2, 13, 18));
		chests.push(new chest(0, 3, 14, 10));
		chests.push(new chest(0, 4, 14, 12));
		chests.push(new chest(1, 5, 15, 7));
		chests.push(new chest(3, 6, 15, 18));
		chests.push(new chest(3, 7, 15, 22));
		chests.push(new chest(3, 8, 16, 9));
		chests.push(new chest(1, 9, 16, 10));
		chests.push(new chest(3, 10, 16, 13));
		chests.push(new chest(1, 11, 16, 14));
		chests.push(new chest(2, 12, 16, 16));
		chests.push(new chest(0, 13, 17, 5));
		chests.push(new chest(3, 14, 17, 22));
		chests.push(new chest(2, 15, 18, 7));
		chests.push(new chest(2, 16, 18, 11));
		chests.push(new chest(3, 17, 18, 15));
		chests.push(new chest(1, 18, 18, 18));
		chests.push(new chest(0, 19, 19, 7));
		chests.push(new chest(3, 20, 19, 9));
		chests.push(new chest(1, 21, 19, 12));
		chests.push(new chest(0, 22, 19, 17));
		chests.push(new chest(3, 23, 19, 21));
		chests.push(new chest(3, 24, 20, 14));
		chests.push(new chest(1, 25, 20, 15));
		chests.push(new chest(2, 26, 21, 7));
		chests.push(new chest(0, 27, 21, 11));
		chests.push(new chest(2, 28, 21, 18));
		chests.push(new chest(3, 29, 21, 21));
		chests.push(new chest(3, 30, 22, 6));
		chests.push(new chest(1, 31, 22, 9));
		chests.push(new chest(2, 32, 22, 13));
		chests.push(new chest(3, 33, 22, 17));
		chests.push(new chest(1, 34, 22, 19));
		chests.push(new chest(3, 35, 23, 12));
		chests.push(new chest(1, 36, 23, 15));
		chests.push(new chest(0, 37, 23, 18));
		chests.push(new chest(0, 38, 24, 7));
		chests.push(new chest(2, 39, 24, 10));
		chests.push(new chest(3, 40, 24, 20));
		chests.push(new chest(3, 41, 25, 9));
		chests.push(new chest(1, 42, 25, 11));
		chests.push(new chest(0, 43, 25, 14));
		chests.push(new chest(3, 44, 25, 17));
		chests.push(new chest(1, 45, 25, 18));
		chests.push(new chest(2, 46, 26, 6));
		chests.push(new chest(0, 47, 26, 10));
		chests.push(new chest(3, 48, 26, 20));
		chests.push(new chest(1, 49, 27, 2));
		chests.push(new chest(0, 50, 27, 6));
		chests.push(new chest(3, 51, 27, 12));
		chests.push(new chest(1, 52, 27, 13));
		chests.push(new chest(2, 53, 27, 16));
		chests.push(new chest(3, 54, 27, 19));
		chests.push(new chest(1, 55, 28, 3));
		chests.push(new chest(2, 56, 28, 9));
		chests.push(new chest(3, 57, 28, 15));
		chests.push(new chest(1, 58, 28, 17));
		chests.push(new chest(3, 59, 29, 8));
		chests.push(new chest(1, 60, 29, 12));
		chests.push(new chest(0, 61, 29, 16));
		chests.push(new chest(3, 62, 29, 19));
		chests.push(new chest(2, 63, 30, 6));
		chests.push(new chest(1, 64, 31, 12));
		chests.push(new chest(2, 65, 32, 15));
		chests.push(new chest(3, 66, 32, 19));
		chests.push(new chest(3, 67, 33, 14));
		chests.push(new chest(1, 68, 33, 16));
		chests.push(new chest(0, 69, 34, 15));
		chests.push(new chest(1, 70, 36, 12));
		chests.push(new chest(3, 71, 35, 18));
		chests.push(new chest(2, 72, 39, 12));
		chests.push(new chest(2, 73, 38, 14));
		chests.push(new chest(2, 74, 37, 16));
	}
	if (troom == "s"){
		chests.push(new chest(3, 1, 19, 21));
		chests.push(new chest(3, 2, 16, 20));
		chests.push(new chest(3, 3, 18, 20));
		chests.push(new chest(0, 4, 15, 18));
		chests.push(new chest(2, 5, 21, 18));
		chests.push(new chest(3, 6, 13, 17));
		chests.push(new chest(1, 7, 18, 17));
		chests.push(new chest(3, 8, 23, 17));
		chests.push(new chest(0, 9, 28, 17));
		chests.push(new chest(3, 10, 30, 17));
		chests.push(new chest(2, 11, 15, 16));
		chests.push(new chest(0, 12, 16, 16));
		chests.push(new chest(3, 13, 18, 16));
		chests.push(new chest(1, 14, 21, 16));
		chests.push(new chest(3, 15, 26, 16));
		chests.push(new chest(3, 16, 31, 16));
		chests.push(new chest(0, 17, 11, 15));
		chests.push(new chest(2, 18, 20, 15));
		chests.push(new chest(0, 19, 22, 15));
		chests.push(new chest(1, 20, 24, 15));
		chests.push(new chest(2, 21, 28, 15));
		chests.push(new chest(0, 22, 29, 15));
		chests.push(new chest(1, 23, 13, 14));
		chests.push(new chest(1, 24, 17, 14));
		chests.push(new chest(3, 25, 21, 14));
		chests.push(new chest(3, 26, 24, 14));
		chests.push(new chest(2, 27, 31, 14));
		chests.push(new chest(3, 28, 13, 13));
		chests.push(new chest(2, 29, 16, 13));
		chests.push(new chest(1, 30, 27, 13));
		chests.push(new chest(2, 31, 32, 13));
		chests.push(new chest(0, 32, 11, 12));
		chests.push(new chest(0, 33, 19, 12));
		chests.push(new chest(2, 34, 25, 12));
		chests.push(new chest(0, 35, 28, 12));
		chests.push(new chest(0, 36, 12, 11));
		chests.push(new chest(3, 37, 17, 11));
		chests.push(new chest(1, 38, 23, 11));
		chests.push(new chest(2, 39, 33, 11));
		chests.push(new chest(1, 40, 20, 10));
		chests.push(new chest(2, 41, 22, 10));
		chests.push(new chest(0, 42, 24, 10));
		chests.push(new chest(3, 43, 27, 10));
		chests.push(new chest(1, 44, 31, 10));
		chests.push(new chest(0, 45, 11, 9));
		chests.push(new chest(2, 46, 14, 9));
		chests.push(new chest(0, 47, 15, 9));
		chests.push(new chest(3, 48, 23, 9));
		chests.push(new chest(3, 49, 31, 9));
		chests.push(new chest(3, 50, 18, 8));
		chests.push(new chest(0, 51, 21, 8));
		chests.push(new chest(2, 52, 28, 8));
		chests.push(new chest(0, 53, 29, 8));
		chests.push(new chest(2, 54, 34, 8));
		chests.push(new chest(1, 55, 12, 7));
		chests.push(new chest(1, 56, 14, 7));
		chests.push(new chest(3, 57, 20, 7));
		chests.push(new chest(1, 58, 25, 7));
		chests.push(new chest(2, 59, 33, 7));
		chests.push(new chest(1, 60, 16, 6));
		chests.push(new chest(1, 61, 18, 6));
		chests.push(new chest(1, 62, 20, 5));
		chests.push(new chest(2, 63, 23, 5));
		chests.push(new chest(0, 64, 27, 6));
		chests.push(new chest(2, 65, 33, 5));
		chests.push(new chest(2, 66, 21, 20));
	}
}

init_room("l");