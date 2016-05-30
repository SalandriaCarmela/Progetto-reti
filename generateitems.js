

function checkSearch(url,url1,url2){
  var ret=true, mess="";
  //controlla se l'url fa parte del dominio
  if(url==null || url.length==0 || url.search("www.ebay.it")<0){
    mess+="¤ Inserire URL valida! \n";
    ret = false;
  }
  if(url1==null || url1.length==0 || url1.search("www.ebay.it")<0){
    mess+="¤ Inserire URL valida! \n";
    ret = false;
  }
  if(url2==null || url2.length==0 || url2.search("www.ebay.it")<0){
    mess+="¤ Inserire URL valida! \n";
    ret = false;
  }
  //idEBAY : 12 caratteri numerici ([0-9]{12}){1}
  var pattern = new RegExp('([0-9]{12}){1}');
  var id = url.match(pattern);
  if(id==null || id.length==0){
    ret= false;
  }
  var id1 = url1.match(pattern);
  if(id1==null || id1.length==0){
    ret= false;
  }
  var id2 = url2.match(pattern);
  if(id2==null || id2.length==0){
    ret= false;
  }
  if(!ret){
    window.alert(mess);
  }
  return ret;
}


