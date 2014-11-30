/*!
 * jQuery BgCarousel Plugin
 * http://fromkk.me/
 * 
 * Copyright 2014, FromKK
 * Released under the MIT license
 */

"use strict";

if ( ! String.prototype.px2int )
{
    String.prototype.px2int = function()
    {
        return parseInt(this.replace('px', ''));
    };
}

var BgCarousel = (function()
{
    var self = null;
    var BgCarousel = function(option, element, jq)
    {
        self = this;
        
        if ( typeof option === 'undefined' )
        {
            option = {};
        }
        
        this.jq = jq;
        this.element = element;
        this.option = this.jq.extend({
            left: '#left-button',
            right: '#right-button',
            children:'li',
            contents:'img,video',
            duration: 250,
            interval:3000,
            direction:'left',
            easing:'linear',
            timer:true,
            keyboard:true
        }, option);
        
        this.animating   = false;
        this.initialized = true;
        
        //位置の初期化
        var count = 0;
        var width = this.jq(this.element).width();
        this.jq(this.element).find(this.option.children).each(function()
        {
            self.jq( this ).css('left', width * count + 'px').data('sort', count);
            
            count++;
        });
        //画面サイズが変わった時
        this.jq(window).on('resize', function()
        {
            self.check_window_size.call(self);
        });
        //左ボタンクリック時
        this.jq(this.option.left).on('click', function()
        {
            self.left.call(self);
        });
        //右ボタンクリック時
        this.jq(this.option.right).on('click', function()
        {
            self.right.call(self);
        });
        //背景画像のサイズを変更
        this.check_contents_size.call(this);
        //タイマーの動作を確認
        this.check_timer.call(this);

        //左右のキーボード矢印を押下した時の処理
        if ( this.option.keyboard )
        {
            $(window).on('keyup', function(e)
            {
                if ( 37 === e.keyCode )
                {
                    self.left.call(self);
                } else if ( 39 === e.keyCode )
                {
                    self.right.call(self);
                }

                return true;
            });
        }
    };
    /**
     * タイマーの初期化
     */
    BgCarousel.prototype.reset_timer = function()
    {
        if ( null !== this.timer )
        {
            clearInterval(this.timer);
            this.timer = null;
        }
    };
    /**
     * タイマーの動作を確認
     */
    BgCarousel.prototype.check_timer = function()
    {
        this.timer = null;
        if ( this.option.timer )
        {
            this.timer = setTimeout(function()
            {
                if ( "left" === self.option.direction )
                {
                    self.left.call(self);
                } else if ( "right" === self.option.direction )
                {
                    self.right.call(self);
                }
            }, this.option.interval);
        }
    };
    /**
     * 背景画像サイズを確認
     */
    BgCarousel.prototype.check_contents_size = function()
    {
        var parent_aspect = this.element.width() / this.element.height();
        this.jq(this.element).find(this.option.children).find(this.option.contents).each(function()
        {
            var aspect = self.jq(this).width() / self.jq(this).height();
            
            if ( parent_aspect < aspect )
            {
                self.jq(this).css('height', '100%').css('width', 'auto');
            } else
            {
                self.jq(this).css('width', '100%').css('height', 'auto');
            }
        });
    };
    /**
     * ウィンドウサイズを確認
     */
    BgCarousel.prototype.check_window_size = function()
    {
        var width = this.jq(this.element).width();
        
        this.jq(this.element).find(this.option.children).each(function()
        {
            self.jq(this).css('left', width * self.jq(this).data('sort') + 'px');
        });
        
        this.check_contents_size.call(this);
    };
    /**
     * 一番左にあるコンテンツを取得
     */
    BgCarousel.prototype.min = function()
    {
        var min = Number.MAX_VALUE, result = null;
        
        this.jq(this.element).find(this.option.children).each(function()
        {
            if (min >= self.jq(this).css('left').px2int())
            {
                min = self.jq(this).css('left').px2int();
                result = this;
            }
        });
        
        return result;
    };
    /**
     * 一番右にあるコンテンツを取得 
     */
    BgCarousel.prototype.max = function()
    {
        var max = Number.MIN_VALUE, result = null;
        
        this.jq(this.element).find(this.option.children).each(function()
        {
            if (max <= self.jq(this).css('left').px2int())
            {
                max = self.jq(this).css('left').px2int();
                result = this;
            }
        });
        
        return result;
    };
    /**
     * 左に移動
     */
    BgCarousel.prototype.left = function()
    {
        if ( this.animating )
        {
            return;
        }
        
        this.reset_timer.call(this);
        
        this.animating = true;
        var width = this.jq(this.element).width();
        var max = this.max.call(this);
        var min = this.min.call(this);
        var finished = 0;
        
        this.jq(this.element).find(this.option.children).each(function()
        {
            self.jq(this).animate({
                left: (self.jq(this).css('left').px2int() - width) + 'px'
            }, self.option.duration, self.option.easing, function()
            {
                finished++;
                
                if ( finished === self.jq(self.element).find(self.option.children).length )
                {
                    self.jq(min).css('left', (self.jq(max).css('left').px2int() + width) + 'px');
                    
                    self.animating = false;
                    self.check_contents_size.call(self);
                    self.check_sort.call(self);
                    self.check_timer.call(self);
                }
            });
        });
    };
    /**
     * 右に移動
     */
    BgCarousel.prototype.right = function()
    {
        if ( this.animating )
        {
            return;
        }
        
        this.reset_timer.call(this);
        
        this.animating = true;
        var width = this.jq(this.element).width();
        var max = this.max.call(this);
        var min = this.min.call(this);
        var finished = 0;
        
        this.jq(max).css('left', (this.jq(min).css('left').px2int() - width) + 'px');
        
        this.jq(this.element).find(this.option.children).each(function()
        {
            self.jq(this).animate({
                left: (self.jq(this).css('left').px2int() + width) + 'px'
            }, self.option.duration, self.option.easing, function()
            {
                finished++;
                
                if ( finished === self.jq(self.element).find(self.option.children).length )
                {
                    self.animating = false;
                    self.check_contents_size.call(self);
                    self.check_sort.call(self);
                    self.check_timer.call(self);
                }
            });
        });
    };
    /**
     * 並び順を設定
     */
    BgCarousel.prototype.check_sort = function()
    {
        var width = this.jq(this.element).width();
        this.jq(this.element).find(this.option.children).each(function()
        {
            self.jq( this ).data( 'sort', self.jq(this).css('left').px2int() / width );
        });
    };

    return BgCarousel;
})();

(function(jq)
{
    jq.fn.BgCarousel = function(opt)
    {
        return new BgCarousel(opt, this, jq);
    };
})(jQuery);