var Tabla = new function(){
  var equipos=[];
  var init = function(){
    iniEquipos();
    initDropdown();
    initDependencias();

  }

  $(document).ready(function() {
    // console.log( "ready!" );
   // $('.ui.radio.checkbox').checkbox();
  });

  var initDropdown = function(){
  $('.ui.dropdown').dropdown();
}

function cerrarSesion(){
  localStorage.setItem("nombre","");
  localStorage.setItem("correo","");
  localStorage.setItem("tipo","");
  localStorage.setItem("imagen","");
  window.location.href="login.html";
}

var initDependencias=function(){
  // localStorage.setItem("nombre","Mario");
  // localStorage.setItem("correo","mario@gmail.com");
  // localStorage.setItem("tipo","administrador");
  // localStorage.setItem("imagen","https://www.ngenespanol.com/wp-content/uploads/2018/08/La-primera-imagen-de-la-historia.jpg");
  var nombre=localStorage.getItem("nombre");
  var correo=localStorage.getItem("correo");
  var administrador =localStorage.getItem("tipo");
  var imagen = localStorage.getItem("imagen");
  if(nombre==""){
    window.location.href="login.html";
  }
  if(administrador!="administrador"){
    $(".vistaAdministrador").hide();
  }
  $("#ingresado").css("background-image","url("+imagen+")");
  $("#nombreUsuario").html(nombre);
}




  var conta=0;
  var nombre=1;
  var initTabla = function(){
firebase.database().ref("partidos/").orderByChild("fecha").on('value', function(snapshot) {
    var tabla ="";
     $.each(snapshot.val(), function(index, value){
       if(value.activo==1){
         var local= getEquipo(value.key_clubLocal);
         var visitante= getEquipo(value.key_clubVisitante);
         // console.log(local);
         // console.log(visitante);


         var logolocal = "<div class='contenedor'>";
         logolocal+="<div class='logo' style='width: 90px; height:90px; background-image:url("+local.imagen+"); background-repeat: no-repeat;  background-size: cover;  background-position: center;'>"

         logolocal+="</div>"

         var logoVisitante = "<div class='contenedor'>";
         logoVisitante+="<div class='logo' style='width: 90px; height:90px; background-image:url("+visitante.imagen+"); background-repeat: no-repeat;  background-size: cover;  background-position: center;'>"

         logoVisitante+="</div>"
         // var ahh="<form>";
         var ahh="<input type='radio' name='grupo"+nombre+"'/>";
         // ahh+="</form>";

         tabla+="<tr class='center aligned' id='grupo"+nombre+"' >"+
              "<td>"+logolocal+local.nombre+"<br><br>"+local.descripcion+"<br><br>"+ahh+"</td>"+
              "<td><br><br><br><br>"+ahh+"</td>"+
              "<td>"+logoVisitante+visitante.nombre+"<br><br>"+visitante.descripcion+"<br><br>"+ahh+"</td>"+
            "</tr>";

         // console.log(value);

         conta+=1;
         nombre+=1;

       }



});

 // console.log("tablas;"+conta);

$("#tabla tbody").html(tabla);


 });

  }

$(document).on("click","#guardar",function() {
var can=0;
var aceptar=false;

for(var i=1; i<=conta; i++){
  if($('input:radio[name=grupo'+i+']').is(":checked")){
    can+=1;

    // console.log("marcados"+can);
  }
  // console.log("marcados"+can);

}

// console.log("tablas:"+conta);

if(can==conta){
 console.log("Completos");
   aceptar=true;
   // console.log(aceptar);
}else{
  aceptar=false;
}

if(aceptar==true){
  alert("Datos completos");
  // console.log("marcados"+can);
}else if (aceptar==false){
  alert("Datos incompletos");
}


});



var iniEquipos = function(){
firebase.database().ref("equipos/").on('value', function(snapshot) {
  $.each(snapshot.val(), function(index, value){
    equipos.push({key:index,valor:value});
    });
  });
  initTabla();
}

var getEquipo = function(key){
  var miequipo= false;
  $.each(equipos, function(index, value){
    if(key==value.key){
      miequipo= value.valor;
    }
  });
  return miequipo;
}

  return {
  init: init
  }
  }();

$(document).ready(function(){
  Tabla.init();
})
