
// Form functionality.
$('#source').change(function() {
	let converter = new MarkdownHTMLConverter();
	let html = converter.convert($('#source').val());
	$('#destination').val(html);
	$('#markup').html(html);
});
