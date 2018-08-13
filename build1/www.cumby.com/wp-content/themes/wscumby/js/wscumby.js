var mobile = false;
var hoverBreak = 1024;
var mobileBreak = 768;
if($(window).width() <= mobileBreak){mobile = true;}
var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
var path;
function freezePage(){$('body').css({'width':'100%','height':'100%','overflow':'hidden'});}
function unfreezePage(){$('body').css({'width':'','height':'','overflow':''});}
function animScroll(sec, speed, offset){
	activeOffset = $(sec).offset().top;	
	TweenMax.to('html,body', speed, {scrollTop:activeOffset-offset, ease:Expo.easeInOut});
}





//! - GLOBAL: WINDOW RESIZE

var winW;
var winH;
$(window).resize(function(){
	winW = $(window).width();
	winH = $(window).height();
	//console.log(winW);
	
	// update menu positions
	updateMenuPos();
	
	// update news slides on mobile
	if(winW<=650){
		updateNewsMobile();
		newsMob = true;
	}
	if(winW>650 && newsMob == true) {
		setupNewsImg();
		updateNewsPos();
		newsMob = false;
	}
	
	// remove sticky submenu for mobile
	if(winW<=750 && menuSticky){
		$('body').unbind('click');
		$('#menu-sticky').css({'height':''})
		$('.menu-sticky-drop').attr('style','');
		$('#globalHeader').find('.sticky').css({'height':''});
		$('.menu-sticky-btn').removeClass('on');
		menuSticky = false;
	}
	
	// update dark hero brackets for mobile
	if($('body').find('#dark-hero').length > 0){
		updateDarkHero();
	}
	
	// update project drop down coming from mobile
	if($('body').attr('id') == 'page-projects'){
		if(winW>550 && sT > 0 && !$('.tier-title').hasClass('faded')){
			$('.tier-title').addClass('faded');
		}
		if(winW<=550 && sT > 0 && $('.tier-title').hasClass('faded')){
			$('.tier-title').removeClass('faded');
		}
	}
	
	// update team overlay bg
	if($('body').attr('id') == 'page-people' && $('#overlay-team').hasClass('on')){
		updateTeamOverlay();
	}
	
	// update sticky menu
	if($('body').attr('id') == 'page-projects' && $('body').hasClass('detail')){
		updateMenuSticky();
	}
	
})
$(window).resize();




//! FORM SUBMIT

$('.field-wrap').find('input').focus(function(){
	$(this).parents('.field-wrap').addClass('on');
})
$('.field-wrap').find('input').blur(function(){
	if($(this).val() == ''){
		$(this).parents('.field-wrap').removeClass('on');
	}
})

var formSent = false;
var formURL = $('#contactForm').attr('action');

$('#contactForm').submit(function(){
	if(validateForm($(this))){
		sendForm();
	}
	return false;
});

function sendForm(){

// animation actions
TweenMax.to('.form-cover', .5, {opacity:.5, 'display':'block'})

var formData = $('#contactForm').serialize();

$.ajax({
    url: formURL,
    type: 'POST',
    data: formData,
        
    success: function(result){	
	    //console.log(result);				
		formSent = true;
		TweenMax.to($('#contact-form').find('.thanks'), .5, {opacity:1, 'display':'block', onComplete:function(){
			$('#contactForm').find('input[type="text"],input[type="email"],textarea').val('');
			$('.field-wrap').removeClass('on');
			TweenMax.set('.form-cover', {opacity:0, 'display':'none'})
		}})
		TweenMax.to($('#contact-form').find('.thanks'), .5, {delay:3, opacity:0, 'display':'none'})
    }
});

}

function validateForm(formObj){	
	var vNum = 0;
	$(formObj).find('[data-type="req"]').each(function(){
		if($(this).val() == ""){	
			$(this).parents('.field-wrap').addClass('error');
			if($(this).attr('name') == 'message'){
				$(this).addClass('error');
				$('label.ta').addClass('error');
			}
			vNum++;
		}
	});
	if(vNum==0){
		return true;
	} else {
		$(formObj).addClass('error');
		return false;
	}
}

$('[data-type="req"]').focus(function(){
	if($('#contactForm').hasClass('error')){
		$('#contactForm').removeClass('error');
		$('#contactForm').find('.error').removeClass('error');
	}
})





//! - GLOBAL: MENU

var menuOpen = false;
var closingMenu = false;
var menuW = $('#globalMenu').find('.menu-wrap').outerWidth();

$('.menu-hit').click(function(){		
		
	if(!menuOpen){
		
		$('#globalMenu').addClass('open expanded');
		menuW = $('#globalMenu').find('.menu-wrap').outerWidth();
				
		// slide out menu
		TweenMax.set('.menu-wrap', {x:menuW, 'visibility':'visible'})
		TweenMax.to('.menu-wrap', .75, {x:0, ease:Power4.easeInOut, onComplete:function(){setMenuListener();}})
		
		// setup bg cover
		coverGap = Number(winW) - Number(menuW);
		TweenMax.set($('#globalMenu').find('.menu-bg'), {'right':menuW-1, scaleX:0, 'display':'block'});
		$('#globalMenu').find('.menu-bg').width(coverGap+2);
		TweenMax.to($('#globalMenu').find('.menu-bg'), .6, {delay:.35, scaleX:1, ease:Power4.easeInOut});
			
		menuOpen = true;
	} else if(!closingMenu) {			
		closeMenu();	
	}
})

function closeMenu(){
	closingMenu = true;
	menuW = $('#globalMenu').find('.menu-wrap').outerWidth();
	
	$('#globalMenu').removeClass('open');
	
	// remove cover
	TweenMax.to($('#globalMenu').find('.menu-bg'), .3, {scaleX:0, ease:Power3.easeInOut});

	menuDel = .1;
	
	// remove menu
	TweenMax.to('.menu-wrap', .75, {delay:menuDel, x:menuW, ease:Power3.easeInOut, onComplete:function(){
		unfreezePage();
		$(document).unbind('click');
		$('#globalMenu').removeClass('expanded');
		closingMenu = false;
	}})			

	menuOpen = false;
}

function setMenuListener(){	
	freezePage();
	$(document).click(function(){
		closeMenu();
		menuOpen = false;
		$(document).unbind('click');
	})
	$('#globalMenu').find('.menu-contents').click(function(e){
		e.stopPropagation();
	})
}

function updateMenuPos(){
	if(menuOpen){
		menuW = $('#globalMenu').find('.menu-wrap').outerWidth();
		coverGap = Number(winW) - Number(menuW);
		
		$('#globalMenu').find('.menu-bg').css({'width':coverGap+'px', 'right':menuW+'px'});
	}
}






//! PARALLAX

function isScrolledIntoView(elem, offset){
	viewDif = Number(offset);
	
    sT = Number($(document).scrollTop());
	vT = Number($(elem).offset().top)+viewDif;
	vB = sT+winH;
	vH = vT+$(elem).outerHeight()+winH;
	if((vT <= vB && vT >= sT) || (vT <= vB && vB <= vH)){
		return true;
	}
}





//! - GLOBAL: LOADER

freezePage();
var loadReady = false;
setTimeout(function(){
	if($('body').attr('id') == 'page-home' && !$('#loader').hasClass('revisit')){
		goLoader();
	} else {
		loadReady = true;
	}
}, 500);

$(window).on('load', function(){
	loadCheck = setInterval(function(){
		if(loadReady){
			
			
			// for home only
			
			if($('body').attr('id') == 'page-home' && !$('#loader').hasClass('revisit')){
				
				TweenMax.to($('#loader').find('.icon-bracket-l, .icon-bracket-r'), .75, {x:0, y:0, 'color':'#fff', opacity:1, ease:Power3.easeInOut})
				setTimeout(function(){$('#loader').find('.logo').addClass('open');}, 200);	
				
				setTimeout(function(){
					TweenMax.to($('.loader-wrap'), .4, {scaleX:.8, scaleY:.8, opacity:0, ease:Expo.easeIn})
					setTimeout(function(){homeIntro();}, 600);
					TweenMax.to('#loader', 1, {delay:.4, opacity:0, 'display':'none'})
				}, 1000);	
			
			
			// other pages
			
			} else {
				
				TweenMax.to('#loader', 1, {delay:.4, opacity:0, 'display':'none', onComplete:function(){
					unfreezePage();
					$(window).resize();			
				}});
				
				// page specific open animations		
				if($('body').find('#dark-hero').length>0){
					setTimeout(function(){openDarkHero();}, 500);
				}
				
				// if home and a revisit, automate intro
				if($('body').attr('id') == 'page-home' && $('#loader').hasClass('revisit')){	
					autoHome();
				}
			}
	
			clearInterval(loadCheck);
		}
	}, 50);
})



//! HOME: LOADER

if($('body').attr('id') == 'page-home' && !$('#loader').hasClass('revisit')){	
	TweenMax.set($('#globalHeader'), {y:-105})
	TweenMax.set($('#globalMenu'), {y:-150})
}

function goLoader(){
	TweenMax.to($('#loader').find('.icon-bracket-l, .icon-bracket-r'), 1, {y:0, opacity:1, ease:Power3.easeInOut, onComplete:function(){
		loadReady = true;
	}})
}

function homeIntro(){
	
	TweenMax.to($('#base-projects').find('.col.projects'), .5, {y:0, ease:Power3.easeOut})
	TweenMax.to($('#base-projects').find('.col.people'), .5, {delay:.4, y:0, ease:Power3.easeOut})

	TweenMax.to($('#globalHeader'), .5, {delay:.6, y:0, ease:Power3.easeOut})
	TweenMax.to($('#globalMenu'), .5, {delay:.6, y:0, ease:Power3.easeOut})
	
	TweenMax.to($('.hero-txt'), 1, {delay:1, opacity:1, onComplete:function(){
		unfreezePage();
		$(window).resize();
	}})
	
	drawCirc();
	setTimeout(function(){
		if(!slidesOff){
			startHomeSlideshow();
		}
	}, 8000)	
}

function autoHome(){
	TweenMax.set($('#base-projects').find('.col.projects'), {y:0})
	TweenMax.set($('#base-projects').find('.col.people'), {y:0})
	TweenMax.set($('#globalHeader'), {y:0})
	TweenMax.set($('#globalMenu'), {y:0})
	TweenMax.set($('.hero-txt'), {opacity:1})
	
	drawCirc();
	setTimeout(function(){
		if(!slidesOff){
			startHomeSlideshow();
		}
	}, 8000)
}





//! HOME: SLIDESHOW

var homeSlide = 1;
var homeTotalSlides = $('.hero-bg').length;
var homeSlideTimer = 8000;
var homeSlidesInt;
var slidesOff = false;

function startHomeSlideshow(){
	changeHomeSlide();	
	homeSlideInt('');
}

function homeSlideInt(n){
	if(n != ''){
		changeHomeSlide(n);
	}
	homeSlidesInt = setInterval(function(){		
		changeHomeSlide();				
	}, homeSlideTimer);
}

function changeHomeSlide(next){
	
	lastSlide = homeSlide;
	
	if(next == undefined){
		homeSlide++;
		if(homeSlide > homeTotalSlides){homeSlide = 1;}
	} else {
		homeSlide = next;
		TweenMax.killTweensOf($('.slide-time-circle[data-num="'+lastSlide+'"]').find('.path-circ'));
	}
	
	// prep new slide
	nxtSlide = $('.hero-bg[data-num="'+homeSlide+'"]');
	nxtSlide.addClass('on');
	TweenMax.set(nxtSlide, {opacity:0, 'z-index':1});
	$('.hero-bg[data-num="'+lastSlide+'"]').css({'z-index':0})

	TweenMax.to(nxtSlide, 2, {opacity:1, onComplete:function(){
		$('.hero-bg[data-num="'+lastSlide+'"]').removeClass('on');
	}});
	
	// animate circle timer
	drawCirc();
	lastCirc = $('.slide-time-circle[data-num="'+lastSlide+'"]').find('.path-circ');
	TweenMax.set($('.path-circ'), {drawSVG:'0%'});
}

// slideshow circle draw timer

var circTimer = homeSlideTimer/1000;

if($('body').attr('id') == 'page-home'){
	TweenMax.set($('.path-circ'), {drawSVG:'0%'});
}
function drawCirc(){
	trg = $('.slide-time-circle[data-num="'+homeSlide+'"]').find('.path-circ');
	TweenMax.to(trg, circTimer, {drawSVG:'0 100%', ease:Linear.easeNone});
}

// click to change slides

$('.slide-time-circle').click(function(){
	clearInterval(homeSlidesInt);
	slidesOff = true;
	
	homeSlideInt($(this).attr('data-num'));
})





//! - SCROLL BASED EVENTS

var sT;

$(window).scroll(function(){
		
	sT = $(this).scrollTop();
		
	// set sticky bar
	setGlobalSticky()
	
	// set subnav sticky
	if($('body').attr('id') == 'page-people'){
		updatePeopleNav();
	}
	
})





//! - GLOBAL: STICKY NAV

var stickyOpen = false;
var stickyH = 72;

function setGlobalSticky(){
	
	topDif = 0;

	// open sticky
	if($(window).scrollTop() > topDif){	
		if(!stickyOpen){
			TweenMax.to($('.sticky'), .75, {top:-10, ease:Power3.easeInOut});
			$('#globalHeader, #globalMenu, .backto-btn').addClass('hasSticky');
			
			// project title sticky
			if(winW>550){
				$('.tier-title').addClass('faded');
			}
			
			stickyOpen = true;
		}
		
		
	// remove sticky
	} else {		
		if(stickyOpen){
			TweenMax.to($('.sticky'), .75, {top:-80, ease:Back.easeInOut, easeParams:[2,2]});		
			$('#globalHeader, #globalMenu, .backto-btn').removeClass('hasSticky');
			
			// project title sticky
			$('.tier-title').removeClass('faded');
			
			stickyOpen = false;
			
			// reset special sticky parts
			if(menuSticky){
				$('.menu-sticky-btn').removeClass('on');
				menuSticky = false;
				closeMenuSticky();
			}
		}
	}
	
}





/*! - GLOBAL: EXTRAS */

// add underlines / format spacing

subSpace = 0;
subGap = 100;

$('.subpage-nav').find('li').each(function(){
	$(this).append('<div class="uline"></div>');
	
	subSpace += Math.ceil($(this).width())+subGap;
})

$('.subpage-nav').css('max-width',subSpace+'px');



//! - GLOBAL: STICKY DROP MENUS

var menuSticky = false;

$('.menu-sticky-btn').click(function(){
	if(!menuSticky){
		openMenuSticky();
		$(this).addClass('on');
		menuSticky = true;
	} else {
		closeMenuSticky();
		$(this).removeClass('on');
		menuSticky = false;
	}
})

function openMenuSticky(){
	tmpH = $('.menu-sticky-drop').outerHeight()+stickyH;
	$('#menu-sticky').css({'height':tmpH})
	TweenMax.to($('#globalHeader').find('.sticky'), .75, {height:tmpH, ease:'easeInBackOut'})
	TweenMax.to($('.menu-sticky-drop'), .75, {startAt:{y:'-100%'}, y:'0%', ease:'easeInBackOut'})
	
	setTimeout(function(){setStickyListener();}, 200);
}
function closeMenuSticky(){
	$('body').unbind('click');
	TweenMax.to($('#globalHeader').find('.sticky'), .75, {height:stickyH, ease:'backInEaseOut'})
	TweenMax.to($('.menu-sticky-drop'), .75, {y:'-100%', ease:'backInEaseOut', onComplete:function(){
		$('#menu-sticky').css({'height':''})
		$('#globalHeader').find('.sticky').css({'height':''})
	}})
}
function updateMenuSticky(){
	if(menuSticky){
		tmpH = $('.menu-sticky-drop').outerHeight()+stickyH;
		$('#menu-sticky').css({'height':tmpH});
		$('#globalHeader').find('.sticky').css({'height':tmpH});	
	}
}

function setStickyListener(){
	$('body').bind('click', function(){
		closeMenuSticky();
		$('.menu-sticky-btn').removeClass('on');
		menuSticky = false;
	})
}

$('.menu-sticky-drop').click(function(e){
	e.stopPropagation();
})

CustomEase.create("backInEaseOut", "M0,0 C0.068,0 0.128,-0.061 0.175,-0.081 0.224,-0.102 0.267,-0.107 0.315,-0.065 0.384,-0.004 0.449,0.253 0.465,0.323 0.505,0.501 0.497,0.493 0.536,0.67 0.564,0.799 0.616,0.882 0.696,0.936 0.766,0.983 0.938,0.998 1,1");
CustomEase.create("easeInBackOut", "M0, 0, C0, 0, 0.152, 0, 0.24, 0.012, 0.264, 0.015, 0.283, 0.026, 0.305, 0.042, 0.326, 0.058, 0.342, 0.075, 0.36, 0.1, 0.378, 0.127, 0.39, 0.15, 0.405, 0.184, 0.422, 0.225, 0.433, 0.252, 0.445, 0.298, 0.48, 0.437, 0.494, 0.526, 0.53, 0.67, 0.543, 0.725, 0.552, 0.758, 0.57, 0.809, 0.584, 0.851, 0.595, 0.878, 0.615, 0.913, 0.629, 0.939, 0.641, 0.956, 0.66, 0.975, 0.676, 0.992, 0.69, 1.001, 0.71, 1.009, 0.729, 1.018, 0.744, 1.022, 0.765, 1.021, 0.853, 1.018, 1, 1, 1, 1");





//! HOVER: IMAGE BOX


// populate hovers with different contents

var hoverParts1 = '<div class="project-hover"><div class="hover-fill"></div><div class="hover-icon">';
var hoverParts2 = '<div class="icon left icon-bracket-l"></div><div class="icon right icon-bracket-r"></div></div></div>';

// home projects
$('#page-home').find('#base-projects').find('.project-box').each(function(){
	tmpHover = hoverParts1+'<p class="txt">VIEW MORE</p>'+hoverParts2;
	$(this).find('.project-photo').append(tmpHover);
})

// home news
$('#home-news').find('.news-slide').each(function(){
	tmpHover = hoverParts1+'<p class="txt">READ MORE</p>'+hoverParts2;
	$(this).find('.project-photo').append(tmpHover);
})

// news page
$('#base-news, #article-next').find('.news-box').each(function(){
	tmpHover = hoverParts1+'<p class="txt">READ MORE</p>'+hoverParts2;
	$(this).find('.project-photo').append(tmpHover);
})

// tier projects landing
$('#page-projects.overview').find('#base-projects').find('.project-box').each(function(){
	tmpHover = hoverParts1+'<div class="txt"><p>view</p><h2>'+$(this).attr('data-title')+'</h2></div>'+hoverParts2;
	$(this).find('.project-photo').append(tmpHover);
	$(this).find('.project-photo').addClass('expanded');
})

// tier project sector
$('#page-projects.sector').find('#base-projects').find('.project-box').each(function(){
	tmpHover = hoverParts1+'<p class="txt">VIEW</p>'+hoverParts2;
	$(this).find('.project-photo').append(tmpHover);
})

// team bios
$('#people-team').find('.team-box').each(function(){
	tmpHover = hoverParts1+'<p class="txt">READ MORE</p>'+hoverParts2;
	$(this).find('.team-photo').append(tmpHover);
})

$('.project-photo, .team-photo').mouseenter(function(){
	if(winW>hoverBreak){
	
	// fade
	TweenMax.to($(this).find('.project-hover'), .75, {opacity:1})
	
	// move brackets	
	brLX = -67; brLY = 52; brRX = 67; brRY = -52;
	if($(this).hasClass('expanded')){
		brLX = -94; brLY = 90; brRX = 94; brRY = -74;
	}
	
	TweenMax.set($(this).find('.icon.left'), {x:0, y:7})
	TweenMax.set($(this).find('.icon.right'), {x:0, y:-7})
	TweenMax.to($(this).find('.icon.left'), 1, {x:brLX, y:brLY, ease:Power3.easeInOut})
	TweenMax.to($(this).find('.icon.right'), 1, {x:brRX, y:brRY, ease:Power3.easeInOut})
	
	// fade word
	TweenMax.set($(this).find('.txt'), {opacity:0, scaleX:.5, scaleY:.5})	
	TweenMax.to($(this).find('.txt'), .75, {delay:.1, scaleX:1, scaleY:1, opacity:1, ease:Power3.easeInOut})
	
	}	
})

$('.project-photo, .team-photo').mouseleave(function(){
	TweenMax.to($(this).find('.project-hover'), 1, {opacity:0, ease:Power3.easeInOut})
	
	TweenMax.to($(this).find('.icon.left'), .5, {x:0, y:7, ease:Power3.easeInOut})
	TweenMax.to($(this).find('.icon.right'), .5, {x:0, y:-7, ease:Power3.easeInOut})
	TweenMax.to($(this).find('.txt'), .5, {scaleX:.5, scaleY:.5, opacity:0, ease:Power3.easeInOut})	
})





//! HOME: SERVICES

// setup filler module for spacing
var txtLn = 0;
var servFiller;
$('.service-texts').find('.service-text').each(function(){
	if($(this).find('p').text().length > txtLn){
		txtLn = $(this).find('p').text().length;
		servFiller = $(this).find('p').text();
	}
})
$('.service-text-filler').find('p').text(servFiller);

var curServ = 1;

$('#page-home').find('.services-nav').find('li>a').click(function(){
	nextServ = $(this).parents('li').attr('data-num');
	nextColor = $(this).parents('li').attr('data-color');
	
	if(nextServ != curServ){
	
		// transition
		changeHomeServices(nextServ);
		
		// update nav
		$('.services-nav').find('li').removeClass('on');
		$(this).parents('li').addClass('on');
	
	}
	
	return false;
})

function changeHomeServices(nxt){
	// fade out current diagram text
	TweenMax.to('.diagram-labels, .diagram-image', .5, {delay:.5, opacity:0});
	
	curServ = nxt;
	
	// swipe on cover
	$('.services-cover').removeClass('lt').addClass('rt');
	TweenMax.to('.services-cover', 1, {scaleX:1, ease:Power3.easeInOut, onComplete:function(){
		
		// change image
		$('#base-services').find('.service-image, .service-text').removeClass('on');
		$('#base-services').find('.service-image[data-num="'+curServ+'"], .service-text[data-num="'+curServ+'"]').addClass('on');
		
		// swipe off cover to reveal
		$('.services-cover').removeClass('rt').addClass('lt');
		TweenMax.to('.services-cover', 1, {scaleX:0, ease:Power3.easeInOut});
		
		// switch colors		
		$('.services-diagram').removeClass('blue green').addClass(nextColor);
		
		// update diagram text
		$('.diagram-num .num').text('.0'+curServ);
		$('.diagram-labels').find('.d-label').removeClass('on');
		$('.diagram-labels').find('.d-label[data-num="'+curServ+'"]').addClass('on');
		TweenMax.to('.diagram-labels', .5, {delay:.5, opacity:1});
		
		// animate diagram
		$('.diagram-image').find('.d-img').removeClass('on');
		$('.diagram-image').find('.d-img[data-num="'+curServ+'"]').addClass('on');
		TweenMax.to('.diagram-image', .5, {delay:.5, opacity:1});
		
		// update link
		goURL = $('.service-text[data-num="'+curServ+'"]').attr('data-url');
		$('.services-text').find('.cta-btn').attr('href',goURL);
	}})
}





//! HOME: NEWS

var totalNews = 0;
var newsGap = 80;
var curNews = 1;
var totNewsSlides = $('.news-slide').length;

// add extra slides for looping
$('.home-news-slides').each(function(){
	$(this).attr('data-total',$(this).find('.slide').length);
	$(this).find('.news-slide').each(function(i){
		if(i<3){
			$(this).clone().appendTo($(this).parents('.home-news-slides'));
		}
	})
})

function setupNewsImg(){
	totalNews = 0
	$('.news-slide').each(function(i){
		$(this).width('');
		tmpW = Number($(this).find('.project-photo').attr('data-nat-width'));
		$(this).width(tmpW);
		totalNews += tmpW;
		if(i>0){totalNews += newsGap;}
	})
	$('.home-news-slides').width(totalNews);
}
setupNewsImg()

function updateNewsPos(){
	$('.news-slide').each(function(i){
		tmpL = $(this).position().left - $('.home-news-slides').position().left;
		$(this).attr({'data-num':(i+1), 'data-offset':tmpL});
	})
}
updateNewsPos();

$('.news-nav').find('.arr').click(function(){
	if($(this).hasClass('left')){
		dir = -1;
	} else {
		dir = 1;
	}
	changeNewsSlider(dir);
})


function changeNewsSlider(dir){

	// change active num, get new offset position
	curNews += dir;
	
	// reset for back loop
	if(curNews == 0){
		curNews = totNewsSlides;
		newPos =  -$('.news-slide[data-num="'+(curNews+1)+'"]').attr('data-offset');
		//console.log(curNews+' / '+newPos)
		TweenMax.set('.home-news-slides', {'transform':'translateX('+newPos+'px)'});
	}
	
	newsMoveAmt = -$('.news-slide[data-num="'+curNews+'"]').attr('data-offset');
	
	// slide over
	
	// reset for next loop
	if(curNews>totNewsSlides){
		TweenMax.to($('.home-news-slides'), .75, {x:newsMoveAmt, ease:Power4.easeInOut, onComplete:function(){
			TweenMax.set($('.home-news-slides'), {'transform':'translateX(0px)'});
		}});
	} else {
		TweenMax.to($('.home-news-slides'), .75, {x:newsMoveAmt, ease:Power4.easeInOut})
	}
	
	// change counter
	if(curNews>totNewsSlides){curNews = 1;}
	$('#home-news').find('.news-current').text('0'+curNews);
}

var newsMob = false;
function updateNewsMobile(){
	totalNews = 0;
	$('.news-slide').each(function(i){
		tmpW = winW - 60;
		$(this).width(tmpW);
		totalNews += tmpW;
		if(i>0){totalNews += newsGap;}
	})
	$('.home-news-slides').width(totalNews);
	updateNewsPos();
}





//! ANIMATE SCROLL TO SECTION

$('#hero').find('.arrow-next').click(function(){
	animScroll($('.base-projects-wrap'), .75, 250);
})

$('#dark-hero').find('.arrow-next').click(function(){
	if(winW>650){
		animScroll('.body-grid1', .75, 50);	
	} else {
		animScroll('.body-grid1', .75, 0);
	}
})

$('.people-nav, .people-sticky').find('a').click(function(){
	tmpsec = '#people-'+$(this).attr('href').split('#')[1];
	tmpoffset = $(tmpsec).attr('data-offset');
	
	// update offset with responsive
	if(winW<=1024 && winW>768){
		attr = $(tmpsec).attr('data-offset-tab');
		if(attr !== undefined && attr !== false){
			tmpoffset = $(tmpsec).attr('data-offset-tab');
		}
	} else if(winW<=768){
		attr = $(tmpsec).attr('data-offset-tabp');
		if(attr !== undefined && attr !== false){
			tmpoffset = $(tmpsec).attr('data-offset-tabp');
		}
	}
	
	animScroll($(tmpsec), .75, tmpoffset);
	
	// close sticky if open
	if(menuSticky){
		closeMenuSticky();
		$('.menu-sticky-btn').removeClass('on');
		menuSticky = false;
	}
	
	return false;
})




//! - GLOBAL: DROP MENUS

$('.drop-menu').mouseenter(function(){
	if(winW>1024){
		$(this).addClass('open');
		$(this).siblings('.drop-wrap').addClass('open');
		TweenMax.to($(this).siblings('.drop-wrap').find('.drop'), .5, {y:'0%', ease:Power3.easeInOut})
	}
})
$('.tier-title').mouseleave(function(){
	if(winW>1024){
		$(this).find('.drop-menu').removeClass('open');
		TweenMax.to($(this).find('.drop-wrap').find('.drop'), .5, {y:'-100%', ease:Power3.easeInOut, onCompleteParams:[$(this).find('.drop-wrap')], onComplete:function(t){
			t.removeClass('open');
		}})
	}
})

// for mobile
$('.drop-menu').click(function(){
	if(winW<=1024){
		if(!$(this).hasClass('open')){
			$(this).addClass('open');
			$(this).siblings('.drop-wrap').addClass('open');
			TweenMax.to($(this).siblings('.drop-wrap').find('.drop'), .5, {y:'0%', ease:Power3.easeInOut})
		} else {
			$(this).removeClass('open');
			TweenMax.to($(this).siblings('.drop-wrap').find('.drop'), .5, {y:'-100%', ease:Power3.easeInOut, onCompleteParams:[$(this).siblings('.drop-wrap')], onComplete:function(t){
			t.removeClass('open');
		}})
		}
		
	}
})


// project sector menu adjustment
totSecs = $('.sector-drop').find('li').length;
coltop = Math.ceil(totSecs/2)+1;
$('.sector-drop').find('li:nth-child('+coltop+')').addClass('col-first');






//! - PAGE: PROJECTS

$('.sidebar-detail-section header').click(function(){
	grp = $(this).parents('.sidebar-detail-section');
	
	// open
	if(!grp.hasClass('open')){		
		grp.addClass('open');
		
		// reveal text
		tmpH = grp.find('.txt>p').outerHeight();
		grp.find('.txt').height(0);
		TweenMax.to(grp.find('.txt'), .75, {height:tmpH, ease:Power3.easeInOut, onCompleteParams:[grp.find('.txt')], onComplete:function(t){
			t.css('height','auto');
		}})
		
		// expand header		
		TweenMax.to(grp.find('.detail-icon, .detail-title'), .75, {y:0, ease:Power3.easeInOut})
		
		// special for larger icons / add padding
		if(grp.hasClass('highlights') || grp.hasClass('sustain')){
			TweenMax.to(grp.find('header'), .75, {'paddingTop':'10px', height:100, ease:Power3.easeInOut})
		} else {
			TweenMax.to(grp.find('header'), .75, {height:90, ease:Power3.easeInOut})
		}
		
	// close	
	} else {		
		grp.removeClass('open');
		
		// hide text
		tmpH = grp.find('.txt>p').outerHeight();
		grp.find('.txt').height(tmpH);
		TweenMax.to(grp.find('.txt'), .75, {height:0, ease:Power3.easeInOut})
		
		// collapse header
		TweenMax.to(grp.find('header'), .75, {height:45, 'paddingTop':'0px', ease:Power3.easeInOut})
		TweenMax.to(grp.find('.detail-icon, .detail-title'), .75, {y:-45, ease:Power3.easeInOut})
	}
})

// auto start with first 2 open
$('.sidebar-detail-section').each(function(i){
	if(i<2){
		$(this).addClass('open');
		
		// reveal text
		$(this).find('.txt').height('auto');
		
		// expand header
		TweenMax.set($(this).find('header'), {height:90})
		TweenMax.set($(this).find('.detail-icon, .detail-title'), {y:0})
	}
})

// view more text expand

var readH = 295;

$('.project-details').find('.read-more').click(function(){
	//TweenMax.to(this, .3, {opacity:0})
	
	if(!$(this).hasClass('expanded')){
		
		tH = $('.project-txt').find('.inner').outerHeight();
		
		TweenMax.to($('.project-txt'), .75, {height:tH, ease:Power3.easeInOut, onCompleteParams:[$('.project-txt')], onComplete:function(t){
			t.css('height','auto');
		}});
		
		$('.project-details').find('.read-more').text('read less');
		$(this).addClass('expanded')
		
	} else {
		
		tH = $('.project-txt').find('.inner').outerHeight();
		$('.project-txt').height(tH);
		TweenMax.to($('.project-txt'), .75, {height:readH, ease:Power3.easeInOut})
		
		$('.project-details').find('.read-more').text('read more');
		$(this).removeClass('expanded')
	}
	
	return false;
})

// check if read more needed
if($('.project-txt').find('.inner').height() < readH){
	$('.project-details').find('.read-more').addClass('hide');
}





//! - PAGE: PEOPLE

$('.value-detail').height(0);
$('.value-block').click(function(){
	if(!$(this).hasClass('open')){
		resetBlocks($(this));
		$(this).addClass('open');
		tmpH = $(this).find('p').outerHeight();
		TweenMax.to($(this).find('.value-detail'), .5, {startAt:{height:0}, height:tmpH, ease:Expo.easeInOut, onCompleteParams:[$(this).find('.value-detail')], onComplete:function(t){
			t.css('height','');
		}})
	} else {
		$(this).removeClass('open')
		$(this).find('.value-detail').css({'height':$(this).find('p').outerHeight()})
		TweenMax.to($(this).find('.value-detail'), .5, {height:0, ease:Expo.easeInOut})
	}
})

function resetBlocks(obj){
	$('.value-block').each(function(){
		if($(this).hasClass('open') && $(this) != obj){
			$(this).removeClass('open');
			$(this).find('.value-detail').css({'height':$(this).find('p').outerHeight()})
			TweenMax.to($(this).find('.value-detail'), .5, {height:0, ease:Expo.easeInOut})
		}
	})
}

// check subnav on scroll
var curTitle = 'profile';
function updatePeopleNav(){	
	$('.people-section').each(function(){
		if(isScrolledIntoView($(this), winH-100)){
			resetPeopleNav($(this).find('h2').text());
		}
	})
}
function resetPeopleNav(title){
	if(title != curTitle){
		$('.menu-sticky-btn').find('h4').text(title);
		curTitle = title;
	}
}

// view more awards expand
$('#people-awards').find('.view-more').click(function(){
	//TweenMax.to('.view-more', .3, {opacity:0})
	
	if(!$(this).hasClass('expanded')){
	
		awH = $('.awards-wrap').outerHeight();
		$('.awards-wrap').height(awH);
		
		$('.awards-wrap').find('.hidden, .mob-hidden').css({'display':'block','opacity':0})
		awH2 = $('.awards-wrap').find('.inner').outerHeight()+50;
		
		TweenMax.to($('.awards-wrap'), .75, {height:awH2, ease:Power3.easeInOut, onComplete:function(){
			$('.awards-wrap').css('height','auto');
		}});
		TweenMax.to($('.awards-wrap').find('.hidden, .mob-hidden'), .5, {opacity:1})
	
		$('#people-awards').find('.view-more').text('view less');
		$(this).addClass('expanded')
		
	} else {
			
		awH = $('.awards-wrap').outerHeight();
		$('.awards-wrap').height(awH);
		
		$('.awards-wrap').find('.hidden').css({'display':'none','opacity':1})
		if(winW<=550){$('.awards-wrap').find('.mob-hidden').css({'display':'none','opacity':1})}
		
		awH2 = $('.awards-wrap').find('.inner').outerHeight()+50;
		
		$('.awards-wrap').find('.hidden').css({'display':'block'})
		if(winW<=550){$('.awards-wrap').find('.mob-hidden').css({'display':'block'})}
				
		TweenMax.to($('.awards-wrap'), .75, {height:awH2, ease:Power3.easeInOut});
		
		TweenMax.to($('.awards-wrap').find('.hidden'), .5, {'display':'none', opacity:0})
		if(winW<=550){TweenMax.to($('.awards-wrap').find('.mob-hidden'), .5, {'display':'none', opacity:0})}
	
		$(this).removeClass('expanded')
		$('#people-awards').find('.view-more').text('view more');
		
	}
	
	return false;
})





//! - PAGE: SERVICES

// view more services expand
$('#service-includes').find('.view-more').click(function(){
	TweenMax.to('.view-more', .3, {opacity:0})
	
	srvH = $('.includes-list.mob').outerHeight();
	$('.includes-list').height(srvH);
	
	$('.includes-list.mob').find('.hidden').addClass('shown');
	srvH2 = $('.includes-list.mob').find('.inner').outerHeight();
	
	TweenMax.to($('.includes-list.mob'), .75, {height:srvH2, ease:Power3.easeInOut});
	TweenMax.to($('.includes-list.mob').find('.hidden'), .5, {opacity:1})
	
	return false;
})

// turn on videos if any
$(window).on('load', function(){
	$('.hasVideo').each(function(){
		tmpid = $(this).find('video').attr('id');
		tmpvid = document.getElementById(tmpid);
		tmpvid.play();
	})		
})





//! - OVERLAY: TEAM

$('.team-photo').click(function(){
	tmpid = $(this).attr('data-id');
	$('.team-overlay-part[data-id="'+tmpid+'"]').addClass('on');
	
	$('#overlay-team').addClass('on');
	updateTeamOverlay();
	
	TweenMax.set($('#overlay-team').find('.overlayWrap'), {x:'100%'})
	TweenMax.set($('#overlay-team').find('.contentContainer'), {x:'50%'})
	TweenMax.to($('#overlay-team').find('.overlayWrap'), .75, {x:'0%', ease:Power3.easeInOut})
	TweenMax.to($('#overlay-team').find('.contentContainer'), .75, {delay:.4, x:'0%', ease:Expo.easeOut, onComplete:function(){
		freezePage();
	}})
})

$('#overlay-team .close-btn').click(function(){
	TweenMax.to($('#overlay-team').find('.contentContainer'), .6, {x:'100%', ease:Power3.easeIn})
	TweenMax.to($('#overlay-team').find('.overlayWrap'), .6, {delay:.3, x:'100%', ease:Power3.easeInOut, onComplete:function(){
		$('.team-overlay-part').removeClass('on');
		$('#overlay-team').removeClass('on');
		unfreezePage();
	}})
})

function updateTeamOverlay(){
	tmpH = $('#overlay-team').find('.contentContainer').outerHeight();
	$('#overlay-team').find('.bgpatterns').height(tmpH);
}





//! - PAGE: NEWS

var searchOpen = false;

$('.icon-search').click(function(){
	openSearch();
	searchOpen = true;
})
$('.news-search .close-btn').click(function(){
	closeSearch();
	searchOpen = false;
})

function openSearch(){
	$('#searchinput').val('');
	$('.news-search, .search-wrap').addClass('open');
	TweenMax.to($('.news-search').find('.search-drop'), .5, {y:'0%', ease:Power3.easeInOut, onComplete:function(){setSearchListener();}})
}
function closeSearch(){
	$('.news-search').removeClass('open');
	$('.search-auto').removeClass('on');
	TweenMax.to($('.news-search').find('.search-drop'), .5, {y:'-100%', ease:Power3.easeInOut, onComplete:function(){
		$('.search-wrap').removeClass('open');
	}})
}

function setSearchListener(){	
	$(document).click(function(){
		closeSearch();
		searchOpen = false;
		$(document).unbind('click');
	})
	$('#globalHeader').find('.search-wrap').click(function(e){
		e.stopPropagation();
	})
}

// auto populate with titles on search

var tmpS = '';
var tmpM = '';
var tmpSLen = 0;
var auto_matches = '';

$('#searchinput').bind('input', function(){
	
	// get current search text
	tmpS = $('#searchinput').val();
	tmpSLen = tmpS.length;
	auto_matches = '';
	matchNum = 0;
	
	// check for match among titles
	if(tmpSLen > 0){
		for(i=0;i<news_titles.length;i++){
			
			// search for match
			tmpM = news_titles[i].substr(0, tmpSLen);
			if(tmpS.toLowerCase() == tmpM.toLowerCase()){
				if(matchNum<5){
					auto_matches += '<li><a href="' + news_urls[i] + '">' + news_titles[i] + '</a></li>';
					matchNum++;
				}
			}
		}
	}
	
	// if match found
	if(matchNum > 0){
		$('.search-auto').addClass('on');
		
		// show matches
		$('.search-auto').find('ul').html(auto_matches);
	} else {
		$('.search-auto').removeClass('on');
		
		// remove matches
		$('.search-auto').find('ul').html('');
	}

});





// view more news expand

$('#base-news').find('.load-more').click(function(){
	// set starting height
	prH = $('.news-list-wrap').outerHeight();
	$('.news-list-wrap').height(prH);
	
	// determine if more news to load
	newsSet = false;
	$('.news-group').each(function(){
		if($(this).hasClass('news-hidden') && !newsSet){
			newsNext = $(this);
			$(this).removeClass('news-hidden').addClass('news-shown');
			newsSet = true;
		}
	})
	
	// remove if no more
	if($('.news-hidden').length == 0){
		TweenMax.to('.load-more', .3, {opacity:0, 'display':'none'})
	}	
	
	prH2 = prH + newsNext.outerHeight();
	
	TweenMax.to($('.news-list-wrap'), .75, {height:prH2, ease:Power3.easeInOut, onComplete:function(){
		$('.news-list-wrap').css('height','auto');
	}});
	
	TweenMax.to(newsNext, .5, {opacity:1})
	
	return false;
})

$('#base-news, #home-news, #article-next, #base-projects').find('.project-photo').click(function(){
	window.location.href = $(this).attr('data-url');
})
$



//! - GLOBAL: TIER OPENER

tierBLX = -285;
tierBRX = 135;
tierBSt = 12;
var txtHBase = 150;
var darkHeroOn = false;

if(winW<=768){
	tierBSt = 8;
}

if($('body').attr('id') == 'page-services'){
	tierBLY = 198;
	tierBRY = -210;
	
	if(winW<=768){
		tierBLX = -165;
		tierBLY = 150;
		tierBRX = 135;
		tierBRY = -180;
	}
	
	if(winW<=550){
		tierBLX = -150;
		tierBLY = 125;
		
		tierBRX = 115;
		tierBRY = -185;
		
		// check if additional spacing needed		
		txtH = $('.hero-txt').find('h1').height()+$('.hero-txt').find('p').height();
		if(txtH > txtHBase){
			tierBLY = 125 + (txtH - txtHBase);
		}
	}
	
} else if($('body').attr('id') == 'page-people'){
	tierBLY = 160;
	tierBRY = -158;
	
	if(winW<=768){
		tierBLX = -165;
		tierBLY = 110;
		tierBRX = 115;
		tierBRY = -140;
	}
	
	if(winW<=550){
		tierBLX = -150;
		tierBLY = 125;
		
		tierBRX = 115;
		tierBRY = -125;
	}
}

function openDarkHero(){
	TweenMax.set($('#dark-hero').find('.bracket.left'), {x:0, y:tierBSt, opacity:.1})
	TweenMax.set($('#dark-hero').find('.bracket.right'), {x:0, y:-tierBSt, opacity:.1})
		
	// open brackets
	TweenMax.to($('#dark-hero').find('.bracket.left'), 1, {delay:.1, x:tierBLX, y:tierBLY, opacity:1, ease:Power3.easeInOut})
	TweenMax.to($('#dark-hero').find('.bracket.right'), 1, {delay:.1, x:tierBRX, y:tierBRY, opacity:1, ease:Power3.easeInOut, onComplete:function(){
		darkHeroOn = true;
	}})
	
	// fade word
	TweenMax.set($('#dark-hero').find('.txt'), {opacity:0})	
	TweenMax.to($('#dark-hero').find('.txt'), 1, {delay:.35, opacity:1, ease:Power3.easeInOut})
	
	// drop arrow
	TweenMax.set($('#dark-hero').find('.arrow-next'), {opacity:0, y:-20})	
	TweenMax.to($('#dark-hero').find('.arrow-next'), .5, {delay:1, y:0, opacity:1, ease:Power3.easeInOut})
}

function updateDarkHero(){
	if($('body').attr('id') == 'page-services'){
		tierBLX = -285;
		tierBRX = 135;
		tierBLY = 198;
		tierBRY = -210;
		
		if(winW<=768){
			tierBLX = -165;
			tierBLY = 150;
			tierBRX = 135;
			tierBRY = -180;
		}
		
		if(winW<=550){
			tierBLX = -150;
			tierBLY = 125;
			
			tierBRX = 115;
			tierBRY = -185;
			
			// check if additional spacing needed		
			txtH = $('.hero-txt').find('h1').height()+$('.hero-txt').find('p').height();
			if(txtH > txtHBase){
				tierBLY = 125 + (txtH - txtHBase);
			}
		}
	}
	
	if($('body').attr('id') == 'page-people'){
		tierBLX = -285;
		tierBRX = 135;
		tierBLY = 160;
		tierBRY = -158;
		
		if(winW<=768){
			tierBLX = -165;
			tierBLY = 110;
			tierBRX = 115;
			tierBRY = -140;
		}
		
		if(winW<=550){
			tierBLX = -150;
			tierBLY = 125;
			
			tierBRX = 115;
			tierBRY = -125;
		}
	}
	
	TweenMax.set($('#dark-hero').find('.bracket.left'), {x:tierBLX, y:tierBLY})
	TweenMax.set($('#dark-hero').find('.bracket.right'), {x:tierBRX, y:tierBRY})
}





//! GOOGLE MAP API
	
function initMap() {
	var wscumby = {lat:39.91326, lng: -75.34042};
	var map = new google.maps.Map(document.getElementById('map'), {
	  zoom: 15,
	  center: wscumby,
	  disableDefaultUI: true,
	  zoomControl: true,
	  styles: [{"featureType":"all","elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]}]
	});
	
	var marker = new google.maps.Marker({
	    position: wscumby,
	    map: map,
		 icon: new google.maps.MarkerImage(path+'images/map-pin.svg',
		 null, null, null, new google.maps.Size(75,85)),
	    zIndex: 9999
	});
	
	google.maps.event.addDomListener(window, 'resize', function() {
    	var center = map.getCenter()
		google.maps.event.trigger(map, "resize")
		map.setCenter(center)
	})
}





//! SPECIAL FIXES

if(is_firefox){
	$('body').addClass('ff');
}






