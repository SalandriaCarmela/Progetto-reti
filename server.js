var express = require('express');
var fs = require('fs');
var app = express();

app.use(express.static('facebook'));
//prova GET


app.get('/', function(req, res) {
            fs.readFile(__dirname + '/paginainiziale.html', 'utf8', function(err, text){
                res.send(text);
            });
            console.log('pagina mandata');
		});


		
app.listen(8080);
