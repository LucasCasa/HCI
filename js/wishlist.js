$(document).ready(function(){
	$("tbody").do("click",".btn-rmv",function(){
		$(this).closest("tr").remove();
	});
});