

$('#submit').click(function() {
	$('#destination').val(convert($('#source').val()));
});


var convert = function(text) {
	return text;
}