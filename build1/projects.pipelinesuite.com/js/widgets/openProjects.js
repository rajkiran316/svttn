var fx;
;(function(){
	function ge(a){return document.getElementById(a);}
	function wr(a,b){var el = ge(a); el.innerHTML=b;}
	function o(a){document.write(a);}
	
	var pipelineSuiteOptions={};
	var pipelineSuite_super_embed = window.pipelinesuite_super_embed = {
		init: function(){			
			pipelineSuiteOptions.id = window.pipelineSuite_open_projects_ID;
			pipelineSuiteOptions.secret = window.pipelineSuite_open_projects_PrivateKey;
			pipelineSuiteOptions.background = window.pipelineSuite_open_projects_Background;
			pipelineSuiteOptions.panelBackground = window.pipelineSuite_open_projects_PanelBackground;
			pipelineSuiteOptions.header = window.pipelineSuite_open_projects_Header;
			pipelineSuiteOptions.headerText = window.pipelineSuite_open_projects_HeaderText;
			pipelineSuiteOptions.border = window.pipelineSuite_open_projects_Border;
			pipelineSuiteOptions.text = window.pipelineSuite_open_projects_Text;
			pipelineSuiteOptions.width = (window.pipelineSuite_open_projects_Width=='0px') ? "auto" : window.pipelineSuite_open_projects_Width;
			pipelineSuiteOptions.height = (window.pipelineSuite_open_projects_Height=='0px') ? "auto" : window.pipelineSuite_open_projects_Height;
			o("<div id=\""+pipelineSuiteOptions.id+"\" style=\"width:"+pipelineSuiteOptions.width+";height:"+pipelineSuiteOptions.height+"\"></div>");
			pipelineSuite_super_embed.load_jQuery();
		},
		load_jQuery:function(){
			if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.6.1') {
				s = document.createElement("script");
				s.setAttribute("type", "text/javascript");
				s.setAttribute("src", (("https:" == document.location.protocol) ? "https://" : "http://") + "projects.pipelinesuite.com/js/jquery-1.6.1.min.js");
				
				if (s.readyState) {
					s.onreadystatechange = function () { // For old versions of IE
				  		if (this.readyState == 'complete' || this.readyState == 'loaded') {
				      		pipelineSuite_super_embed.init_jQuery();
				  		}
					};
				} else { // Other browsers
					s.onload = pipelineSuite_super_embed.init_jQuery;
				}
				// Try to find the head, otherwise default to the documentElement
				(document.getElementsByTagName("head")[0] || document.documentElement).appendChild(s);
				
			}else{
				fx = window.jQuery;
				pipelineSuite_super_embed.buildForm();
			}
		},
		init_jQuery:function(){
			fx = window.jQuery.noConflict(true);
			pipelineSuite_super_embed.buildForm();
		},
		buildForm: function(){
			fx(function($){
				var iframe = $("<iframe frameborder='0' width='100%' height='100%' onload='pipelineSuiteFrameCheck()' class='pipelineSuiteIFrame' />").attr("src","" + (("https:" == document.location.protocol) ? "https://" : "http://") + "projects.pipelinesuite.com/ehProjects/dspOpenProjects/id/"+pipelineSuiteOptions.id+"/s/"+pipelineSuiteOptions.secret+"/bg/"+pipelineSuiteOptions.background+"/pb/"+pipelineSuiteOptions.panelBackground+"/h/"+pipelineSuiteOptions.header+"/ht/"+pipelineSuiteOptions.headerText+"/b/"+pipelineSuiteOptions.border+"/t/"+pipelineSuiteOptions.text);
				$("#"+pipelineSuiteOptions.id).append(iframe);
			});
		},
		positionCheck: function(iframe){
			console.log(iframe);
		}
	};
	pipelineSuite_super_embed.init();
})();

var pipelineSuiteIframeLoadCount = 0;
function pipelineSuiteFrameCheck(){
	if(pipelineSuiteIframeLoadCount>0){
		window.scrollTo(0,0);	
	}else{
		pipelineSuiteIframeLoadCount++;	
	}
}
