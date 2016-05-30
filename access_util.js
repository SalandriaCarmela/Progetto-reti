function testAPI() {
console.log('Welcome!  Fetching your information.... ');
FB.api('/me', {fields: ['email', 'name']},function(res) {
  console.log('Stampo info facebook');
  console.log(res);
  $.ajax({
    type: "POST",
    url: "http://localhost:8080/paginainiziale",
    data: {email: res.email, psw1: res.name, fb: "Y"},
    success: function(data){
      console.log("sono in success");
     window.location.replace("http://localhost:8080/inseriscilink");
    }
  });
});
}

function messaggioErrore(){
  urlq = location.href.split('?');
  urlP = urlq[1];
  if(urlP=='error') alert("password errata! ");
  if(urlP=='fb') alert("sei gia registrato tramite facebook! \n devi accedere tramite il pulsante di facebook ");
}
