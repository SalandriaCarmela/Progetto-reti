

var express = require('express');
var fs = require('fs');
var app = express();
var ebay = require('ebay-api/index.js');
var MongoClient = require('mongodb').MongoClient;
var url_mongo='mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var assert=require('assert');
//var session = require('express-session');
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(express.static(__dirname+'/facebook'));
app.use(express.static(__dirname+'/registrazione'));
app.use(express.static('facebook'));
app.set('views', __dirname);


/*function is_present(req,url_mongo,item,db,callback){
  
  var cursor=db.collection('Users').find({
    email:ses.email,
    products:{
      "$elemMatch":{
        "itemId": item.Item.ItemID
      }
    }
  });
  cursor.limit(1).each(function(err,doc){
    assert.equal(null,err);
    if(doc!=null){
      callback(1);
    }
    else {
      callback(0);
    }
  });
}*/
//prova GET

function insert_element(url_mongo,item,req){
	MongoClient.connect(url_mongo, function(err, db) {
    console.log(req.body.email);
  //  var present;
    //var user=req.body.email;
   //is_present(req,url_mongo,item,db,function(present){
     // if(present==0){
        db.collection('Users',function(err,collection){
          if(err) throw err;
          var user=req.body.email;
          //if(req.body.email==null) user= ses.email;
          //else user=req.body.email.replace(/%[0-9]{2}/g,'@');
          //console.log("user: " + user);*/
          collection.update({"email": user },{$push: {
            outfits: {
              "name": item.Item.Title,
              "itemId": item.Item.ItemID,
              "img": item.Item.PictureURL,
              "link": req.body.url,
            }
          }
        });

      });
      });
  }
     // else {
      //  db.close();
     // }
    //});
  //});
//}


function parseUrl(url){
  console.log("RE check :"+url+"...");
  var pattern = new RegExp('([0-9]{12}){1}');
  var id = url.match(pattern);
  if(id==null || id.length==0){
    return null;
  }
  console.log("id: "+id[0]);
  if(id.length>1) return id[0];
  return id;
}

//INSERISCI GLI UTENTI
var addUser = function(db,data,callback){
	db.collection('Users').insert({
		"email": data.body.email,
		"psw":data.body.psw1,
		"fb":data.body.fb,
		"outfits":[]
	   },function(){
		   callback();
	   });
}

var findUser = function(data, callback) { //user torna 1 se trova l'utente 0 altrimenti
  var presence=0;
  MongoClient.connect(url_mongo, function(err, db) {
    assert.equal(null, err);
    var cursor =db.collection('Users').find( { "email": data.body.email } );
    cursor.limit(1).each(function(err, doc) {
      assert.equal(err, null);
      if(doc!=null){
        presence=1;
        db.close();
        callback(presence);
      }
      else{
        if(presence==0) callback(presence);
      }
    });
  });
};


function find_password(data,callback){
  MongoClient.connect(url_mongo, function(err, db) {
    assert.equal(null, err);
    var presence=0;
    var cursor =db.collection('Users').find( { "email": data.body.email ,"psw": data.body.psw1} );
    //console.log("email"+ data.body.email +" psw "+ data.body.psw1);
    cursor.limit(1).each(function(err, doc) {
       assert.equal(err, null);
       if(doc!=null){
         presence=1;
         db.close();
         callback(presence);
       }
       else{
         if(presence==0) callback(presence);
       }
    });
  });
}
	
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
	console.log("get pagina outfit");
	fs.createReadStream("./outfit.html").pipe(res);
});
	
app.get("/inseriscilink",function(req,res){
	res.writeHead(500, {"Content-type": "text/html"});
	console.log("get pagina HOME");
	fs.createReadStream("./inseriscilink.html").pipe(res);
});


app.post("/paginainiziale",function(req,res){
	console.log("post su pagina iniziale ricevuta");
	console.log('email:'+req.body.email);
	 
	 findUser(req,function(ret){
			if(ret==0){ //se non lo trova ret=0 allora lo aggiungo direttamente con la stessa politica di register
			if(req.body.fb=='Y'){
			MongoClient.connect(url_mongo, function(err, db) {
				assert.equal(null, err);
				addUser(db,req,function(){
				res.redirect('/outfit');
					});
					});
				}
			else {
			res.redirect('/register');
				}
			}
		else{//qui l'utente è gia presente nel db allora si passa al verificare la psw inserita oppure se accede tramite facebook bisogna verificare che
        //non abbia fatto l'accesso tramite il form ma direttamente dal pulsantino
      if(req.body.fb=='Y'){
        find_password(req,function(ret){
          if(ret==0){
            console.log("utente registrato gia con questa mail ma non tramite fb");
            res.redirect('/paginainiziale/?fb');
          }
          else{
            console.log("psw giusta accesso tramite fb");
            res.redirect('/outfit');
          }
        });
      }
      else{//accesso tramite form di access_page
        console.log("Verifico password.....");
        find_password(req,function(ret){
          if(ret==0){
            console.log("oh no! Password errata");
            res.redirect('/access_page/?error');
          }
          else{
            //variabili di sessione inizializzate
            console.log("Password giusta");
            res.redirect('/outfit');
          }
        });
      }
    }
  });
});		


app.post('/registrati',function(req,res){
	console.log("post su register");
	console.log("email="+req.body.email);
    findUser(req,function(ret){
      if(ret==1) { //1 se è gia presente
        res.redirect('/paginainiziale');
      }
      else{
        MongoClient.connect(url_mongo, function(err, db) {
          assert.equal(null, err);
          addUser(db,req,function(){
            res.redirect('/outfit');
          });
        });
      }
    });
});


app.post('/inseriscilink',function(request,response){
		console.log("post inserisci link");
	var item_id= parseUrl(request.body.url);
	console.log("item_id="+item_id);
	if(item_id!=null){
		ebay.xmlRequest({
			'serviceName': 'Shopping',
			'opType': 'GetSingleItem',
			'appId': 'AngelaLo-chooseyo-PRD-34d8cb02c-c598c27a',      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsAPI
			params: {
			'ItemId': item_id    // FILL IN A REAL ItemID
			}
		 },
	function(error, item) {
      if( item.Item!=null){
        console.log("Entro in insert element");
        insert_element(url_mongo,item,request);
        console.log("inserito elemento Orario: " + item.Timestamp + "\nArticolo: " + item.Item.Title + "\nPrezzo: " + item.Item.ConvertedCurrentPrice.amount +" €");
      }
      response.redirect('/outfit');
    });
  }
});




//API EBAY----------------------------------------------

/*app.get('/info/prezzi/:item_id',function(req,res){
	var item_id=req.params.item_id;
	console.log("L'ID DI ITEM È"+item_id);
});*/
		
app.listen(8080);
console.log("server lanciato sulla porta 8080");