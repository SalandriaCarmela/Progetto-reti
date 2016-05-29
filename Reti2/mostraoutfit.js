function generateItems(){
  $.get("http://localhost:8080/data", function(data){
    console.log("GENERATE ITEMS PARTITO");
    var tbody = '';
    var singleItem;
    var singleItem1;
    var singleItem2;
    var theader = '<div><table width="100%" class="prods"><th class="prods" colspan="3">Prodotti</th>\n';
       var c=0;
       for(i=0; i<data.length-3; i++){
		   
		   var k=i+1;
		   var j=i+2;
            tbody += '<tr style="vertical-align:middle;" width="100%" class="prods">';
            tbody += '<td class="prods">';
           // tbody += '<input id="remove_'+i+'" align="center" type="image" src="/remove-32.png" width=26 height=26 name="remove" onclick="deleteElem(id)"/>';
            tbody += '</td>'
            tbody += '<td class="prods">';
            tbody += "OUTFIT"+c;
            tbody += '</td>';
            tbody += '<td class="prods">';
            singleItem = JSON.stringify(data[i].itemId);
            singleItem1 = JSON.stringify(data[k].itemId);
            singleItem2 = JSON.stringify(data[j].itemId);
            tbody += '<input align="center" type="image" src="Immagini/ciao.jpg"  name="all" onclick="getItemData('+singleItem.replace(/\"/g, "")+','+singleItem1.replace(/\"/g, "")+','+singleItem2.replace(/\"/g, "")+');"/>';
            tbody += '</td>';
            tbody += '</tr>\n';
            i=i+2;
            c++;
       }
 
 var tfooter = '</table></div>';
    document.getElementById('products').innerHTML = theader + tbody;
   //document.getElementById('objid').innerHTML = "IdUtente: "+data[data.length-1];
});
}


function getItemData(item,item1,item2){
 
 $.get("http://localhost:8080/data/"+item,function(data){
	  var htmlProd = '<table id="dett"></table><tr><th><th><th><th><th>Dettagli Prodotto</th></th></th></th></th></tr>';
     for(var el in data){
      //ar lookup = el.toString();
       if(el=="img") htmlProd+='<tr></tr></br></br><td id="imma"><img src="'+data[el]+' width="170" height="170"></img></td></tr>';
       else if(el=="link") htmlProd += "<tr></tr><td><a href='"+data[el]+"' onclick='window.open(this.href);return false'> link al prodotto</a></td></tr>";
       else if(el=="price") htmlProd+="</br>Prezzo : "+ data[el];
       //else if(el=="price") htmlProd += "<tr><td> Prezzo:"+data[el][data[el].length-1]['value'] +"€ e è stato controllato il "+data[el][data[el].length-1]['timestamp']+"</td></tr>";
      // else htmlProd += "<tr><td >"+data[el]+"</td></tr>";
     }
     htmlProd += '</table>';
     document.getElementById("specs").innerHTML = htmlProd;
 
 
 $.get("http://localhost:8080/data/"+item1,function(data){
	 
    // var htmlProd = '<table id="dett"><tr></br></br></br></br></br></br></br></br></br></br></br></br></br><th>Dettagli Prodotto</th></tr>';
     for(var el in data){
      //ar lookup = el.toString();
       if(el=="img") htmlProd+='<tr></br></br><td id="imma"><img src="'+data[el]+' width="170" height="170"></img></td></tr>';
       else if(el=="link") htmlProd += "<tr><td><a href='"+data[el]+"' onclick='window.open(this.href);return false'> link al prodotto</a></td></tr>";
       else if(el=="price") htmlProd+="Prezzo : "+ data[el];
       //else if(el=="price") htmlProd += "<tr><td> Prezzo:"+data[el][data[el].length-1]['value'] +"€ e è stato controllato il "+data[el][data[el].length-1]['timestamp']+"</td></tr>";
      // else htmlProd += "<tr><td >"+data[el]+"</td></tr>";
     }
      htmlProd += '</table>';
      document.getElementById("specs").innerHTML = htmlProd;
      
      $.get("http://localhost:8080/data/"+item2,function(data){
	 
    // var htmlProd = '<table id="dett"><tr></br></br></br></br></br></br></br></br></br></br></br></br></br><th>Dettagli Prodotto</th></tr>';
     for(var el in data){
      //ar lookup = el.toString();
       if(el=="img") htmlProd+='<tr><td id="imma"></br><img src="'+data[el]+' width="170" height="170"></img></td></tr>';
       else if(el=="link") htmlProd += "<tr><td><a href='"+data[el]+"' onclick='window.open(this.href);return false'> link al prodotto</a></td></tr>";
       else if(el=="price") htmlProd+="Prezzo : "+ data[el];
       //else if(el=="price") htmlProd += "<tr><td> Prezzo:"+data[el][data[el].length-1]['value'] +"€ e è stato controllato il "+data[el][data[el].length-1]['timestamp']+"</td></tr>";
      // else htmlProd += "<tr><td >"+data[el]+"</td></tr>";
     }
      htmlProd += '</table>';
      document.getElementById("specs").innerHTML = htmlProd;
      });
      });
 });
}
