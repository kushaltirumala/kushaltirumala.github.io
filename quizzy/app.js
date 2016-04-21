$(function(){

$("#userInfoButton").click(function(){
	submitUserInfo();
});

if(window.location.href.indexOf("code")!=-1){
	continueQuizletAuth();
}

	function continueQuizletAuth() {
		var currentURL = window.location.href;
		var code = currentURL.substring(currentURL.indexOf("code="));
		console.log(code);
	}

	function submitUserInfo() {
		var username = $("#username").val();
		var pass = $("#password").val();
		if(username==null || pass == null){
			alert("Please enter full Quizlet credentials, otherwise we cannot make a set for you :(");
		} else {
			quizletAuth(username, pass);
		}
	}


	function quizletAuth(username, pass) {
		var str = makeid();
		var redirectURI = "https://quizlet.com/authorize?response_type=code&client_id=4msU8P4c2B&scope=write_set&state="+str;		
		var currentURL = window.location.href;
		console.log(currentURL.indexOf("code"));
		window.open(redirectURI,'auth time');
	}


	function waitForUrlToChangeTo(urlRegex) {
		    var currentUrl;

		    return browser.getCurrentUrl().then(function storeCurrentUrl(url) {
		            currentUrl = url;
		        }
		    ).then(function waitForUrlToChangeTo() {
		            return browser.wait(function waitForUrlToChangeTo() {
		                return browser.getCurrentUrl().then(function compareCurrentUrl(url) {
		                    return urlRegex.test(url);
		                });
		            });
		        }
		    );
		}

	function makeid()
		{
		    var text = "";
		    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		    for(var i=0; i < 5; i++)
		        text += possible.charAt(Math.floor(Math.random()*possible.length));

		    return text;
		}

});