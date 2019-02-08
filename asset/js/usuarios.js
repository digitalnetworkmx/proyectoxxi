var Usuarios =  function() {

  var llave="";

  var imagen="http://semantic-ui.com/images/wireframe/image.png";

  var init = function() {
    initForm();
    initGuardarPersona();
    initBotonEditar();
    initBotonNuevo();
    initDependencias();
    initTabla();
    initBorrar();
    initBtnCerrarSesion();
    initCambiar();
    initDropdown();
    cambiarImagen();
  }

  var initBtnCerrarSesion=function(){
    $(document).on("click","#cerrarSesion",function(){
      cerrarSesion();
    });
  }

  function cerrarSesion(){
    localStorage.setItem("nombre","");
    localStorage.setItem("correo","");
    localStorage.setItem("tipo","");
    localStorage.setItem("imagen","");
    window.location.href="login.html";
    alert("se cerro sesion");
  }

  var initDependencias=function(){
    var nombre=localStorage.getItem("nombre");
    var correo=localStorage.getItem("correo");
    var administrador =localStorage.getItem("tipo");
    var imagen = localStorage.getItem("imagen");
    if(nombre=="" || nombre==null){
      window.location.href="login.html";
    }
    if(administrador=="comun"){
      $(".vistaAdministrador").hide();
    }
    $("#ingresado").css("background-image","url("+imagen+")");
    $("#nombreUsuario").html(nombre);
  }

  var initFormularioCambiar=function(campo,llave,datos){
    $("#btnCambiarContraseña").click(function(){
      $("#formularioCambiar").submit();
    });
    $('#formularioCambiar').form({
      inline: true,
      fields: {
        actual: {
          identifier: "actual",
          rules: [{
            type: 'empty',
            prompt: 'El campo es requerido.'
          },
          {
            type: 'maxLength[50]',
            prompt: 'Este campo solo permite 50 caracteres.'
          },
          {
            type:"containsExactly["+campo+"]",
            prompt:"la contraseña no coincide con la actual"
          }
        ]
      },
      nueva:{
        identifier:"nueva",
        rules:[{
            type:"empty",
            prompt:"Este campo es necesario"
        },{
          type:"minLength[7]",
          prompt:"La contraseña debe de ser mas grande"
        },{
          type:"maxLength[20]",
          prompt:"La contraseña debe de tener menos de 20 caracteres"
        }]
      },
      nuevaRepetir:{
        identifier:"nuevaRepetir",
        rules:[{
          type:"empty",
          prompt:"Este campo es necesario para poder continuar"
        },{
          type:"match[nueva]",
          prompt:"Las contraseñas deben de ser iguales"
        }]
      }
    },
    onSuccess: function(event, fields) {
      event.preventDefault();
      $("#cambiarContraseña").modal("hide");
      var date = new Date();
      var fecha = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
      firebase.database().ref("usuarios/"+llave+"/").update({
        contraseña:fields.nueva,
        updated_at:fecha,
        activo:1
      });
      firebase.auth().signInWithEmailAndPassword(datos.correo,datos.contraseña+"");
      var usuario = firebase.auth().currentUser;
      usuario.updatePassword(fields.nueva+"").then(function(){
        alerta(true,"se cambio la contraseña correctamente")
      }).catch(function(e){
        alerta(false,"no se pudo cambiar la contraseña");
      });
    }
  }).submit(function(e) {
    e.preventDefault();
  });
  }

  var cambiarImagen = function(){
    $('#file').change(function(e) {
        //Guardamos el achivo en una variable
        var file = e.target.files[0],
        imageType = /image.*/;

      //	Validamos que sea una imagen
        if (!file.type.match(imageType)){
         return;
        }
      //Creamos un render para poder vizualizar la imagen
        var reader = new FileReader();
        reader.onload =function(e){
            $('#imagen').css("background-image","url('"+e.target.result+"')");
        }
        reader.readAsDataURL(file);
        //Subimos el archivo
         var metadata = { contentType: 'image/jpeg'};
         var subirArchivo = firebase.storage().ref().child('imagenes/' + file.name).put(file, metadata);
           subirArchivo.on('state_changed', function(snapshot){
        var progreso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            subirArchivo.snapshot.ref.getDownloadURL().then(function(url) {
              imagen=url;
          });
        });
  });
  }

  var initCambiar = function(){
    $(document).on("click",".btnCambiar",function(){
      $("#cambiarContraseña").modal({
        closable: false,
        autofocus: false
      }).modal("show");
      var contraseña = $(this).data();
      initFormularioCambiar(contraseña.contraseña,contraseña.key,$(this).data());
    });
  }

  var initBorrar = function(){
    $(document).on("click",".btnEliminar",function(){
      abrirAsegurador(this);
    });
  }

  var initDropdown = function(){
    $('.ui.dropdown').dropdown();
  }

  var abrirModal = function() {
    $('#modal').modal({
      closable: false,
      autofocus: false
    }).modal('show');
  }

  function abrirAsegurador(cosa){
    $(".ui.basic.modal").modal("show");
    var data = $(cosa).data();
    var llave=data.key;
    $(".ui.basic.modal #borrado").html("¿seguro que desea borrar a "+data.nombre+"?");
    $(".ui.basic.modal #mensaje2").html("El registro de "+data.nombre+" no se podra volver a cambiar, se perdera en el obscuro vacio que nosotros creamos :)");
    var date = new Date();
    var fecha = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
    $("#btnBorrar").click(function(){
      borrarUsuario(cosa,fecha,llave);
    });
  }

  function borrarUsuario(cosa,fecha,llave){
    var correo = $(cosa).data().correo;
    var contraseña = $(cosa).data().contraseña;
    var usuario=null;
    try{
      firebase.auth().signInWithEmailAndPassword(correo,contraseña+"");
      usuario = firebase.auth().currentUser;
    }catch(e){
      console.log(e);
      firebase.auth().signInWithEmailAndPassword(correo,contraseña+"");
      usuario = firebase.auth().currentUser;
    }
    try{
      usuario.delete().then(function(){
        firebase.database().ref("usuarios/"+llave+"/").update({
          activo:0,
          deleted_at:fecha
        });
        alerta(true,"si se borro");
      }).catch(function(e){

      });
    }catch(e){
      console.log(e);
    }
  }

  var initBotonEditar = function() {
    $(document).on('click', '.btnEditar', function(){
      $('#modal').data('accion', 'editar');
      $("#modal .header").html("Editar Persona");
      abrirModal();
      $("#contraseñas").css("display","none");
      var data = $(this).data();
      llave=data.key;
      var persona = firebase.database().ref("usuarios/"+data.key);
      $('#nombre').val(data.nombre);
      $("#paterno").val(data.paterno);
      $("#materno").val(data.materno);
      $("#email").val(data.correo);
      $("#imagen").css("background-image","url("+data.imagen+")");
      $("#contraseña").val(data.contraseña);
      $("#repetir").val(data.contraseña);
      if(data.tipo=="comun"){
        $("#comun").attr("checked","checked");
        $("#administrador").removeAttr("checked");
      }
      else{
        $("#comun").removeAttr("checked");
        $("#administrador").attr("checked","checked");
      }
    });
  }

  var initBotonNuevo = function() {
    $('#btnNuevo').click(function() {
      $('#modal').data('accion', 'nuevo');
      $("#modal .header").html("Nuevo Persona");
      $("#nombre").val("");
      $("#paterno").val("");
      $("#materno").val("");
      $("#email").val("");
      $("#contraseña").val("");
      $("#repetir").val("");
      $("#administrador").removeAttr("checked");
      $("#comun").attr("checked","checked");
      $("#contraseñas").css("display","flex");
      $("#imagen").css("background-image","url(http://semantic-ui.com/images/wireframe/image.png)")
      abrirModal();
    });
  }

  var initGuardarPersona = function() {
    $('#btnGuardar').click(function() {
      $('#form').submit();
    });
  }

  var initForm = function() {
    $('#form').form({
      inline: true,
      fields: {
        nombre: {
          identifier: 'nombre',
          rules: [{
            type: 'empty',
            prompt: 'El campo nombre es requerido.'
          },
          {
            type: 'maxLength[50]',
            prompt: 'El campo nombre solo permite 50 caracteres.'
          }
        ]
      },
      paterno:{
        idenitifier:"paterno",
        rules:[{
          type:"empty",
          prompt:"el campo de apellido paterno es requerido"
        },{
          type:"maxLength[20]",
          prompt:"El campo de apellido paterno no permite mas de 20 caracteres"
        }]
      },
      materno:{
        idenitifier:"materno",
        rules:[{
          type:"empty",
          prompt:"el campo de apellido paterno es requerido",
        },{
          type:"maxLength[20]",
          prompt:"El campo de apellido paterno no permite mas de 20 caracteres",
        }]
      },
      email:{
        idenitifier:"email",
        rules:[{
          type:"empty",
          prompt:"Este campo es necesario"
        },{
          type:"minLength[10]",
          prompt:"Su correo es invalido"
        },{
          type:"email",
          prompt:"Su correo es invalido"
        }]
      },
      contraseña:{
        identifier:"contraseña",
        rules:[{
            type:"empty",
            prompt:"Este campo es necesario"
        },{
          type:"minLength[7]",
          prompt:"La contraseña debe de ser mas grande"
        },{
          type:"maxLength[20]",
          prompt:"La contraseña debe de tener menos de 20 caracteres"
        }]
      },
      tipo:{
        identifier:"tipo"
      },
      repetir:{
        identifier:"repetir",
        rules:[{
          type:"empty",
          prompt:"Este campo es necesario"
        },{
          type:"match[contraseña]",
          prompt:"Las contraseñas deben de ser iguales"
        }]
      }
    },
    onSuccess: function(event, fields) {
      event.preventDefault();
      $("#modal").modal("hide");
      var tipo = $("input:radio[name=tipo]:checked").val();
      var type=false;
      if(tipo != "comun"){
        type=true;
      }else{
        type=false;
      }
      var date = new Date();
      var fecha = date.getDate()+"/"+(date.getMonth()+1)+"/"+date.getFullYear();
      if ($('#modal').data('accion') == 'nuevo') {
        firebase.auth().createUserWithEmailAndPassword(fields.email, fields.contraseña).then(function(){
          firebase.auth().signInWithEmailAndPassword(fields.email,fields.contraseña).then(function(){
            var user = firebase.auth().currentUser;
            user.updateProfile({
              displayName:fields.nombre,
              photoURL: imagen,
              email:fields.email,
              isAnonymous:type
            });
          });
          firebase.auth().signOut();
          firebase.database().ref('usuarios').push().set({
            nombre:fields.nombre,
            paterno:fields.paterno,
            materno:fields.materno,
            correo:fields.email,
            contraseña:fields.contraseña,
            activo:1,
            tipo:tipo,
            created_at:fecha,
            updated_at:fecha,
            imagen:imagen,
            deleted_at:null
          });
          alerta(true,"Su registro se guardo exitosamente");
        }).catch(function(e){
          alerta(false,"el correo ya esta en uso");
        });
      } else {
        firebase.database().ref("usuarios/"+llave+"/").update({
          nombre:fields.nombre,
          paterno:fields.paterno,
          materno:fields.materno,
          correo:fields.email,
          imagen:imagen,
          activo:1,
          tipo:tipo,
          updated_at:fecha
        });
        alerta(true,"Su registro se ha editado exitosamente");
      }
    }
  }).submit(function(e) {
    e.preventDefault();
  });
}

  var initTabla = function() {
    firebase.database().ref("usuarios/").orderByChild("nombre").on('value', function(snapshot) {
      var tabla= "";
      $.each(snapshot.val(), function( index, value ) {
        if(value.activo==1){
          var accion="<div class='acciones ui icon dropdown'>";
          accion+="<i class='bars icon'></i>";
          accion+="<div class='menu'>";
          accion+="<div data-tipo='"+value.tipo+"' data-contraseña='"+value.contraseña+"' data-imagen='"+value.imagen+"' data-nombre='"+value.nombre+"' data-correo='"+value.correo+"'data-materno='"+value.materno+"' data-paterno='"+value.paterno+"' data-key='"+index+"' class='item btnEditar'><i class='edit icon'></i> Editar</div>";
          accion+="<div data-contraseña='"+value.contraseña+"' data-correo='"+value.correo+"' data-key='"+index+"' data-nombre='"+value.nombre+"'class='item btnEliminar'><i class='delete icon'></i> Eliminar</div>";
          accion+="<div data-contraseña='"+value.contraseña+"'data-key='"+index+"' data-nombre='"+value.nombre+"' data-correo='"+value.correo+"' class='item btnCambiar'><i class='pencil alternate icon'></i>Cambiar Contraseña</div>";
          accion+="</div></div>";
          tabla+="<tr data-key='"+index+"'><td><div style='background-image:url("+value.imagen+")'class='imagen'></div></td><td>"+value.nombre+"</td><td>"+value.paterno+"</td><td>"+value.materno+"</td><td>"+value.correo+"</td><td>"+accion+"</td></tr>"
        }
        console.log(index);
        console.log(value);

      });
      $("#tablaUsuarios tbody").html(tabla);
      var acciones = $(".acciones");
      acciones.click(function(){
        $(".ui.dropdown").dropdown();
      })
    });
  }

return {
  init: init
}
}();

$(document).ready(function($) {
  Usuarios.init();
});
