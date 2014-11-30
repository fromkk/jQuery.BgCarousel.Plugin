# jQuery BgCarousel Plugin

jQuery BgCarousel Plugin is background carousel of full screen.  

フルスクリーン背景のカルーセルプラグインです。  
imgタグとvideoタグに対応しています。
   

## Usage
```Javascript
<link rel="stylesheet" href="css/jquery.bgcarousel.css" type="text/css">
<script src="js/jquery.min.js" type="text/javascript"></script>
<script src="js/jquery.easing.1.3.js" type="text/javascript"></script>
<script src="js/jquery.bgcarousel.js" type="text/javascript"></script>
$(function()
{
    $('#bg_carousel').BgCarousel({
        left: '#left-button',    //左ボタンのセレクター
        right: '#right-button',  //右ボタンのセレクター
        children:'li',           //背景画像コンテンツのセレクター
        contents:'img,video',    //有効コンテンツ
        duration: 500,           //アニメーションのスピード
        interval:3000,           //アニメーションが動作する間の時間	
        direction:'left',        //タイマーで動作するアニメーションの方向
        easing:'linear',         //jquery.easing.1.3.jsのイージングが有効
        timer:true,              //true or false
        keyboard:true            //true or false
    });
});
```

