var Equipos = new function() {
  var imagen2="http://semantic-ui.com/images/wireframe/image.png";
  var init = function() {
    initForm();
    initGuardarPersona();
    initBotonEditar();
    initBotonNuevo();
    initTabla();
    initBotonEliminar();
    logo();
    Cancelar();
    Cerrar();
    click();
  }



  var abrirModal = function() {
    $('#modal').modal({
      closable: false,
      autofocus: false
    }).modal('show');
  }

  var initBotonEditar = function() {
    $(document).on('click', '.btnEditar', function(){
      $('#modal').data('accion', 'editar');
      var data = $(this).data();
      $('#key').val(data.key);
      $('#nombre').val(data.nombre);
      console.log(data);
      $("#imagen").css('background-image','url('+data.imagen+')');
      $('#descripcion').val(data.descripcion);
      $('#file').css('display','none');
      imagen=data.imagen;
      abrirModal();
      //mas campos
    });
  }


  var initBotonNuevo = function() {
    $('#añadir').click(function() {
      $('#modal').data('accion', 'nuevo');
      imagen=imagen2;
      $("#imagen").css('background-image','url('+imagen2+')');
      $("#file").css('display','none');
      abrirModal();
    });
  }

  var initGuardarPersona = function() {
    $('#btnGuardar').click(function() {
      $('#Equiposform').submit();
    });
  }

  var initForm = function() {
    $('#Equiposform').form({
      inline: true,
      fields: {
        nombre: {
          identifier: 'nombre',
          rules: [{
            type: 'empty',
            prompt: 'El campo "Nombre" es requerido.'
          },
          {
            type: 'maxLength[50]',
            prompt: 'El campo "Nombre" solo permite 50 caracteres.'
          }
        ]
      },
      descripcion:{
        identifier:'descripcion',
        rules:[{
          type:'empty',
          prompt:'El campo "Descripción" es requerido'
        },
        {
          type:'maxLength[100]',
          prompt:'El campo "Descripción" solo permite 100 caracteres'
        },
        {
          type:'minLength[15]',
          prompt:'El campo "Descripción" debe de tener más de 15 caracteres'
        }
      ]
    },
    imagen:{
      identifier:'imagen',
      rules:[{
        type:'empty',
        prompt:'Debe de agregar un logo al equipo de Futbol'
      }]
    }


  },
  onSuccess: function(event, fields) {
    event.preventDefault();
    cerrarmodal();
    setTimeout(function(){ $('#Equiposform')[0].reset() }, 1000);
    var fecha=new Date();
    var fechas= fecha.getDate() + "/" + (fecha.getMonth() +1) + "/" + fecha.getFullYear();
    if ($('#modal').data('accion') == 'nuevo') {
      firebase.database().ref('equipos').push().set({
        nombre:fields.nombre,
        descripcion:fields.descripcion,
        imagen:imagen,
        activo:1,
        created_at:fechas,
        updated_at:null,
        deleted_at:null
      });
    } else {
      firebase.database().ref("equipos/"+fields.key+"/").set({
        nombre:fields.nombre,
        descripcion:fields.descripcion,
        imagen:imagen,
        activo:1,
        created_at:fechas,
        updated_at:fechas,
        deleted_at:null

      });
    }
  }
}).submit(function(e) {
  e.preventDefault();
});
}

var initTabla = function() {
  firebase.database().ref("equipos/").orderByChild("fecha").on('value', function(snapshot) {
    var tabla= "";
    fechas="";
    var activo=1;
    $.each(snapshot.val(), function( key, value ) {
      if(value.activo==1){
        var accion="<div class='ui acciones icon dropdown'>";
        accion+="<i class='bars icon'></i>";
        accion+="<div class='menu'>";
        accion+="<div class='item btnEditar' data-key='"+key+"' data-nombre='"+value.nombre+"' data-imagen='"+value.imagen+"' data-descripcion='"+value.descripcion+"'><i class='edit icon blue'></i>Editar</div>";
        accion+="<div class='item btnEliminar' data-key='"+key+"'><i class='delete icon red'></i>Eliminar</div>";
        accion+="</div></div>";
        tabla+="<tr>";
        tabla+="<td><div style='background-image:url("+value.imagen+")' class='imagen2' id='imagen2'></div></td>";
        tabla+="<td>"+value.nombre+"</td>";
        tabla+="<td>"+value.descripcion+"</td>";
        tabla+="<td>"+accion+"</td></tr>";
      }
    });
    $("#Equipostabla tbody").html(tabla);
    $('.ui.dropdown').dropdown();
  });
}
return {
  init: init,
}
}();
function cerrarmodal(){
  $('#modal').modal('hide');
}

var initBotonEliminar = function() {
  $(document).on('click', '.btnEliminar', function(){
    $('#modaleliminar').modal('show');
    borrar(this);

  });
}

function borrar (componente) {
  var datos=$(componente).data();
  var llave=datos.key;
  $(document).on('click','#botonEliminar',function () {
    firebase.database().ref('equipos/'+llave+'/').set({
      deleted_at:fechas,
      activo:0
    });});
  }

  var logo = function () {
    $(document).on('click','#file',function () {
      $('#file').change(function(e) {
        console.log(e);
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
          $('#porcentaje').html( parseFloat(progreso).toFixed(0) + '%');
          subirArchivo.snapshot.ref.getDownloadURL().then(function(url) {
            imagen=url;

            $('#url').html(url);
            $('#file').data('url',url);
            $('#file').attr('data-url',url);
          });
        });
      });
    });
  }

  function Cancelar() {
    $(document).on('click','#btnCancelar',function () {
      setTimeout(function(){ $('#Equiposform')[0].reset() }, 1000);
    });
  }

  function Cerrar() {
    $(document).on('click','#cerrar',function () {
      setTimeout(function(){ $('#Equiposform')[0].reset() }, 1000);
    });
  }


  var click=function () {
    $(document).on('click','#imagen',function () {
      $('#file').trigger('click');
    });
  }

  $(document).ready(function($) {
    Equipos.init();
  });
