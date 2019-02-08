var correo;
var password;
var bien;

$('#iniciar').on('click',function(){

  firebase.auth().signOut().then(function() {
    // console.log("salio correctamente");
  }).catch(function(error) {
    // console.log("Fallo al cerrar"+error);
  });

  correo=$('#correo').val();
  password=$('#contraseña').val();
  // console.log(correo+"----"+password);

  if(correo=="" && password==""){
    // console.log("Por favor llenos los espacios");
    diseñocorreo();
    diseñopassword();
  }else{
    // validar();
      if (correo=="") {
        console.log("Por favor escriba su Correo");
        diseñocorreo();
      }else{
        if (password=="") {
          console.log("Por favor escriba su contraseña");
          diseñopassword();
        }else{
          verificar();
        }
      }
  }
});

var diseñocorreo = function(){
  $('#correo').css("background-color","rgba(200,0,0,0.4)");
  $('#correo').css("border","1px solid black");
  $('#correo').css("color","black");

}

var diseñopassword = function(){
  $('#contraseña').css("background-color","rgba(200,0,0,0.4)");
  $('#contraseña').css("border","1px solid black");
  $('#contraseña').css("color","black");
}

var verificar = function(){
  // console.log("entro a verificar");
  firebase.auth().signInWithEmailAndPassword(correo,password).catch(function(error) {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(error);

    $('.error').css("display","block");
    $('.restablecer').css("background-color","rgba(0,0,0,0.3)");
    $('.restablecer').css("border","none");
    $('.restablecer').css("color","white");
    $('.restablecer').val("");
    alerta(false,"Fallo al iniciar sesion");
  });

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // console.log("bien");
      alerta(true,"Inicio sesion correctamente");

      var user = firebase.auth().currentUser;
      var name, email, imagen, tipo;

      if (user != null) {
        name = user.displayName;
        email = user.email;
        imagen = user.photoURL;
        tipo = user.isAnonymous;
        if (tipo==false) {
          tipo="comun";
        }else{
          tipo="administrador";
        }
      }

      localStorage.setItem("nombre",name);
      localStorage.setItem("correo",email)
      localStorage.setItem("imagen",imagen);
      localStorage.setItem("tipo",tipo);

      console.log(localStorage.getItem("nombre"));
      console.log(localStorage.getItem("correo"));
      console.log(localStorage.getItem("imagen"));
      console.log(localStorage.getItem("tipo"));

      window.location.href="/proyectoxxi/pronostico.html";
    }
  });
}
