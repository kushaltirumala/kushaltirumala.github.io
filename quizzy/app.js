$(function(){


var textFill = "";
$("#recognizeButton").click(function(){
		alert('pressed');
		var canvas = document.getElementById('canvas2');
    	analyze(canvas);
});

$("#userInfoButton").click(function(){
	submitUserInfo();
});

$("#newset").click(function(){
	createSet();
});


document.getElementById('files').addEventListener('change', handleFileSelect, false);

var accessToken;

if(window.location.href.indexOf("code")!=-1){
	createPostReqForSet();
}
var terms = [];
var def = [];
function dispTerms(text){
	
		 $('#confirmed').html(text);
	         var words = $("#confirmed").text().split(" ");
	         $("#confirmed").empty();
	         $.each(words, function(i, v) {
	            $("#confirmed").append($("<div class='noob'>").text(v));
	         });
	          $('#confirmed').click(function(){ 
	         if (window.getSelection) { /* Firefox, Opera, Google Chrome and Safari */
				var new_elem = document.createElement('strong'); 
				             new_elem.setAttribute("class","highlighted");
				var sel = window.getSelection ();
				sel.modify('move','backward','word');
				sel.modify('extend','forward','word');
				var range = document.createRange();
				range = sel.getRangeAt(0); 
				txt = document.createTextNode(range.toString()); 
				new_elem.appendChild(txt); 
				range.deleteContents(); 
				range.insertNode(new_elem); 
				sel.removeAllRanges();
				}  
	    	})
	}
   	var sustring = "";
	var indecies = [];
	$('#clear').click(function(){
		terms = [];
		def= [];
	})
	$('#analyze').click(function(){
	         indecies = [];
	            $(".noob").each(function(i, obj){
	                if(obj.children.length > 0){
	         terms.push(obj.firstElementChild.innerHTML);
	                    indecies.push(i);
	                    }
	     })
	        indecies.push($('.noob').size());
	        console.log($('.noob').size())
	        var j = 0;
	        var d = 0;
	        while(j<indecies.length-1){
	            d= indecies[j];
	        while(d<indecies[j+1]-1){
	         sustring += " ";
	            sustring += $(".noob").eq(d+1).text();
	        	d++;
	        }
	        def.push(sustring);
	            sustring = "";
	        j++;
	        }
		createPostReqForSet();   
	    })

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

  		$.ajax({
            type:"GET",
            url: "http://localhost:3000/quizlet?code="+code,
            success: function(msg) {
            	alert('success');
            	console.log(msg);
                console.log(msg.daisytodd);
            },
            error:function(error){
            	alert('error');
            	console.log(error);
            }
    	});

	}

	function createSet() {
		var title  = "newset";
  		var body = {
  			'terms':['blair', 'alex', 'french'],
  			'definitions':['blairiscool', 'alexiscool', 'frenchiscool']
  		}
    	$.ajax({
    		type:"POST",
    		url:"http://localhost:3000/newSet?title="+title,
    		contentType: "application/json",
    		processData: false,
    		dataType: "json",
    		data:JSON.stringify(body),
    		success:function(msg){
    			console.log(msg);
    		},
    		error:function(error){
    			alert("error with creating a new set");
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
			quizletAuth();
		
	}


	function quizletAuth() {
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

		function dataURItoBlob(dataURI) {
		    var binary = atob(dataURI.split(',')[1]);
		    var array = [];
		    for(var i = 0; i < binary.length; i++) {
		        array.push(binary.charCodeAt(i));
		    }
		    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
		}

		function analyze(canvas) {

//if we wanna ever use tesseract, which I don't really see why to
			 //         Tesseract.recognize(canvas, {progress: showProgress, lang: 'eng'}).then(function (d) {
				// textFill = (d.text).replace(/(\r\n|\n|\r)/gm," ");
				// console.log(textFill);
				// dispTerms(textFill);
    //         }, function (err) {
    //             console.log(err);
    //         });

     var imageData = canvas.toDataURL();
     var blob = dataURItoBlob(imageData);
     console.log(imageData);
     console.log(blob);
     var fd = new FormData(document.forms[0]);
     fd.append("canvasImage", blob);
     //imageData = imageData.replace(/^data:image\/(png|jpg);base64,/, "");
     var params = {
            "language": "en",
            "detectOrientation ": "true",
        }; 
        $.ajax({
            url: "https://api.projectoxford.ai/vision/v1/ocr?" + $.param(params),
            beforeSend: function(req){
                req.setRequestHeader("Content-Type","application/octet-stream");
                req.setRequestHeader("Ocp-Apim-Subscription-Key","900313fb426048dc9369d4661f07ee66");
            },
            processData: false,
            type: "POST",
            data:fd,
            success:function(msg){
    			console.log(msg);
    		},
    		error:function(error){
    			alert(error);
    		}
        })
    }
});
