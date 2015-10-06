$(document).ready(function () {
    //Initialize tooltips
    $('.nav-tabs > li a[title]').tooltip();
    
    //Wizard
    $('a[data-toggle="tab"]').on('show.bs.tab', function (e) {

        var $target = $(e.target);
    
        if ($target.parent().hasClass('disabled')) {
            return false;
        }
    });

    $(".next-step").click(function (e) {

        var $active = $('.wizard .nav-tabs li.active');
        $active.next().removeClass('disabled');
        nextTab($active);

    });
    $(".prev-step").click(function (e) {

        var $active = $('.wizard .nav-tabs li.active');
        prevTab($active);

    });

    // Delete Adress
    $("tbody").on("click","button",function(){
        $(this).closest("tr").remove();
    });

    // Save new Address
    $("#newAdressModal").on("click","#save-btn",function(){
        var name = $(".modal-body").find("#name").val();
        var dir = $(".modal-body").find("#address").val();
        var loc = $(".modal-body").find("#location").val();
        var ciud =$(".modal-body").find("#city").val();
        // validar todas las variables y el resto de los campos
        var newRow = "<tr><td><input type=\"radio\" id=\"envio\" name=\"envio\" value=\"1\" /></td><td><input type=\"radio\" id=\"fact\" name=\"fact\" value=\"1\" />  </td><td><div class=\"panel-body\"> " + name + " - " + dir + ", " + loc + ", " + ciud + ". </div></td><td><button type=\"button\" class=\"btn btn-danger\"><span class=\"glyphicon glyphicon-remove\"></span></button></td></tr>";
        $(this).closest(".tab-pane").find("tbody").append(newRow);
        closeModal($(this).closest(".modal"));
    });

    $("#newAdressModal").on("click","#cancel-btn",function(){
        closeModal($(this).closest(".modal"));
    });

    function closeModal(mod){
        mod.find(".modal-body").find("input").val(""); // Limpia los textbox
        mod.modal("toggle"); // cierra el modal
    }
});

function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}

function closeModal(modal) {
    alert("funcion llamada");
    modal("toggle");
}


