(function(){
    var compraApp = angular.module('Compra',['navbar','Carrito','Finalizar','Envio'])

    compraApp.directive('navBar',function(){
        return{
            restrict: 'E',
            templateUrl: "nav.html"
        }
    });
    compraApp.directive('carrito',function(){
        return{
            restrict: 'E',
            templateUrl: "carrito.html"
        }
    });
    compraApp.directive('finalizar',function(){
        return{
            restrict: 'E',
            templateUrl: "finalizar.html"
        }
    });
    
    compraApp.controller('CompraController', function($log,$scope){
        
    this.nextStep = function(){
        var $active = $('.wizard .nav-tabs li.active');
        $active.next().removeClass('disabled');
        nextTab($active);
        //$log.debug(Finalizar);
        $log.debug($scope);    
    };
    });

})();

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
        $active.next().removeClass('disabled').trigger('classChange');
        nextTab($active);

    });
    $(".prev-step").click(function (e) {

        var $active = $('.wizard .nav-tabs li.active');
        prevTab($active);

    });

    // Delete Adress
    $("tbody").on("click",".btn-rmv",function(){
        $(this).closest("tr").remove();
    });

    // Save new Address
    $("#newAdressModal").on("click","#save-btn",function(){
        var thisModal = $(this).closest(".modal");
        removeErrorMsg(thisModal); // Limpia los errores que ya había mostrado
        var name = $(".modal-body").find("#name").val();
        var dir = $(".modal-body").find("#address").val();
        var loc = $(".modal-body").find("#location").val();
        var ciud = $(".modal-body").find("#city").val();
        var emptyField = "<p id=\"error\">El campo no puede estar vacío</p>"; // El mensaje de error que se muestra
        var valid = false;
        // Valida que los campos no estén vacíos
        if(!validateNotEmpty(name)){
            $(".modal-body").find("#name").before(emptyField);
        }else if(!validateNotEmpty(dir)){
            $(".modal-body").find("#address").before(emptyField);
        }else if(!validateNotEmpty(loc)){
            $(".modal-body").find("#location").before(emptyField);
        }else if(!validateNotEmpty(ciud)){
            $(".modal-body").find("#city").before(emptyField);
        }else{
            valid = true;
        }
        if(!valid)
            return;
        // Crea la nueva fila
        var newRow = "<tr><td><input type=\"radio\" id=\"envio\" name=\"envio\" value=\"1\" /></td><td><input type=\"radio\" id=\"fact\" name=\"fact\" value=\"1\" />  </td><td><div class=\"panel-body\"> " + name + " - " + dir + ", " + loc + ", " + ciud + ". </div></td><td><button type=\"button\" class=\"btn btn-info\"><span class=\"glyphicon glyphicon-edit\"></span></button></td><td><button type=\"button\" class=\"btn btn-danger btn-rmv\"><span class=\"glyphicon glyphicon-remove\"></span></button></td></tr>";
        // Inserta la nueva fila
        $(this).closest(".tab-pane").find("tbody").append(newRow);
        // Cierra el modal
        closeModal(thisModal);
    });

    $("#newAdressModal").on("click","#cancel-btn",function(){
        closeModal($(this).closest(".modal"));
    });

    function closeModal(mod){
        mod.find(".modal-body").find("input").val(""); // Limpia los textbox
        mod.modal("toggle"); // cierra el modal
    }

    function removeErrorMsg(mod){
        mod.find(".modal-body").find("#error").remove();
    }
});

function nextTab(elem) {
    $(elem).next().find('a[data-toggle="tab"]').click();
}
function prevTab(elem) {
    $(elem).prev().find('a[data-toggle="tab"]').click();
}

function validateNotEmpty(val){
    if(val == "")
        return false;
    return true;
}


