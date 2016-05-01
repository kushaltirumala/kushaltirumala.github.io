$(function(){


var textFill = "";
$("#recognizeButton").click(function(){
	var canvas = document.getElementById('canvas2');
	analyze(canvas);
});

$("#userInfoButton").click(function(){
	submitUserInfo();
});

$("#startcropping").click(function(){
	alert('pressed');
		var canvas = document.getElementById('canvas2');
		$('#canvas2').Jcrop({
                    onSelect: updatePreview,
                    allowSelect: true,
                    allowMove: true,
                    allowResize: true,
                    aspectRatio: 0,
                    boxWidth: canvas.width, 
                    boxHeight: canvas.height
                });
});

$("#cropimage").click(function(){
	cropImageToSend();
});

$("#newset").click(function(){
	createSet();
});

function cropImageToSend() {
	var canvas=document.getElementById("viewport");
	analyze(canvas, function(terms, definitions){
		postSet(terms, definitions);
	});
}

function updatePreview(c) {
    if (parseInt(c.w) > 0) {
        var imageObj = $("#canvas2")[0];
        var canvas = document.getElementById("viewport");
        var context = canvas.getContext("2d");
        if (imageObj != null && c.x != 0 && c.y != 0 && c.w != 0 && c.h != 0) {
            context.drawImage(imageObj, c.x, c.y, c.w, c.h, 0, 0, canvas.width, canvas.height);
        }
    }
}


document.getElementById('files').addEventListener('change', handleFileSelect, false);

var accessToken;

if(window.location.href.indexOf("code")!=-1){
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

        var canvas2 = document.getElementById("canvas2");

        canvas2.width = lastPhoto.width;

        canvas2.height = lastPhoto.height;

        var canvasbanana = canvas2.getContext("2d");

        var img = new Image();
        img.src = lastPhoto;
        img.onload = function() {
        	canvas2.width = img.width;
        	canvas2.height = img.height;
            canvasbanana.drawImage(img, 0,0);
        }
        console.log(img.width + " " + img.height);

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
                console.log(msg.access);
            },
            error:function(error){
            	//alert('error');
            	console.log(error);
            }
    	});

	}

	function postSet(terms, definitions) {
		var title  = "newset";
	  		var body = {
	  			'terms':terms,
	  			'definitions':definitions
	  		}
	    	$.ajax({
	    		type:"POST",
	    		url:"http://localhost:3000/newSet?title="+title,
	    		contentType: "application/json",
	    		processData: false,
	    		dataType: "json",
	    		data:JSON.stringify(body),
	    		success:function(msg){
	    			var x = window.confirm("Would you like to go to your set?");
			          if(x){
				          window.open("http://quizlet.com");
			          } 
	    		},
	    		error:function(error){
	    			alert("error with creating a new set");
	    		}
	    	});
	}

	function createSet() {
		var canvas = document.getElementById('canvas2');
		analyze(canvas, function(terms, definitions) { 
			postSet(terms, definitions);
    	})
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

		// function handleOxford(data) {
		// 	var lineText = "";
  //         var ter = [];
  //         var de = [];
  //           if (data.regions != null) {
  //           	console.log(data.regions.length);
  //               for (var i = 0; i < data.regions.length; i++) {
                	
  //                   label1: for (var j = 0; j < data.regions[i].lines.length; j++) {
  //                        for (var k = 0; k < data.regions[i].lines[j].words.length; k++) {
  //                       	if((data.regions[i].lines[j].words[k].text.substring(0,7)== "EPISODE")){
		// 						continue label1;
  //                       	}
  //                           lineText += data.regions[i].lines[j].words[k].text + " ";   
  //                       }
  //                       if(i==1){
  //                       ter.push(lineText);
  //                       }
  //                       else if(i==2){
  //                       	de.push(lineText);
  //                       	console.log(lineText);
  //                       }
  //                       lineText = "";
  //                   }
  //               }
  //               console.log(ter);
  //               console.log(de);
  //           }
  //           else {
  //               console.log('empty');
  //       }

		// }
		function giveUpperBounds(bounds){
			return parseInt(bounds[0]) + parseInt(bounds[2]);
		}

		function analyze(canvas, handleData) {

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
            data:blob
        })
        .done(function(data) {
        	console.log(JSON.stringify(data));
          var lineText = "";
          var ter = [];
          var de = [];
            if (data.regions != null) {
            	console.log(data.regions.length);
            	var bounds = data.regions[0].boundingBox.split(',');
            	var upperbound = giveUpperBounds(bounds);
            	console.log(upperbound);
            	for(var i = 0; i < data.regions.length; i++){
            		for(var j = 0; j < data.regions[i].lines.length; i++){
            			for(var k = 0; k <  data.regions[i].lines[j].words.length) {
            				var boundstemp = data.regions[0].boundingBox.split(',');
            				var upperboundstemp = giveUpperBounds(boundstemp);
            				if(upperboundstemp < upperbound)
            					ter.push(data.regions[i].lines[j].words[k].text);
            				else
            					de.push(data.regions[i].lines[j].words[k].text);
            			}
            		}
            	}

            	if (ter.length > de.length)
            		ter.splice(0, de.length);
            	else if (de.length > ter.length)
            		de.split(0, ter.length);


                console.log(ter);
                console.log(de);
              	handleData(ter,de); 
            }
            else {
                console.log('empty');
        }
        })
        .fail(function(err) {
            console.log(JSON.stringify(err));
        });
    }
});
