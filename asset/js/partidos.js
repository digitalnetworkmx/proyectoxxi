var Partidos = new function(){
  var key="",createdE="",createdEPar="",tituloModal="Editar jornada",tituloModal2="Nueva jornada",indice="",keyPar="",indiceJ_P="";
  var init = function(){
    initForm();
    initFormPartido();
    initBotonNuevo();
    initBotonRegresar();
    initBotonRegistrarPartido();
    initBotonGuardarJornada();
    initBotonGuardarPartido();
    initBotonVerPartidos();
    initBotonEliminar();
    initBotonEditar();
    initBotonEliminarPartidos();
    initBotonEditarPartidos();
    initTabla();
    initDropdown();
    minimo_maximoFecha();
    firebase.database().ref("jornadas/").orderByChild("nombreJornada").on("value", function(snapshot){
      console.log(snapshot.val());
    });
    firebase.database().ref("partidos/").orderByChild("fecha").on('value', function(snapshot) {
      console.log(snapshot.val());
    });
  }

  function alerta(exito=false,mensaje="El programador ha cometido un error.",tiempo=3000) {
		var color= (exito) ?'green':'red';
		iziToast.show({
  	  message: mensaje,
		  position:'topCenter',
		  timeout: tiempo,
		  color:color,
		});
  }

  var limpiar = function(){
    $('#formJ').form("clear");
    $('#formRgtr').form("clear");
    $('#fechaCierre').removeAttr("min");
    $('#fechaInicio').removeAttr("max");
  }

  var abrirModalNueva = function(){
    $("#modalNew").modal({
      closable: false,
      autofocus: false
    }).modal("show");
  }

  var cerrarModal = function(){
    $('#modalNew').modal('hide');
    $('#modalRegistrarPartidos').modal('hide');
  }

  //Botones
  var initBotonRegresar = function(){
    $("#btnRegresar").click(function(){
      $("#pantallaP").hide();
      $("#tablaJornada").show();
    });
  }

  var initBotonNuevo = function(){
    $("#btnNuevaJ").click(function(){
      $('#modalNew').data('accion', 'nuevo');
      $("#modalNew .header").html(tituloModal2);
      limpiar();
      abrirModalNueva();
    });
  }

  var initBotonEditar = function(){
    $(document).on('click', '.btnEditar', function(){
      $('#modalNew').data('accion', 'editar');
      $("#modalNew .header").html(tituloModal);
      var data = $(this).data();
      key=data.key;
      firebase.database().ref("jornadas/").orderByChild("nombreJornada").on('value', function(snapshot) {
        $.each(snapshot.val(), function( index, value ) {
          if(index==data.key){
            $('#jornada').val(value.nombreJornada);
            $('#fechaInicio').val(value.fechaInicio);
            $('#fechaCierre').val(value.fechaCierre);
            createdE=value.created_at;
          }
        });
      });
      abrirModalNueva();
    });
  }

  var initBotonEditarPartidos = function(){
    $(document).on("click",".btnEditarPar", function(){
      $('#modalRegistrarPartidos').data('accion', 'editar');
      var data = $(this).data();
      keyPar = data.key;
      firebase.database().ref("partidos/").orderByChild("fecha").on('value', function(snapshot) {
        $.each(snapshot.val(), function( index, value ) {
          if(index==data.key){

            $("#fechapartido").val(value.fecha);
            $("#horapartido").val(value.hora);
            createdEPar=value.created_at;
            indiceJ_P=value.key_Jornada;
          }
        });
      });
      minimo_maximoFechaPartido(indiceJ_P);
      $("#modalRegistrarPartidos").modal({
        closable:false,
        autofocus:false
      }).modal("show");
    });
  }

  var initBotonEliminarPartidos = function(){
    $(document).on("click", ".btnEliminarPar", function(){
      var data = $(this).data(),updated,created;
      $('#modalBorrar').modal({
       closable:false,
       onApprove : function() {
         var f = new Date();
         f = f.getFullYear() + "-" + (f.getMonth()+1) + "-" + f.getDate();
         firebase.database().ref("partidos/").orderByChild("fecha").on('value', function(snapshot) {
           $.each(snapshot.val(), function( index, value ) {
             if(index==data.key){
               created=value.created_at;
               updated=value.updated_at;
             }
           });
           console.log(snapshot.val());
         });

         firebase.database().ref("partidos/"+data.key+"/").set({
           activo:0,
           created_at: created,
           updated_at: updated,
           deleted_at:f
         });

         firebase.database().ref("partidos/").orderByChild("fecha").on('value', function(snapshot) {
           console.log(snapshot.val());
         });
         $("#pantallaP").hide();
         $("#tablaJornada").show();
         alerta(false, "El registro se borro con éxito",3000);
       }
      }).modal('show');
    });
  }

  var minimo_maximoFecha = function(){
    $('#fechaInicio').change(function(){
      var inicioFecha = $('#fechaInicio').val();
      $('#fechaCierre').attr("min",inicioFecha);
    });
    $("#fechaCierre").change(function(){
      var limiteFecha = $('#fechaCierre').val();
      $('#fechaInicio').attr("max",limiteFecha);
    });
  }

  var initBotonGuardarJornada = function(){
    $("#btnGuardarJ").click(function(){
      $("#formJ").submit();
    });
  }

  var initBotonGuardarPartido = function(){
    $("#btnGuardarP").click(function(){
      $("#formRgtr").submit();
    });
  }

  var initBotonRegistrarPartido = function(){
    $(document).on("click",".btnRgtrPartidos", function(){
      indice = $(this).data();
      limpiar();
      minimo_maximoFechaPartido(indice.key);
      $('#modalRegistrarPartidos').data('accion', 'new');
      $("#modalRegistrarPartidos").modal({
        closable:false,
        autofocus:false
      }).modal("show");
    });
  }

  var minimo_maximoFechaPartido = function(llave){
    var minimo="",maximo="";
    firebase.database().ref("jornadas/").orderByChild("nombreJornada").on("value",function(snapshot){
      $.each(snapshot.val(), function(index, value){
        if(index==llave){
          minimo=value.fechaInicio;
          maximo=value.fechaCierre;
        }
      });
      $("#fechapartido").attr("min",minimo);
      $("#fechapartido").attr("max",maximo);
    });
  }

  var initBotonEliminar = function(){
    $(document).on("click",".btnEliminar", function(){
      var data = $(this).data(),updated,created;
      $('#modalBorrar').modal({
       closable:false,
       onApprove : function() {
         var f = new Date();
         f = f.getFullYear() + "-" + (f.getMonth()+1) + "-" + f.getDate();
         firebase.database().ref("jornadas/").orderByChild("nombreJornada").on('value', function(snapshot) {
           $.each(snapshot.val(), function( index, value ) {
             if(index==data.key){
               created=value.created_at;
               updated=value.updated_at;
             }
           });
         });

         firebase.database().ref("partidos/").orderByChild("fecha").on("value", function(snapshot){
           $.each(snapshot.val(), function(index, value){
             if(value.key_Jornada==data.key){
               firebase.database().ref("partidos/"+index+"/").set({
                 activo:0,
                 created_at: created,
                 updated_at: updated,
                 deleted_at:f
               });
             }
           });
           console.log(snapshot.val());
         });

         firebase.database().ref("jornadas/"+data.key+"/").set({
           activo:0,
           created_at: created,
           updated_at: updated,
           deleted_at:f
         });
         alerta(false, "El registro se borro con éxito",3000);

         $("#pantallaP").hide();
         $("#tablaJornada").show();
       }
      }).modal('show');
    });
  }

  var initBotonVerPartidos = function(){
    $(document).on("click",".btnVerPartidos", function(){
      var data = $(this).data();
      initTablaPartidos(data.key);
    });
  }

  //Formularios
  var initForm = function(){
    $("#formJ").form({
      inline: true,
      fields: {
        jornada:{
          identifier: "jornada",
          rules: [{
              type: "empty",
              prompt: "El campo jornada es requerido."
            },
            {
              type: 'maxLength[50]',
              prompt: 'El campo nombre solo permite 50 caracteres.'
            }
          ]
        },
        fechainicio:{
          identifier: "fechainicio",
          rules: [{
              type: "empty",
              prompt: "El campo Fecha de inicio es requerido."
            },
            {
              type: 'maxLength[50]',
              prompt: 'El campo Fecha de inicio solo permite 50 caracteres.'
            }
          ]
        },
        fechacierre: {
          identifier: "fechacierre",
          rules: [{
              type: "empty",
              prompt: "El campo Fecha de cierre es requerido."
            },
            {
              type: 'maxLength[50]',
              prompt: 'El campo Fecha de cierre solo permite 50 caracteres.'
            }
          ]
        }
      },
      onSuccess: function(event, fields){
        event.preventDefault();
        if ($('#modalNew').data('accion') == 'nuevo') {
          var f = new Date();
          f = f.getFullYear() + "-" + (f.getMonth()+1) + "-" + f.getDate();
          firebase.database().ref('jornadas').push().set({
            nombreJornada:fields.jornada,
            fechaInicio:fields.fechainicio,
            fechaCierre:fields.fechacierre,
            activo:1,
            created_at: f,
            updated_at: f,
            deleted_at:null
          });
          alerta(true,"Éxito al agregar una jornada",3000);
        }else{
          var f = new Date();
          f = f.getFullYear() + "-" + (f.getMonth()+1) + "-" + f.getDate();
          firebase.database().ref("jornadas/"+key+"/").set({
            nombreJornada:fields.jornada,
            fechaInicio:fields.fechainicio,
            fechaCierre:fields.fechacierre,
            created_at: createdE,
            updated_at: f,
            activo:1
          });
          alerta(true,"Éxito al editar una jornada",3000);
        }
        cerrarModal();
      }
    }).submit(function(e){
      e.preventDefault();
    });
  }

  var initFormPartido = function(){
    $("#formRgtr").form({
      inline: true,
      fields: {
        dropdownCV:{
          identifier: "dropdownCV",
          rules: [{
              type: "empty",
              prompt: "El campo Club visitante es requerido."
            },
            {
              type: 'maxLength[50]',
              prompt: 'El campo Club visitante solo permite 50 caracteres.'
            }
          ]
        },
        dropdownCL:{
          identifier: "dropdownCL",
          rules: [{
              type: "empty",
              prompt: "El campo Club local es requerido."
            },
            {
              type: 'maxLength[50]',
              prompt: 'El campo Club local solo permite 50 caracteres.'
            },
            {
              type: "different[dropdownCV]",
              prompt: "No debe escoger el mismo equipo."
            }
          ]
        },
        fechapartido: {
          identifier: "fechapartido",
          rules: [{
              type: "empty",
              prompt: "El campo Fecha de partido es requerido."
            },
            {
              type: 'maxLength[50]',
              prompt: 'El campo Fecha de partido solo permite 50 caracteres.'
            }
          ]
        },
        horapartido: {
          identifier: "horapartido",
          rules: [{
              type: "empty",
              prompt: "El campo Hora de partido es requerido."
            },
            {
              type: 'maxLength[50]',
              prompt: 'El campo Hora de partido solo permite 50 caracteres.'
            }
          ]
        }
      },
      onSuccess: function(event, fields){
        var f = new Date();
        f = f.getFullYear() + "-" + (f.getMonth()+1) + "-" + f.getDate();
        if ($('#modalRegistrarPartidos').data('accion') == 'new') {
          firebase.database().ref('partidos').push().set({
            key_clubVisitante:fields.dropdownCV,
            key_clubLocal:fields.dropdownCL,
            fecha:fields.fechapartido,
            hora:fields.horapartido,
            key_Jornada: indice.key,
            activo:1,
            created_at: f,
            updated_at: f,
            deleted_at:null
          });
          alerta(true,"Éxito al agregar un partido a la jornada",3000);
        }else{
          firebase.database().ref("partidos/"+keyPar+"/").set({
            key_clubVisitante:fields.dropdownCV,
            key_clubLocal:fields.dropdownCL,
            fecha:fields.fechapartido,
            hora:fields.horapartido,
            key_Jornada: indiceJ_P,
            created_at: createdEPar,
            updated_at: f,
            deleted_at:null,
            activo:1
          });
          alerta(true,"Éxito al editar un partido de la jornada",3000);
        }
        firebase.database().ref("partidos/").orderByChild("fecha").on("value", function(snapshot){
          $.each(snapshot.val(),function(index, value){
            console.log(index+" y "+value);
          });
        });
        cerrarModal();
        $("#pantallaP").hide();
        $("#tablaJornada").show();
      }
    }).submit(function(e){
      e.preventDefault();
    });
  }

  //Tablas
  var initTabla = function() {
    firebase.database().ref("jornadas/").orderByChild("nombreJornada").on('value', function(snapshot) {
      var tabla="";
      var vacio=0;
      //console.log(snapshot.toJSON());
      $.each(snapshot.val(), function( key, value ) {
        var accion="<div class='ui icon dropdown'>";
        accion+="<i class='acciones bars icon'></i>";
        accion+="<div class='menu'>";
        accion+="<div class='item btnRgtrPartidos' data-key="+key+"><i class='pen square icon'></i> Registrar partido</div>";
        accion+="<div class='item btnVerPartidos' data-key="+key+"><i class='eye icon'></i> Ver partidos</div>";
        accion+="<div class='item btnEditar' data-key="+key+"><i class='pencil icon blue'></i> Editar</div>";
        accion+="<div class='item btnEliminar' data-key="+key+"><i class='delete icon red'></i> Eliminar</div>";
        accion+="</div></div>";
        if(value.activo==1){
          tabla+="<tr><td>"+value.nombreJornada+"</td><td>"+value.fechaInicio+"</td><td>"+value.fechaCierre+"</td><td>"+accion+"</td></tr>";
          vacio=1;
        }
      });
      if(vacio!=0){
        $("#footTabla").hide();
      }
      $("#tablaJornada #cuerpoTabla").html(tabla);
      $(".dropdown").dropdown();
    });
  }

  var initTablaPartidos = function(key){
    var llave_CV = new Array(),llave_CL= new Array(),llaves = new Array();
    var nombresVisitante = new Array(), nombresLocal = new Array(), hora = new Array(), fecha = new Array();

    $("#partidos #footPartidosT").show();
    firebase.database().ref("partidos/").orderByChild("fecha").on("value", function(snapshot){
      alert("lol");
      var vacio=0,tablaPartidos="";
      //console.log(snapshot.val());
      $.each(snapshot.val(), function(index, value){
        if(value.activo==1){
          if(value.key_Jornada==key){
            llave_CV.push(value.key_clubVisitante);
            llave_CL.push(value.key_clubLocal);
            hora.push(value.hora);
            fecha.push(value.fecha);
            llaves.push(index);
            vacio++;
          }
        }
      });
      if(vacio!=0){
        firebase.database().ref("equipos/").orderByChild("nombre").on("value", function(snapshot){
          $.each(snapshot.val(), function(index, value){
            for(var i=0;i<llave_CV.length;i++){
              if(llave_CV[i]==index){
                nombresVisitante.push(value.nombre);
              }
            }
            for(var i=0;i<llave_CL.length;i++){
              if(llave_CL[i]==index){
                nombresLocal.push(value.nombre);
              }
            }
          });
        });
        for(var i=0;i<llave_CL.length;i++){
          var accion="<div class='ui icon dropdown'>";
          accion+="<i class='acciones bars icon'></i>";
          accion+="<div class='menu'>";
          accion+="<div class='item btnEditarPar' data-key="+llaves[i]+"><i class='pencil icon blue'></i> Editar</div>";
          accion+="<div class='item btnEliminarPar' data-key="+llaves[i]+"><i class='delete icon red'></i> Eliminar</div>";
          accion+="</div></div>";
          tablaPartidos+="<tr><td>"+nombresVisitante[i]+"</td><td></td><td>"+nombresLocal[i]+"</td><td>"+fecha[i]+"<br> a las "+hora[i]+"</td><td>"+accion+"</td></tr>";
        }
        $("#partidos #footPartidosT").hide();
      }
      $("#partidos #cuerpoPartidos").html(tablaPartidos);
      $(".dropdown").dropdown();
      $("#tablaJornada").hide();
      $("#pantallaP").show();
    });
    //if(key!=0){}
  }

  var initDropdown = function(){
    firebase.database().ref("equipos/").orderByChild("nombre").on("value", function(snapshot){
      var opciones="";
      //console.log(snapshot.toJSON());
      $.each(snapshot.val(), function(index, value){
        if(value.activo==1){
          opciones+="<div class='item opc' style='display:flex;' data-value="+index+"><div class='logoEquipo' style='background-image:url("+value.imagen+")'></div>"+value.nombre+"</div>";
        }
      });
      $("#dropdownCV").siblings('.menu').html('<div class="item" data-value="">Selecciona un club</div>'+opciones);
      $("#dropdownCL").siblings('.menu').html('<div class="item" data-value="">Selecciona un club</div>'+opciones);
    });
  }

  return{
    init: init,
  }
}();

$(document).ready(function($){
  Partidos.init();
});
