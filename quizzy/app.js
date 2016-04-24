$(function(){


$("#recognizeButton").click(function(){
		alert('pressed');
		var canvas = document.getElementById('canvas2');
            Tesseract.recognize(canvas, {progress: showProgress, lang: 'eng'}).then(function (d) {
                console.log(d.text);
            }, function (err) {
                console.log(err);
            });
});

$("#userInfoButton").click(function(){
	submitUserInfo();
});


document.getElementById('files').addEventListener('change', handleFileSelect, false);

var accessToken;

if(window.location.href.indexOf("code")!=-1){
	createPostReqForSet();
}
var terms = [];
var def = [];

function separateText(text) {
	//this function could be where we do the seperating for temp purposes
	var wordHeap = text.seperate(" ");
	for(var i = 0; i < wordHeap,length; i+=2) {
		terms.push(wordHeap[i]);
	}
	for(var i = 1; i < wordHeap.length; i+=2){
		def.push(wordHeap[i]);
	}

	createPostReqForSet();

}

function createPostReqForSet() {
		continueQuizletAuth();
}

function handleFileSelect(evt) {
	//alert('hell yeah');
    var files = evt.target.files; 

    for (var i = 0, f; f = files[i]; i++) {

      if (!f.type.match('image.*')) {
        continue;
      }

      var reader = new FileReader();

      reader.onload = (function(theFile) {
        return function(e) {
           convertToCanvas(e.target.result);
        };
      })(f);

      reader.readAsDataURL(f);
    }
  }

function showProgress(p) {
	console.log(p);
}
  function convertToCanvas (lastPhoto) {

  		//console.log("link: " + lastPhoto);
        var canvas2 = document.getElementById("canvas2");

        canvas2.width = lastPhoto.width;

        canvas2.height = lastPhoto.height;

        var canvasbanana = canvas2.getContext("2d");

        var img = new Image();
        img.src = lastPhoto;
        img.width = "1000";
        img.height="1000";
        canvas2.width = img.width;
        canvas2.height = img.height;
        console.log(img.width + " " + img.height);
        img.onload = function() {
            canvasbanana.drawImage(img, 0,0);
        }

        return canvasbanana;
    }

	function continueQuizletAuth() {
		var currentURL = window.location.href;
		var code = currentURL.substring(currentURL.indexOf("code=")+5);

		//alert('about to post req');
		var url ="https://api.quizlet.com/oauth/token?grant_type=authorization_code&code="+code+"&redirect_uri=http://kushaltirumala.github.io/quizzy/index.html";
		 $.ajax({
            type:"POST",
            beforeSend: function (request)
            {
                request.setRequestHeader("Authorization", "Basic NG1zVThQNGMyQjpjbVRYeXB1N1FZcFUzN2NTYnp1ejJI");
                //request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            },
            url: url,
            success: function(msg) {
                console.log(msg);
            },
            error:function(error){
            	console.log(error);
            }
    });

	}

	function form2Json(str)
	{
	    var obj,i,pt,keys,j,ev;
	    if (typeof form2Json.br !== 'function')
	    {
	        form2Json.br = function(repl)
	        {
	            if (repl.indexOf(']') !== -1)
	            {
	                return repl.replace(/\](.+?)(,|$)/g,function($1,$2,$3)
	                {
	                    return form2Json.br($2+'}'+$3);
	                });
	            }
	            return repl;
	        };
	    }
	    str = '{"'+(str.indexOf('%') !== -1 ? decodeURI(str) : str)+'"}';
	    obj = str.replace(/\=/g,'":"').replace(/&/g,'","').replace(/\[/g,'":{"');
	    obj = JSON.parse(obj.replace(/\](.+?)(,|$)/g,function($1,$2,$3){ return form2Json.br($2+'}'+$3);}));
	    pt = ('&'+str).replace(/(\[|\]|\=)/g,'"$1"').replace(/\]"+/g,']').replace(/&([^\[\=]+?)(\[|\=)/g,'"&["$1]$2');
	    pt = (pt + '"').replace(/^"&/,'').split('&');
	    for (i=0;i<pt.length;i++)
	    {
	        ev = obj;
	        keys = pt[i].match(/(?!:(\["))([^"]+?)(?=("\]))/g);
	        for (j=0;j<keys.length;j++)
	        {
	            if (!ev.hasOwnProperty(keys[j]))
	            {
	                if (keys.length > (j + 1))
	                {
	                    ev[keys[j]] = {};
	                }
	                else
	                {
	                    ev[keys[j]] = pt[i].split('=')[1].replace(/"/g,'');
	                    break;
	                }
	            }
	            ev = ev[keys[j]];
	        }
	    }
	    return obj;
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