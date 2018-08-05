// メニューの位置
var posMenu = 0;
// SPウィンドウサイズ
var winSpSize = 767;

$(function () {

  var $win = $(window);

  /*------------------------------------------
  Service Worker
  --------------------------------------------*/
  if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/service-worker.js', {scope: '/'}).catch(console.error.bind(console));
  }
  
  /*------------------------------------------
  user agent
  --------------------------------------------*/
  var ua = navigator.userAgent;
  var bw = window.navigator.userAgent.toLowerCase();
  
  // bodyに特定のclassが付与されている場合
  if($('body').hasClass('pcview') || $('body').hasClass('spview')) {
    // 何もしない
  } else {
    /* iOSスマホ */
    if (ua.indexOf('iPhone') > 0 || ua.indexOf('iPod') > 0 ) {
      $('body').addClass('sp-vis ios');
    } else if (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') > 0) {
      /* Androidスマホ */
      $('body').addClass('sp-vis');
      // Android標準ブラウザかつAndroidバージョンが4以下の場合
      if(isAndDefaultBrowser()==true && androidVersion() <= 4) {
        $('body').addClass('ad-df');
      } else {
        $('body').addClass('ad-ot');
      }
    } else if (ua.indexOf("windows") != -1 && ua.indexOf("phone") != -1) {
      /* windows Phone */
      $('body').addClass('sp-vis winp');
    } else if (ua.indexOf('iPad') > 0 || (ua.indexOf('Android') > 0 && ua.indexOf('Mobile') == -1) || (ua.indexOf("windows") != -1 && ua.indexOf("touch") != -1) || ua.indexOf('A1_07') > 0 || ua.indexOf('SC-01C') > 0){
      /* タブレット */
      $('body').addClass('tab');
      var metalist = document.getElementsByTagName('meta');
      for(var i = 0; i < metalist.length; i++) {
        var name = metalist[i].getAttribute('name');
        if(name && name.toLowerCase() === 'viewport') {
          metalist[i].setAttribute('content','width=1000');
          break;
        }
      }
    } else if (bw.indexOf('msie') != -1 || bw.indexOf('trident') >= 0) {
      //IEの処理
      $('body').addClass('ie pc-vis');
      //IE6-7
      if (bw.indexOf("msie 7.") != -1 || bw.indexOf("msie 6.") != -1) {
        $('body').addClass('ie7');
      } else if (bw.indexOf("msie 8.") != -1) {
        //IE8
        $('body').addClass('ie8');
      } else if (bw.indexOf("msie 9.") != -1) {
        //IE9
        $('body').addClass('ie9');
      } else if (bw.indexOf("msie 10.") != -1) {
        //IE10
        $('body').addClass('ie10');
      }
    } else {
      $('body').addClass('pc-vis');
    }
    //webkit系
    if (bw.indexOf('chrome') != -1 || bw.indexOf('safari') != -1) {
      $('body').addClass('webkit');
    }
  }
  
  /* Android 標準ブラウザ */
  function isAndDefaultBrowser(){
    var ua=window.navigator.userAgent.toLowerCase();
    if(ua.indexOf('linux; u;')>0){
      return true;
    }else{
      return false;
    }
  }
  
  /* Android バージョン判定 */
  function androidVersion() {
    var ua = navigator.userAgent;
    if( ua.indexOf("Android") > 0 ) {
      var version = parseFloat(ua.slice(ua.indexOf("Android")+8));
      return version;
    }
  }
  
  /*------------------------------------------
  メニュー
  --------------------------------------------*/
  var $header = $('header');
  var headerHeight = $header.outerHeight() + 10;
  var startPos = 0;
  
  $win.on('load scroll', function() {
    if(!$('body').hasClass('m-op')) {
      var value = $(this).scrollTop();
      if ( value > startPos && value > headerHeight ) {
        $header.css('top', '-' + headerHeight + 'px');
      } else {
        $header.css('top', '0');
      }
    startPos = value;
    }
  });
  
  // リサイズ（レスポンシブ用）
  var winW = $win.width();
  $win.on('resize', function(){
    var rszW = $win.width();
    if(rszW != winW){
      // SP表示からPC表示に切り替わった場合
      if(rszW > winSpSize) {
        $('.h-menu-nav-box').attr('style','');
        $('.sp-menu-btn').off().removeClass('active');
        $('.sp-close-btn').off();
        $('body').removeClass('m-op');
        headerHeight = $header.outerHeight() + 10;
      } else {
        headerHeight = $header.outerHeight() + 10;
      }
    }
  });
  
  // SPメニュー
  var scrPos = 0;
  var scrSpeed = 300;
  var startNavW  = '-100%';
  var endNavW = '0%';
  
  // SPメニューボタン押下時の処理
  $('.wrap-all').on('click', '.sp-menu-btn, .sp-close-btn', function() {
    var menuClass = '.h-menu-nav-box';
    var btnClass = '.sp-menu-btn';
    var targetElm = 'body';
    // メニューが開いていた場合
    if( $(targetElm).hasClass('m-op') ){
      $(btnClass).removeClass('active');
      $(targetElm).removeClass('m-op');
      $(window).scrollTop(scrPos);
      $(menuClass).fadeOut('slow');
    } else {
      // メニューが閉じていた場合
      scrPos = $(window).scrollTop();
      $(btnClass).addClass('active');
      $(menuClass).fadeIn('slow', function() {
        $(targetElm).addClass('m-op');
      });
    }
    return false;
  });

  /*------------------------------------------
  ページトップ
  --------------------------------------------*/
  // ID
  var pageTopElmId = '#PAGE_TOP';
  $(window).scroll(function () {
    if(!$('body').hasClass('m-op')) {
      var fadeSpeed = 'slow';
      if ($(this).scrollTop() > 100) {
        $(pageTopElmId).fadeIn(fadeSpeed).addClass('f-fixed');
        var docHeight = $(document).height();
        var dispHeight = $(window).height();
        var footerHeight = 120;
        if($(this).scrollTop() > docHeight - dispHeight - footerHeight){
          $(pageTopElmId).addClass('bottom');
        } else {
          $(pageTopElmId).removeClass('bottom');
        }
      } else if ($(this).scrollTop() < 120) {
        $(pageTopElmId).fadeOut(fadeSpeed, function() {
          $(pageTopElmId).removeClass('f-fixed');
        });
      }
    }
  });

  $(pageTopElmId + ' a').on('click', function () {
    setScrollAction(0)
    return false;
  });

  /*------------------------------------------
  年号
  --------------------------------------------*/
  // 現在年取得
  var nowYear = new Date().getFullYear();
  // footerのコピーライトを上書き
  $('footer .c-year').text(nowYear);

  /*------------------------------------------
  smoothScroll
  --------------------------------------------*/
  $('a[href^="#"]').click(function() {
    // ウィンドウのサイズを取得
    var winWSize = $(window).width();
    // ウィンドウサイズが767px未満かつメニューが開いていた場合
    if (winWSize <= winSpSize && $('body').hasClass('m-op')) {
      $('body').removeClass('m-op').css('top','');
      $('.header-menu-box').animate({right:_navW},_speed,'swing');
      $('.overlay').fadeOut(_speed);
      $(window).scrollTop(_st);
    }
    var href= $(this).attr("href");
    var target = $(href == "#" || href == "" ? 'html' : href);
    setScrollAction(target.offset().top);
  });
  
  /*------------------------------------------
  アコーディオン
  --------------------------------------------*/
  $('.acd-box').each(function() {
    var acdHead = $(this).find('.acd-head');
    $(acdHead).on('click', '.acd-btn', function() {
      // アコーディオンが閉じていた場合
      if(!$(acdHead).hasClass('on')) {
        setScrollAction($(acdHead).offset().top - 72);
        openAccordion($(acdHead), $(acdHead).siblings('.acd-body'));
      } else {
        // アコーディオンが開いていた場合
        closeAccordion($(acdHead), $(acdHead).siblings('.acd-body'));
      }
    });
  });

  /*------------------------------------------
  Lazy Load
  --------------------------------------------*/
  $(window).on('scroll', function (){
    $('.aw-lazy').each(function(){
      if(!$(this).hasClass('aw-lazy-init')) {
        var thisElm = $(this);
        var elemPos = thisElm.offset().top;
        var scroll = $(window).scrollTop();
        var windowHeight = $(window).height();
        if (scroll > elemPos - windowHeight + 40){
          var imgElm = thisElm.find('img.aw-lazy-img');
          imgElm.each(function(idx) {
            $(this).attr('src', $(this).attr('data-original'));
            if(idx == imgElm.length - 1 && thisElm.find('.aw-slick').length) {
              thisElm.find('.aw-slick').slick('setPosition');
            }
          });
          thisElm.addClass('aw-lazy-init');
        }
      }
    });
  });

  /*------------------------------------------
  background
  --------------------------------------------*/
  $(window).on('scroll', function (){
    var scroll = $(window).scrollTop();
    var targetHeight = $('.main-vis-area').height();
    if(targetHeight < scroll) {
      $('body').addClass('off');
    } else {
      $('body').removeClass('off');
    }
  });

});

// スクロールを行う処理
function setScrollAction(position) {
  // スクロール速度
  var speed = 'slow';
  // スクロールを実行
  $('body,html').animate({scrollTop:position}, speed, 'swing');
}

// アコーディオンを開く処理
function openAccordion(acdHead, acdBody) {
  $(acdHead).addClass('on');
  $(acdBody).addClass('open').slideDown('slow');
}

// アコーディオンを閉じる処理
function closeAccordion(acdHead, acdBody) {
  $(acdHead).removeClass('on');
  $(acdBody).removeClass('open').slideUp('slow');
}
