

var express = require('express');
var fs = require('fs');
var app = express();
var Firebase = require("firebase");
var ref = new Firebase("https://chooseyourstyle.firebaseio.com/");

//var session = require('express-session');

//var bodyParser=require("body-parser");
//app.use(bodyParser.json());
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(express.static(__dirname+'/facebook'));
app.use(express.static(__dirname+'/registrazione'));
app.use(express.static('facebook'));


//prova GET


/*function parseUrl(url){
  console.log("RE check :"+url+"...");
  var pattern = new RegExp('([0-9]{12}){1}');
  var id = url.match(pattern);
  if(id==null || id.length==0){
    return null;
  }
  console.log("id: "+id[0]);
  if(id.length>1) return id[0];
  return id;
}*/




/*app.get('/', function(req, res) {
           /*fs.readFile(__dirname + '/paginainiziale.html', 'utf8', function(err, text){
                res.send(text);
            });
            console.log('pagina mandata');        
	
		res.redirect("/paginainiziale");
		});
*/		



app.get('/', function(request,response){ //carica la pagina
	//response.writeHead(200, {"Content-type": "text/html"});
	console.log("main request get");
  response.redirect('/paginainiziale');
});

app.get("/paginainiziale",function(req,res){
	res.writeHead(500, {"Content-type": "text/html"});
	console.log("get pagina iniziale");
	fs.createReadStream("./paginainiziale.html").pipe(res);
	});

app.get("/registrati",function(req,res){
	res.writeHead(500, {"Content-type": "text/html"});
	console.log("get pagina registrazione");
	fs.createReadStream("./registrati.html").pipe(res);
	});
	
	
app.get("/outfit",function(req,res){
	res.writeHead(500, {"Content-type": "text/html"});
	console.log("get pagina HOME");
	fs.createReadStream("./outfit.html").pipe(res);
});
	
app.get("/inseriscilink",function(req,res){
	res.writeHead(500, {"Content-type": "text/html"});
	console.log("get pagina HOME");
	fs.createReadStream("./inseriscilink.html").pipe(res);
});

/*app.get('/', function(req, res) {
            console.log('req'); 
          response.redirect('/paginainiziale'); 
                  
		});*/
		
/*var addUser = function(ref,data,callback){
    ref.child("users").child(data.body.psw1).set({
				email: data.body.email,
				 fb: data.body.fb
				}
	  ,function(){
      callback();
      });
    };*/




app.post("/paginainiziale",function(req,res){
	console.log("post su pagina iniziale ricevuta");
	console.log('fb: ' + req.body.fb);
	console.log('email:'+req.body.email);
	
		if(req.body.fb!='Y'){
			res.redirect('/outfit');
		}
});

app.post('/registrati',function(req,res){
	console.log('post su registrazione fatta');
	console.log('email:'+req.body.email);
	res.redirect('/');
	
});
		
app.listen(8080);
console.log("server lanciato sulla porta 8080");
