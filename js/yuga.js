/*
 * yuga.js 0.7.2 - 蜆ｪ髮�↑Web蛻ｶ菴懊�縺溘ａ縺ｮJS
 *
 * Copyright (c) 2009 Kyosuke Nakamura (kyosuke.jp)
 * Licensed under the MIT License:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Since:     2006-10-30
 * Modified:  2012-02-04
 *
 * jQuery 1.3.1
 * ThickBox 3.1
 */

/*
 * [菴ｿ逕ｨ譁ｹ豕評 XHTML縺ｮhead隕∫ｴ�蜀�〒谺｡縺ｮ繧医≧縺ｫ隱ｭ縺ｿ霎ｼ縺ｿ縺ｾ縺吶�
 
<link rel="stylesheet" href="css/thickbox.css" type="text/css" media="screen" />
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/thickbox.js"></script>
<script type="text/javascript" src="js/yuga.js" charset="utf-8"></script>

 */

(function($) {

    $(function() {
        //		$.yuga.selflink();
        $.yuga.rollover();
        $.yuga.externalLink();
        $.yuga.thickbox();
        $.yuga.scroll();
        $.yuga.tab();
        //		$.yuga.stripe();
        //		$.yuga.css3class();
    });

    //---------------------------------------------------------------------

    $.yuga = {
        // URI繧定ｧ｣譫舌＠縺溘が繝悶ず繧ｧ繧ｯ繝医ｒ霑斐☆function
        Uri: function(path) {
            var self = this;
            this.originalPath = path;
            //邨ｶ蟇ｾ繝代せ繧貞叙蠕�
            this.absolutePath = (function() {
                var e = document.createElement('a');
                e.href = path;
                return e.href;
            })();
            //邨ｶ蟇ｾ繝代せ繧貞�隗｣
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
        //迴ｾ蝨ｨ縺ｮ繝壹�繧ｸ縺ｨ隕ｪ繝�ぅ繝ｬ繧ｯ繝医Μ縺ｸ縺ｮ繝ｪ繝ｳ繧ｯ
        selflink: function(options) {
            var c = $.extend({
                selfLinkAreaSelector: 'body',
                selfLinkClass: 'current',
                parentsLinkClass: 'parentsLink',
                postfix: '_cr',
                changeImgSelf: true,
                changeImgParents: true
            }, options);
            $(c.selfLinkAreaSelector + ((c.selfLinkAreaSelector) ? ' ' : '') + 'a[href]').each(function() {
                var href = new $.yuga.Uri(this.getAttribute('href'));
                var setImgFlg = false;
                if ((href.absolutePath == location.href) && !href.fragment) {
                    //蜷後§譁�嶌縺ｫ繝ｪ繝ｳ繧ｯ
                    $(this).addClass(c.selfLinkClass);
                    setImgFlg = c.changeImgSelf;
                } else if (0 <= location.href.search(href.absolutePath)) {
                    //隕ｪ繝�ぅ繝ｬ繧ｯ繝医Μ繝ｪ繝ｳ繧ｯ
                    $(this).addClass(c.parentsLinkClass);
                    setImgFlg = c.changeImgParents;
                }
                if (setImgFlg) {
                    //img隕∫ｴ�縺悟性縺ｾ繧後※縺�◆繧臥樟蝨ｨ逕ｨ逕ｻ蜒擾ｼ�_cr�峨↓險ｭ螳�
                    $(this).find('img').each(function() {
                        this.originalSrc = $(this).attr('src');
                        this.currentSrcYuga = this.originalSrc.replace(new RegExp('(' + c.postfix + ')?(\.gif|\.jpg|\.png)$'), c.postfix + "$2");
                        $(this).attr('src', this.currentSrcYuga);
                    });
                }
            });
        },
        //繝ｭ繝ｼ繝ｫ繧ｪ繝ｼ繝舌�
        rollover: function(options) {
            var c = $.extend({
                hoverSelector: '.btn, .allbtn img',
                groupSelector: '.btngroup',
                postfix: '_on'
            }, options);
            //繝ｭ繝ｼ繝ｫ繧ｪ繝ｼ繝舌�縺吶ｋ繝弱�繝峨�蛻晄悄蛹�
            var rolloverImgs = $(c.hoverSelector).filter(isNotCurrent);
            rolloverImgs.each(function() {
                this.originalSrc = $(this).attr('src');
                this.rolloverSrc = this.originalSrc.replace(new RegExp('(' + c.postfix + ')?(\.gif|\.jpg|\.png)$'), c.postfix + "$2");
                this.rolloverImg = new Image;
                this.rolloverImg.src = this.rolloverSrc;
            });
            //繧ｰ繝ｫ繝ｼ繝怜�縺ｮimg隕∫ｴ�繧呈欠螳壹☆繧九そ繝ｬ繧ｯ繧ｿ逕滓�
            var groupingImgs = $(c.groupSelector).find('img').filter(isRolloverImg);

            //騾壼ｸｸ繝ｭ繝ｼ繝ｫ繧ｪ繝ｼ繝舌�
            rolloverImgs.not(groupingImgs).hover(function() {
                $(this).attr('src', this.rolloverSrc);
            }, function() {
                $(this).attr('src', this.originalSrc);
            });
            //繧ｰ繝ｫ繝ｼ繝怜喧縺輔ｌ縺溘Ο繝ｼ繝ｫ繧ｪ繝ｼ繝舌�
            $(c.groupSelector).hover(function() {
                $(this).find('img').filter(isRolloverImg).each(function() {
                    $(this).attr('src', this.rolloverSrc);
                });
            }, function() {
                $(this).find('img').filter(isRolloverImg).each(function() {
                    $(this).attr('src', this.originalSrc);
                });
            });
            //繝輔ぅ繝ｫ繧ｿ逕ｨfunction
            function isNotCurrent(i) {
                return Boolean(!this.currentSrcYuga);
            }

            function isRolloverImg(i) {
                return Boolean(this.rolloverSrc);
            }

        },
        //螟夜Κ繝ｪ繝ｳ繧ｯ縺ｯ蛻･繧ｦ繧､繝ｳ繝峨え繧定ｨｭ螳�
        externalLink: function(options) {
            var c = $.extend({
                windowOpen: true,
                externalClass: 'externalLink',
                addIconSrc: ''
            }, options);
            var uri = new $.yuga.Uri(location.href);
            var e = $('a[href^="http://"]').not('a[href^="' + uri.schema + '://' + uri.host + '/' + '"]');
            if (c.windowOpen) {
                e.click(function() {
                    window.open(this.href, '_blank');
                    return false;
                });
            }
            if (c.addIconSrc) e.not(':has(img)').after($('<img src="' + c.addIconSrc + '" class="externalIcon" />'));
            e.addClass(c.externalClass);
        },
        //逕ｻ蜒上∈逶ｴ繝ｪ繝ｳ繧ｯ縺吶ｋ縺ｨthickbox縺ｧ陦ｨ遉ｺ(thickbox.js蛻ｩ逕ｨ)
        thickbox: function() {
            try {
                tb_init('a[href$=".jpg"]:not(.thickbox, a[href*="?"]), a[href$=".gif"][href!="?"]:not(.thickbox, a[href*="?"]), a[href$=".png"][href!="?"]:not(.thickbox, a[href*="?"])');
            } catch (e) {}
        },
        //繝壹�繧ｸ蜀�Μ繝ｳ繧ｯ縺ｯ縺吶ｋ縺吶ｋ繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ
        scroll: function(options) {
            //繝峨く繝･繝｡繝ｳ繝医�繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ繧貞宛蠕｡縺吶ｋ繧ｪ繝悶ず繧ｧ繧ｯ繝�
            var scroller = (function() {
                var c = $.extend({
                    easing: 100,
                    step: 30,
                    fps: 60,
                    fragment: ''
                }, options);
                c.ms = Math.floor(1000 / c.fps);
                var timerId;
                var param = {
                    stepCount: 0,
                    startY: 0,
                    endY: 0,
                    lastY: 0
                };
                //繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ荳ｭ縺ｫ螳溯｡後＆繧後ｋfunction
                function move() {
                    if (param.stepCount == c.step) {
                        //繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ邨ゆｺ�凾
                        setFragment(param.hrefdata.absolutePath);
                        window.scrollTo(getCurrentX(), param.endY);
                    } else if (param.lastY == getCurrentY()) {
                        //騾壼ｸｸ繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ譎�
                        param.stepCount++;
                        window.scrollTo(getCurrentX(), getEasingY());
                        param.lastY = getEasingY();
                        timerId = setTimeout(move, c.ms);
                    } else {
                        //繧ｭ繝｣繝ｳ繧ｻ繝ｫ逋ｺ逕�
                        if (getCurrentY() + getViewportHeight() == getDocumentHeight()) {
                            //逕ｻ髱｢荳九�縺溘ａ繧ｹ繧ｯ繝ｭ繝ｼ繝ｫ邨ゆｺ�
                            setFragment(param.hrefdata.absolutePath);
                        }
                    }
                }

                function setFragment(path) {
                    location.href = path
                }

                function getCurrentY() {
                    return document.body.scrollTop || document.documentElement.scrollTop;
                }

                function getCurrentX() {
                    return document.body.scrollLeft || document.documentElement.scrollLeft;
                }

                function getDocumentHeight() {
                    return document.documentElement.scrollHeight || document.body.scrollHeight;
                }

                function getViewportHeight() {
                    return (!$.browser.safari && !$.browser.opera) ? document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight : window.innerHeight;
                }

                function getEasingY() {
                    return Math.floor(getEasing(param.startY, param.endY, param.stepCount, c.step, c.easing));
                }

                function getEasing(start, end, stepCount, step, easing) {
                    var s = stepCount / step;
                    return (end - start) * (s + easing / (100 * Math.PI) * Math.sin(Math.PI * s)) + start;
                }
                return {
                    set: function(options) {
                        this.stop();
                        if (options.startY == undefined) options.startY = getCurrentY();
                        param = $.extend(param, options);
                        param.lastY = param.startY;
                        timerId = setTimeout(move, c.ms);
                    },
                    stop: function() {
                        clearTimeout(timerId);
                        param.stepCount = 0;
                    }
                };
            })();
            $('a[href^=#], area[href^=#]').not('a[href=#], area[href=#]').each(function() {
                this.hrefdata = new $.yuga.Uri(this.getAttribute('href'));
            }).click(function() {
                var target = $('#' + this.hrefdata.fragment);
                if (target.length == 0) target = $('a[name=' + this.hrefdata.fragment + ']');
                if (target.length) {
                    scroller.set({
                        endY: target.offset().top,
                        hrefdata: this.hrefdata
                    });
                    return false;
                }
            });
        },
        //繧ｿ繝匁ｩ溯�
        tab: function(options) {
            var c = $.extend({
                tabNavSelector: '.tabNav',
                activeTabClass: 'active'
            }, options);
            $(c.tabNavSelector).each(function() {
                var tabNavList = $(this).find('a[href^=#], area[href^=#]');
                var tabBodyList;
                tabNavList.each(function() {
                    this.hrefdata = new $.yuga.Uri(this.getAttribute('href'));
                    var selecter = '#' + this.hrefdata.fragment;
                    if (tabBodyList) {
                        tabBodyList = tabBodyList.add(selecter);
                    } else {
                        tabBodyList = $(selecter);
                    }
                    $(this).unbind('click');
                    $(this).click(function() {
                        tabNavList.removeClass(c.activeTabClass);
                        $(this).addClass(c.activeTabClass);
                        tabBodyList.hide();
                        $(selecter).show();
                        return false;
                    });
                });
                tabBodyList.hide()
                tabNavList.filter(':first').trigger('click');
            });
        },
        //螂�焚縲∝�謨ｰ繧定�蜍戊ｿｽ蜉�
        stripe: function(options) {
            var c = $.extend({
                oddClass: 'odd',
                evenClass: 'even'
            }, options);
            $('ul, ol').each(function() {
                //JS縺ｧ縺ｯ0縺九ｉ謨ｰ縺医ｋ縺ｮ縺ｧeven縺ｨadd繧帝�↓謖�ｮ�
                $(this).children('li:odd').addClass(c.evenClass);
                $(this).children('li:even').addClass(c.oddClass);
            });
            $('table, tbody').each(function() {
                $(this).children('tr:odd').addClass(c.evenClass);
                $(this).children('tr:even').addClass(c.oddClass);
            });
        },
        //css3縺ｮ繧ｯ繝ｩ繧ｹ繧定ｿｽ蜉�
        css3class: function() {
            //:first-child, :last-child繧偵け繝ｩ繧ｹ縺ｨ縺励※霑ｽ蜉�
            $('body :first-child').addClass('firstChild');
            $('body :last-child').addClass('lastChild');
            //css3縺ｮ:empty繧偵け繝ｩ繧ｹ縺ｨ縺励※霑ｽ蜉�
            $('body :empty').addClass('empty');
        }
    };
})(jQuery);