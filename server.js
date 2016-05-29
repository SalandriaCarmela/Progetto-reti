var express = require('express');
var fs = require('fs');
var app = express();
var ebay = require('ebay-api/index.js');
var MongoClient = require('mongodb').MongoClient;
var url_mongo='mongodb://localhost:27017/test';
var ObjectId = require('mongodb').ObjectID;
var assert=require('assert');
var session = require('express-session');
var events=require('events');
var nodemailer= require('nodemailer');

//SESSIONE

app.use(session({secret: 'carmelamela'}));
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({extended: true}));
app.use(express.static(__dirname+'/facebook'));
app.use(express.static(__dirname+'/registrazione'));
app.use(express.static(__dirname+'/foglidistile'));
app.use(express.static(__dirname+'/Immagini'));
app.use(express.static('facebook'));
//app.set('views', __dirname);

const crypto=require('crypto');
const secret='angelina';
const supersecret='choose';
const crypto_type='aes192';
const password_super_segreta='choose1234';

//NOTIFICHE
var transporter= nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'chooseyourstyleapp@gmail.com',
        pass: 'chooseyourstyle'
    }
});


var sec=1000;
var min=60*sec;
var hour=60*min;

var eventEmitter=new events.EventEmitter();



function insert_element(url_mongo, item, req){
  ses = req.session;
  MongoClient.connect(url_mongo, function(err, db) {
    console.log(req.body.email);
        db.collection('Users',function(err,collection){
          if(err) throw err;
          var user;
          if(req.body.email==null) user= ses.email;
          else user=req.body.email.replace(/%[0-9]{2}/g,'@');
          console.log("user n insert elem: " + user);
          collection.update({"email": user },{$push: {
			  prodotto1: {
              "name": item.Item.Title,
              "itemId": item.Item.ItemID,
              "img": item.Item.PictureURL,
              "link": req.body.url,
              "price":item.Item.ConvertedCurrentPrice.amount
              
            }
          }
          
        });

      });
  });
}


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
		"prodotto1":[]
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

//GET
app.get('/logout',function(req,res){
  req.session.destroy(function(err) {
    if(err) {
      console.log(err);
    }
    else {
      console.log("user "+req.body.email+"Logged out");
      res.redirect('/paginainiziale');
    }
  });
});

	
app.get('/', function(request,response){ //carica la pagina
	//response.writeHead(200, {"Content-type": "text/html"});
	console.log("main request get");
    response.redirect('/paginainiziale');
});


app.get('/errorNotLogged', function(req,res){ //carica la pagina
	res.writeHead(500, {"Content-type": "text/html"});
	console.log("error not logged user");
  fs.createReadStream("./errorNotLogged.html").pipe(res);
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
	ses = req.session;
	if(ses.logged){
		res.writeHead(500, {"Content-type": "text/html"});
		console.log("get pagina outfit");
		fs.createReadStream("./outfit.html").pipe(res);
	}
});
	
app.get("/inseriscilink",function(req,res){
	ses = req.session;
	if(ses.logged){
		res.writeHead(500, {"Content-type": "text/html"});
		console.log("get pagina HOME");
		fs.createReadStream("./inseriscilink.html").pipe(res);
	}
});

//POST

app.post("/paginainiziale",function(req,res){
	console.log("post su pagina iniziale ricevuta");
	console.log('email:'+req.body.email);
	
	if(req.body.fb==null){
		const cipher=crypto.createCipher(crypto_type,secret);
		var pswEncrypted=cipher.update(req.body.psw1,'utf8','hex');
		pswEncrypted+=cipher.final('hex');
		req.body.psw1=pswEncrypted;
	}
	else{
		const cipher_fb=crypto.createCipher(crypto_type,supersecret);
		var facebook_secret=cipher_fb.update(password_super_segreta,'utf8','hex');
		facebook_secret+=cipher_fb.final('hex');
		req.body.psw1=facebook_secret;
	}
	ses = req.session;
	 
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
			res.redirect('/registrati');
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
            ses.email=req.body.email;
            ses.logged = true;
            res.redirect('/outfit');
          }
        });
      }
      else{//accesso tramite form di access_page
        console.log("Verifico password.....");
        find_password(req,function(ret){
          if(ret==0){
            console.log("oh no! Password errata");
            res.redirect('/paginainiziale/?error');
          }
          else{
            //variabili di sessione inizializzate
            console.log("Password giusta");
            ses.email=req.body.email;
            ses.logged=true;
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
	
	if(req.body.fb==null){  //imposto la pssword diversa se accede tramite facebook o tramite form di registrazione
		const cipher=crypto.createCipher(crypto_type,secret);
		var pswEncrypted=cipher.update(req.body.psw1,'utf8','hex');
		pswEncrypted+=cipher.final('hex');
		req.body.psw1=pswEncrypted;
	}
	else{
		const cipher_fb=crypto.createCipher(crypto_type,supersecret);
		var facebook_secret=cipher_fb.update(password_super_segreta,'utf8','hex');
		facebook_secret+=cipher_fb.final('hex');
		req.body.psw1=facebook_secret;
		}
	ses = req.session;
	
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
	var item1_id=parseUrl(request.body.url1);
	var item2_id=parseUrl(request.body.url2);
	console.log("item_id="+item_id);
	//console.log("item1_id="+item1_id);
	
	if(item_id!=null){
		ebay.xmlRequest({
			'serviceName': 'Shopping',
			'opType': 'GetSingleItem',
			'appId': 'AngelaLo-chooseyo-PRD-34d8cb02c-c598c27a',      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsA
		params: {
			'ItemId': item_id
		}
  },
  function(error, item) {
      if( item.Item!=null){
		  console.log("ITEM="+JSON.stringify(item));
        console.log("Entro in insert element");
        console.log("item: "+item.Item.Title);
        insert_element(url_mongo,item,request);
        console.log("inserito elemento Orario: " + item.Timestamp + "\nArticolo: " + item.Item.Title + "\nPrezzo: " + item.Item.ConvertedCurrentPrice.amount +" €");
      }
     // response.redirect('/outfit');  
    });
  }
  
  if(item1_id!=null){
		ebay.xmlRequest({
			'serviceName': 'Shopping',
			'opType': 'GetSingleItem',
			'appId': 'AngelaLo-chooseyo-PRD-34d8cb02c-c598c27a',      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsA
			
		params: {
			'ItemId': item1_id    // FILL IN A REAL ItemID
		}
  },
  function(error, item) {
      if( item.Item!=null){
        console.log("Entro in insert outfitt");
        insert_element(url_mongo,item,request);
        console.log("inserito elemento Orario: " + item.Timestamp + "\nArticolo: " + item.Item.Title + "\nPrezzo: " + item.Item.ConvertedCurrentPrice.amount +" €");
      }
      //response.redirect('/outfit');
    });
  }
  
  if(item2_id!=null){
		ebay.xmlRequest({
			'serviceName': 'Shopping',
			'opType': 'GetSingleItem',
			'appId': 'AngelaLo-chooseyo-PRD-34d8cb02c-c598c27a',      // FILL IN YOUR OWN APP KEY, GET ONE HERE: https://publisher.ebaypartnernetwork.com/PublisherToolsA
			
		params: {
			'ItemId': item2_id    // FILL IN A REAL ItemID
		}
  },
  function(error, item) {
      if( item.Item!=null){
        console.log("Entro in insert outfitt");
        insert_element(url_mongo,item,request);
        console.log("inserito elemento Orario: " + item.Timestamp + "\nArticolo: " + item.Item.Title + "\nPrezzo: " + item.Item.ConvertedCurrentPrice.amount +" €");
      }
      response.redirect('/outfit');
    });
  }
  		
   
   }); 
      





//API EBAY--------------------------------------------------------------------------


app.get('/data', function(req, res){
      ses = req.session;
      if(ses.logged){
		  var email = ses.email;
		  var elems;
		  MongoClient.connect(url_mongo, function(err, db) {
          db.collection('Users',function(err,collection){
          if(err) throw err;
          var cursor =db.collection('Users').find( { "email": email} );
          cursor.each(function(err, doc) {
            if(doc!=null){
				console.log("DOC: " + doc);
              elems=doc.prodotto1;
              elems.push(doc._id.toString());
              console.log("Elems:"+elems);
            }
            else{
              db.close();
              res.send(elems);
            }
        });
        });
      });
    }
    else{
	   res.redirect("/errorNotLogged");
	 }
});

app.get('/data/:item', function(req, res){
   ses = req.session;
   console.log("item id get");
   if(ses.logged){
		var id = req.params.item;
    //console.log("In data/item");
		var email=ses.email;
    MongoClient.connect(url_mongo, function(err, db) {
        db.collection('Users',function(err,collection){
          if(err) throw err;
          var cursor =db.collection('Users').find( { "email": email} );
          cursor.each(function(err, doc) {
            var target;
            if(doc!=null){
              elems=doc.prodotto1;
              for(var el in elems){
                //console.log("Id è "+id+" e el è "+elems[el].itemId);
                if(elems[el].itemId==id){
                  target = elems[el];
                  db.close();
                  res.send(target)}
			  }
		  }
            else{
              db.close();
              //res.send(target);
            }
        });
        });
      });
    }
    else{
		res.redirect("/errorNotLogged");
	}   
});



app.get('/info/dettagliProdotto/:user_id/:item_id',function(request,response){
	ses = request.session;
  console.log("GET API DATA USER ID ITEM");
  if(ses.logged){
	  
  var elems;
  var email=ses.email;
  var item_id = request.params.item_id;
  MongoClient.connect(url_mongo, function(err, db) {
      db.collection('Users',function(err,collection){
        if(err) throw err;
        var cursor =db.collection('Users').find( { "_id": ObjectId(request.params.user_id)} );
        cursor.each(function(err, doc) {
          var target;
          if(doc!=null){
            elems=doc.prodotto1;
            for(var el in elems){
              if(elems[el].itemId==item_id){
                target = elems[el];
                db.close();
                response.send(target);}
            }
          }
          else{
            db.close();
          }
      });
      });
    });
   }
   else{
	   response.redirect("/errorNotLogged");
	  }
});

app.get('/info/listaProdotti/:user_id',function(request,response){
	ses = request.session;
  console.log("GET API DATA USER ID");
  if(ses.logged){
	  var elems;
	  var email=ses.email;
		MongoClient.connect(url_mongo, function(err, db) {
		db.collection('Users',function(err,collection){
      if(err) throw err;
      var cursor =db.collection('Users').find( { "_id": ObjectId(request.params.user_id)} );
      cursor.each(function(err, doc) {
        if(doc!=null){
          elems=doc.prodotto1;
        }
        else{
          db.close();
          response.send(elems);
        }
		});
		});
	});
	}
	else{
		response.redirect("/errorNotLogged");
	}
});

app.get('/info/prezzi/:user_id/:item_id',function(request,response){
	ses = request.session;
  console.log("GET API DATA USER ID ITEM");
  if(ses.logged){
	var email=ses.email;
	var elems;
	var item_id = request.params.item_id;
	MongoClient.connect(url_mongo, function(err, db) {
      db.collection('Users',function(err,collection){
        if(err) throw err;
        var cursor =db.collection('Users').find( { "_id": ObjectId(request.params.user_id)} );
        cursor.each(function(err, doc) {
          var target;
          if(doc!=null){
            elems=doc.prodotto1;
            for(var el in elems){
              if(elems[el].itemId==item_id){
                target = elems[el];
                db.close();
                response.send(target.price);}
            }
          }
          else{
            db.close();
          }
      });
      });
    });
	}
	else{
		response.redirect("/errorNotLogged");
	}
});

app.get('/info/profilo/:user_id',function(request,response){
	ses = request.session;
	if(ses.logged){
  console.log("GET API DATA USER ID PROFILO");
  var elem;
  MongoClient.connect(url_mongo,function(err,db){
    var cursor=db.collection('Users').find({"_id":ObjectId(request.params.user_id)});
    cursor.each(function(err,doc){
      if(doc!=null){
        elem={
          "email": doc.email,
          "fb":doc.fb,
          "num_elem1":doc.prodotto1.length
        }

      }
      else{
        db.close();
        response.send(elem);
      }
    });
  });
}
else{
	response.redirect("/errorNotLogged");
}
});
		
app.listen(8080);
console.log("server lanciato sulla porta 8080");
