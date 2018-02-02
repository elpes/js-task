var rate=0;
var timer =60;
var blocks = [];
var blocksCount = 532;
var results=[];

var timerRefreshIntervalId;

var gameStarted = false;

function createBlocks() {
	
	var game=document.getElementById("game");
	for(var i = 0; i < blocksCount; ++i) {
		var div=document.createElement('div');
		div.className="block";
		div.id=String(i);
		game.appendChild(div);

	}
	blocks=game.childNodes;
}
function generateType() {
	randomKey = Math.floor(Math.random()*11);
	switch (randomKey) {
		default:
			return 0;
		break;
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
			return 1; // green
		break;
		case 6:
		case 7:
		case 10:
			return 2; //blue
		break;
		case 8:
		case 9:
			return 3; //yellow
		break;
	}

}
function defineColor(type) {
		switch (type) {
			case 0:
				return "white";
			break;
			case 1:
				return "green";
			break;
			case 2:
				return "blue";
			break;
			case 3: 
				return "yellow";
			break;


		}

	}

function blockEffect(type) {
	switch (type) {
		case 1:
			rate++;
		break;
		case 2:
			rate+=3;
			timer--;
		break;
		case 3:
			timer++;
			rate--;
		break;
	}
	
}

function paintBlocks() {
	
	for(var i = 0; i < blocks.length; ++i ) {
		var type = Math.floor(Math.random()*11);
		blocks[i].type = generateType();
		blocks[i].style.backgroundColor=defineColor(blocks[i].type);

	}

}
function processingClick() {
	if ((event.target.className == "block") && (blocks[Number(event.target.id)].type!=0)) {
		blockEffect(blocks[Number(event.target.id)].type);
		blocks[Number(event.target.id)].style.backgroundColor="white";
		blocks[Number(event.target.id)].type = 0;

        

		var count = 0;

		var appearedBlocksCount = Math.floor(Math.random() * 3);
		
		
		
		for(var i = appearedBlocksCount; i > 0; --i) {
				
				do {
					var newBlockId = Math.floor(Math.random()*blocksCount);


				} while ((newBlockId == event.target.id) || (blocks[newBlockId].type != 0));
				blocks[newBlockId].type=Math.floor(Math.random() * 3)+1;
				blocks[newBlockId].style.backgroundColor=defineColor(blocks[newBlockId].type);										
		}	
		refreshTimer();
		refreshRate();
	}
}


function refreshTimer() {
	if (timer==60)
		document.getElementById('timer').innerHTML = '1:00';
	if((timer<10) && (timer>=0)) 
		document.getElementById('timer').innerHTML = '0:0'+String(timer);
	if((timer<60) && (timer>=10))
		document.getElementById('timer').innerHTML = '0:'+String(timer);

}

function refreshRate() {
if(rate<0) rate =0;

	document.getElementById("rate").innerHTML=String(rate);

}
function timerTick() {
	
	if (timer<=0) {
		clearInterval(timerRefreshIntervalId);
		$("#modal_window").modal("show");
		$("#rate_msg").html("Your score: "+String(rate));
		timer=60;

		
	}
	refreshTimer();
	timer--;

}

function initNewGame() {
	clearInterval(timerRefreshIntervalId);
	timer = 60;
	rate = 0;
	
	$(".block").hide();

	refreshTimer();
	refreshRate();
	
	gameStarted = false;
	
}

function startNewGame() { 
	if (gameStarted == true) 
			return;
	timerRefreshIntervalId = setInterval(timerTick, 1000);
	paintBlocks();
	$(".block").show();
	gameStarted = true;



}
function saveResult(name) {
	player = {
		name: name,
		result: rate
	}
	results.push(player);

	results.sort(function(first, second) {
		if (second.result < first.result)
			return -1;
		if (second.result > first.result)
			return 1;

	});


}
function uploadResults() { 
	if (JSON.parse(localStorage.getItem("results"))==null) 
		return;	
	
	results = JSON.parse(localStorage.getItem("results"));	
}
function saveResults() {

	localStorage.setItem("results", JSON.stringify(results));
	


}
function submitName() {
	var name = $("#name_field").val();
	if (name == "") {
		alert("Name field can't be empty!");
		return;
	}
	
	saveResult(name);
	saveResults();
	refreshResults();
	initNewGame();
	$('#modal_window').modal("toggle");
	$('#name_field').val("");
	

}
function refreshResults() {
	if (results == null)
		return;
	
	$("#results").children().remove();
	for (var i =0; i < results.length; ++i) {
		li = document.createElement('li');
		li.innerHTML=results[i].name+': '+String(results[i].result);
		$("#results").append(li);

	}


}
window.onload = function() {
	uploadResults();
	refreshResults();
	createBlocks();
	refreshResults();
	$("#start").click(startNewGame);	
	$("#newgame").click(initNewGame);
	$("#game").click(function() {
		if (gameStarted == false) 
			return;
		processingClick();
					
		});
	$("#name_submit").click(submitName);

	
}

	

   


	
	
	
	
	


