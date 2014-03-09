//http://haoluobo.com/2013/02/auction-360buy/

javascript:void(
  t=setInterval(function(){
    max=450;//你的最高出价，超过这个价格就不抢了
    uid='vicalloy';//你在京东的昵称（总不能和自己抢东西吧）
    did=$('.list-info>li.fore1').text().replace('夺宝编号：', '');
    url="http://auction.360buy.com/json/paimai/bid_records?pageNo=1&pageSize=1&dealId="+did;
    ct=$('.over-time>strong').text();
    if (parseInt(ct)>10) return;//在最后10秒开抢
    $.getJSON(url, function(d){
      p = parseInt(d.datas[0].price)+1;
      cuid = d.datas[0].userNickName;
      if (p>max) {
        clearInterval(t);
        return;
      }
      if (uid==cuid) return;
      $.get("http://auction.360buy.com/json/paimai/bid?dealId="+did+"&price="+p);
    });
  }, 1000))//一秒钟刷新一次价格，如果你希望提高出价的成功率，可将间隔改小。