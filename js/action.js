(function($) {

    $(function() {
        $.yuga.rollover();
        $.yuga.stripe();
        $.yuga.css3class();
    });

    //---------------------------------------------------------------------

    $.yuga = {
        //ロールオーバー
        rollover: function(options) {
            var c = $.extend({
                hoverSelector: '.imgover, .allbtn img',
                groupSelector: '.btngroup',
                postfix: '_o'
            }, options);
            //ロールオーバーするノードの初期化
            var rolloverImgs = $(c.hoverSelector).filter(isNotCurrent);
            rolloverImgs.each(function() {
                this.originalSrc = $(this).attr('src');
                this.rolloverSrc = this.originalSrc.replace(new RegExp('(' + c.postfix + ')?(\.gif|\.jpg|\.png)$'), c.postfix + "$2");
                this.rolloverImg = new Image;
                this.rolloverImg.src = this.rolloverSrc;
            });
            //グループ内のimg要素を指定するセレクタ生成
            var groupingImgs = $(c.groupSelector).find('img').filter(isRolloverImg);

            //通常ロールオーバー
            rolloverImgs.not(groupingImgs).hover(function() {
                $(this).attr('src', this.rolloverSrc);
            }, function() {
                $(this).attr('src', this.originalSrc);
            });
            //グループ化されたロールオーバー
            $(c.groupSelector).hover(function() {
                $(this).find('img').filter(isRolloverImg).each(function() {
                    $(this).attr('src', this.rolloverSrc);
                });
            }, function() {
                $(this).find('img').filter(isRolloverImg).each(function() {
                    $(this).attr('src', this.originalSrc);
                });
            });
            //フィルタ用function
            function isNotCurrent(i) {
                return Boolean(!this.currentSrcYuga);
            }

            function isRolloverImg(i) {
                return Boolean(this.rolloverSrc);
            }

        },
        // URIを解析したオブジェクトを返すfunction
        Uri: function(path) {
            var self = this;
            this.originalPath = path;
            //絶対パスを取得
            this.absolutePath = (function() {
                var e = document.createElement('span');
                e.innerHTML = '<a href="' + path + '" />';
                return e.firstChild.href;
            })();
            //絶対パスを分解
            var fields = {
                'schema': 2,
                'username': 5,
                'password': 6,
                'host': 7,
                'path': 9,
                'query': 10,
                'fragment': 11
            };
            var r = /^((\w+):)?(\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/.exec(this.absolutePath);
            for (var field in fields) {
                this[field] = r[fields[field]];
            }
            this.querys = {};
            if (this.query) {
                $.each(self.query.split('&'), function() {
                    var a = this.split('=');
                    if (a.length == 2) self.querys[a[0]] = a[1];
                });
            }
        },
        //奇数、偶数を自動追加
        stripe: function(options) {
            var c = $.extend({
                oddClass: 'odd',
                evenClass: 'even'
            }, options);
            $('ul, ol').each(function() {
                //JSでは0から数えるのでevenとaddを逆に指定
                $(this).children('li:odd').addClass(c.evenClass);
                $(this).children('li:even').addClass(c.oddClass);
            });
            $('table, tbody').each(function() {
                $(this).children('tr:odd').addClass(c.evenClass);
                $(this).children('tr:even').addClass(c.oddClass);
            });
        },
        //css3のクラスを追加
        css3class: function() {
            //:first-child, :last-childをクラスとして追加
            $('body :first-child').addClass('firstChild');
            $('body :last-child').addClass('lastChild');
            //css3の:emptyをクラスとして追加
            $('body :empty').addClass('empty');
        }
    };
})(jQuery);

// Copy Right 用
//___________________________________
function copyrightOut() {
    myDate = new Date();
    Year = myDate.getFullYear();
    SYear = 2008;
    if (SYear == Year) {
        SYear = '';
    } else {
        SYear += " - ";
    }
    document.write("Copyright (C) ", SYear, Year, " VMDP Co.ltd All Rights Reserved.");
}