/*
@TODO: userID
@TODO:  Seems the timer will be delay, need to improve to get the timing from JD
current: send the request to JD to get the current on JD Server
		 http://auction.jd.com/json/paimai/now?t=1394386281274
		 ack will be:
		 {"now":1394386280849}
		 
endTime: get the endTime on webPage source code:
		        var dealModel={init_price:1.0,startTimeMili:1394413200000,endTimeMili:1394415602000};
				 dealModel['auctionStatus']=0;
				var memberId='stone903';
			var priceLowerOffset = "1.0";
			var priceHigherOffset = "200.0";
			var startPrice = "1.0";
			var jdPrice = parseInt('99.0');



*/

/* Global Setting */

/* Print The Timing Info */
/*  and  */
var scriptStr = $("script").text().toString();
//var userIdStr = scriptStr.match(new RegExp('var memberId=\''+"\."+'\'')).toString();
var userIdStr = scriptStr.match(new RegExp('var memberId=\''+"stone903"+'\'')).toString();
var userId = userIdStr.substring(userIdStr.indexOf('\'')+1,userIdStr.length-1);
console.log("用户名为："+userId);
/* StartTime */
var startTimeStr = scriptStr.match(new RegExp('startTimeMili:'+"\\d+")).toString();
var startTime = startTimeStr.match(new RegExp("\\d+"));
/* EndTime */
var endTimeStr = scriptStr.match(new RegExp('endTimeMili:'+"\\d+")).toString();
var endTime = endTimeStr.match(new RegExp("\\d+"));
/* Current Time */
var currentTimeStr = scriptStr.match(new RegExp('_nowMil='+"\\d+")).toString();
var currentTime = currentTimeStr.match(new RegExp("\\d+"));
/* AuctionTime */
var auctionTime = Math.floor((endTime - startTime)/60000);
/* Rest Time */
var restTime = Math.floor((endTime - currentTime)/1000);

console.log("StartTime: "+startTime+"    EndTime: "+ endTime+"    CurrentTime: "+currentTime);
console.log("拍卖时长为："+auctionTime+" 分钟");
console.log("剩余时间为："+restTime+" 秒");

function GetServerTime()
{   
	var localTime = new Date().getTime();
	var serverTime;
	serverTime = 0;
	var queryServerTime = "http://auction.jd.com/json/paimai/now?t="+ localTime;
	$.get(queryServerTime, function(data){
		serverTime = data.now;
		console.log("serverTime ："+serverTime);
		return parseInt(serverTime);
	});	
}

void(
  serverlTimer = setInterval(function(){
	var localTime = new Date().getTime();
	var serverTime;
	//serverTime = GetServerTime();
	var queryServerTime = "http://auction.jd.com/json/paimai/now?t="+ localTime;
	$.get(queryServerTime, function(data){
	serverTime = data.now;
	console.log("serverTime ："+serverTime);
	restTime = Math.floor((endTime - serverTime)/1000);
	});	
  }, 5000)
)

/* Set a global Timer to simulator the time */
void(
  globalTimer = setInterval(function(){
	restTime = restTime - 0.2;
	if(restTime < -40)
    {
	  clearInterval(globalTimer);
	  clearInterval(loopQuizTimer);
    }
  }, 200)
)

/* Print the Relate Info */
var aboutme = "***京东夺宝岛抢拍-谁与争锋***\n" 
		+ "提供自动报价(半自动)和自动抢拍（全自动）两种功能\n"
		+ "四折价（原价4折值，为抢拍出价提供参考）\n"
		+ "最高出价（自己愿接受的最高价，程序会自动在当前商品报价+1，到达最高价放弃出价，放弃此商品。)\n";
console.log(aboutme);
console.log("有任何问题 %c QQ 244320233", "color:red");
console.log("个人主页：http://zhanghang.org");

var priceLimit = parseInt(/\d+/.exec($(".fore4 del").html())*1*0.4);
var addr = document.location.href;
var uid = /[\d]{4,8}/.exec(addr)[0];

var timeInterval = 500;
var loopCRZtimer;
var loopQuizTimer;
var loopCRZtimerCnt = 0;
var code = "<div id='qp_div'>"
		+ "商品4折价：<input type='text' id='qp_price_limit' readonly />&nbsp;&nbsp;&nbsp;&nbsp;"
			+ "最高出价<input type='text' id='qp_max_price' />&nbsp;&nbsp;&nbsp;&nbsp;"
			+ "刷新间隔<input type='text' id='fresh_TimeInterval' />&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "<input type='button' value='马上开抢' id='qp_btn_begin' class='qp_btn'/>&nbsp;&nbsp;&nbsp;&nbsp;"
		+"<input type='button' value='鬼子进村' id='qp_btn_loop_begin' class='qp_btn'/>&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "<input type='button' value='仅刷价格' id='qp_btn_refresh' class='qp_btn' />&nbsp;&nbsp;&nbsp;&nbsp;"
		+ "【开启控制台可查看抢拍提示】</div>";
$('body').prepend(code);
$('#qp_price_limit').val(priceLimit);
$('#qp_max_price').val(priceLimit);
$('#fresh_TimeInterval').val(timeInterval);

$('#qp_btn_refresh').on('click', function(){queryPrice(uid, priceLimit)});
$('#qp_btn_begin').on('click', function(){crazyBuying(uid, priceLimit)});
$('#qp_btn_loop_begin').on('click', function(){loopCrazyBuying(uid, priceLimit, timeInterval)});

/* Function to get a Random Num */
function GetRandomNum(Min,Max)
{   
var Range = Max - Min;   
var Rand = Math.random();   
return(Min + Math.round(Rand * Range));   
}


function loopCzyBuyMain(uid, priceLimit, timeInterval) {
	if(restTime < 10)
	{
		crazyBuying(uid, priceLimit);
		if(restTime < -30)
		{
		  clearInterval(loopCRZtimer);
		}
	}
	else
	{
		if(loopCRZtimerCnt%20 == 0)
		{
			//For Debug
			//loopCRZtimerCnt = loopCRZtimerCnt+1;
			var time = new Date().getTime();
			time = time/1000;
			console.info("Timer"+restTime+" "+time);
		}
	}
	
}


function loopCrazyBuying(uid, priceLimit,timeInterval) {
	timeInterval = $('#fresh_TimeInterval').val();
	console.info("刷行间隔:"+timeInterval+" ms.");
	loopCRZtimer = setInterval("loopCzyBuyMain(uid, priceLimit, timeInterval)",timeInterval);
}


function queryPriceMain(uid, priceLimit) {
	console.info("自动报价，"+uid+"自动输入价格。时间："+restTime);
	var price;
	var priceMax = $('#qp_max_price').val();
	var time = new Date().getTime();
	var queryIt = "http://auction.jd.com/json/paimai/bid_records?t="
			+ time + "&pageNo=1&pageSize=1&dealId=" + uid;
	$.get(queryIt, function(data){
		price = data.datas[0].price*1+1;
		if (price<=priceMax) {
			$(".quantity-text:last").val(price);
		} else {
			console.info("超出限制价格，不自动输入抢拍价！");
		}
	});
}

function queryPrice(uid, priceLimit){
	loopQuizTimer = setInterval("queryPriceMain(uid, priceLimit)",2*timeInterval);
}

function crazyBuying(uid, priceLimit) {
	console.info("抢拍商品"+uid+"自动提交抢拍价。");
	var price;
	var priceMax = $('#qp_max_price').val();
	var time = new Date().getTime();
	var increaseStep = GetRandomNum(1,3);
	var queryIt = "http://auction.jd.com/json/paimai/bid_records?t="
			+ time + "&pageNo=1&pageSize=1&dealId=" + uid;
	$.get(queryIt, function(data){
		console.log("crazyBuying ："+data);
		price = data.datas[0].price*1+increaseStep;
		if(price > 53)
		{
			if(price < 59)
			{
				price = 59;
			}
		}
		topPriceUserId = data.datas[0].userShowname;
		console.info("当前最高价用户为 "+topPriceUserId);
		if(topPriceUserId != userId)
		{
			if (price<=priceMax) {
				var buyIt = "http://auction.jd.com/json/paimai/bid?t="
					+ time + "&dealId=" + uid + "&price=" + price;
				$.get(buyIt, function(data){
					sayMsg(data);
				}, 'json');
			} else {
				console.info("超出限制价格，停止抢购！");
			}
		}
		else
		{
			console.info("最高价已经是你啦!!! "+ topPriceUserId);
		}

	});
}

function sayMsg(response) {
	if (response.code == "200") {
    	doErrorMsg("恭喜您！","出价成功");
    } else {
        if (response.code == "453") {
            doErrorMsg("哎呀！出价失败~","请您不要连续出价~");
        }
        if (response.code == "451") {
            doErrorMsg("哎呀！出价失败~","出价不得低于当前价格~");
        }
        if (response.code == "452") {
        	doErrorMsg("哎呀！出价失败~","拍卖尚未开始，暂不能出价~");
        }
        if (response.code == "450") {
            doErrorMsg("哎呀！出价失败~","拍卖已经结束，您略晚了一步~");
        }
/*            if (response.code == "455") {
            alert("您的京豆不足或三次试拍机会已用完！");
        }*/
        if (response.code == "457") {
        	doErrorMsg("哎呀！出价失败~","您暂无参拍资格~");
        }
/*           if (response.code == "467") {
            alert("银牌及以上会员京豆小于等于0，不能出价!");
        }*/
        if (response.code == "459") {
            doErrorMsg("哎呀！出价失败~","出价不能低于商品起拍价~");
        }
        if (response.code == "460") {
            doErrorMsg("哎呀！出价失败~","每次加价不得低于最低加价~");
        }
        if (response.code == "461") {
            doErrorMsg("哎呀！出价失败~","每次加价不得高于最高加价~");
        }
        if (response.code == "462") {
            doErrorMsg("哎呀！出价失败~","您所出的价格不能超过该商品的京东价~");
        }
        if (response.code == "463") {
            doErrorMsg("哎呀！出价失败~","出价格式不对！所出价格必须为正整数~");
        }
        if (response.code == "464") {
            doErrorMsg("哎呀！出价失败~","您来晚了一步，本次拍卖已关闭~");
        }
        if (response.code == "465") {
            doErrorMsg("哎呀！出价失败~","您来晚了一步，本次拍卖已删除~");
        }
        if (response.code == "466") {
            doErrorMsg("哎呀！出价失败~","您的账户异常，请稍后再试~");
        }
        if (response.code == "468") {
        	doErrorMsg("哎呀！出价失败~","出价异常，请稍后再试~");
        }
        if (response.code == "469") {
            doErrorMsg("哎呀！出价失败~","尊敬的京东会员,您的京豆需要大于0才可参与拍卖！");
        }
        if (response.code == "470") {
        	doErrorMsg("哎呀！出价失败~","尊敬的京东会员,您的京豆需要大于等于0才可参与拍卖！");
        }
        if (response.code == "471") {
        	doErrorMsg("尊敬的京东会员,为了保障您的账户安全,请先设置京东支付密码!","<a href='http://safe.jd.com/user/paymentpassword/safetyCenter.action' target='blank'>【点我设置支付密码】</a>");
        }
        if (response.code == "4201") {
            doErrorMsg("哎呀！出价失败~","您同时在拍的商品不得超过5个！");
        }
        if (response.code == "4202") {
            doErrorMsg("哎呀！出价失败~","您在夺宝岛获拍且未支付的拍卖不得超过5个!");
        }
        if (response.code == "4203") {
            doErrorMsg("哎呀！出价失败~","您于夺宝岛在拍或未支付的商品总数不得超过5个!");
        }

        if (response.code == "400") {
        	doErrorMsg("哎呀！出价失败~","系统异常，请稍后再试~");
        }
        if (response.code == "403") {
        	 doErrorMsg("哎呀！出价失败~","你还没登录~");
        	 return ;
        }
        if (response.code == "402") {
        	doErrorMsg("哎呀！出价失败~","系统响应异常，请稍后再试~");
        }
    }
}

function doErrorMsg(title, msg) {
	console.log(title + " %c "+msg, "color:red;" )
}






