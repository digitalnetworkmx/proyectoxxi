function inicio(){
  $.ajax({
    url:"menu.html",
    type:"GET",
    data:{},
  }).done(function(res){
    $("#nav").html(res);
  }).fail(function(e){
    console.log("no se pudo");
  });
}
window.onload=inicio;
