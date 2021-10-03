

// Form functionality
$('#source').change(function() {
	let html = convert($('#source').val());
	$('#destination').val(html);
	$('#test').html(html);
});

// Main function.
var convert = function(text) {
	let parts = text.split(/\r?\n/);
	let result = '';
	let current = '';
	for (let i = 0; i < parts.length; i++) {
		if ((parts[i].length == 0 || parts[i][0] == '#') && current.length > 0) {
			result += transform(current, [wrapParagraph, findLinksWithoutNesting]);
			current = '';
		}
		if (parts[i][0] == '#') {
			result += transform(parts[i], [wrapHeader, findLinksWithoutNesting]);
		}
		else if (parts[i].length > 0) {
			current = current.length == 0 ? parts[i] : current + ` ${parts[i]}`;
		}
	}
	return result;
}

/*
** Conversion utility functions
*/
var transform = function(line, callbacks) {
	for (let i = 0; i < callbacks.length; i++) {
		line = callbacks[i](line);
	}
	return line;
}

var wrapHeader = function(line) {
	let headingSize = 0;
	while (line[headingSize] == '#' && headingSize < 6) {
		headingSize++;
	}
	let content = line.substring(headingSize);
	return `<h${headingSize}>${content}</h${headingSize}>`;
}

var wrapParagraph = function(line) {
	return `<p>${line}</p>`;
}

var findLinksRegex = function (line) {
	return line.replace(/\[(.+)\]\((.+)\)/, '<a href="$2">$1</a>');
}

var findLinksWithoutNesting = function (line) {
	let links = [];
	let openBrackets = [];
	let openParenthesis = [];
	let findBrackets = true;
	for (let i = 0; i < line.length - 2; i++) {
		if (findBrackets) {
			if (line[i] == '[') {
				openBrackets.push(i);
			}
			else if (line[i] == ']') {
				if (line[i + 1] == '(' && openBrackets.length > 0) {
					findBrackets = false;
				}
				else {
					openBrackets.pop();
				}
			}
		}
		else {
			if (line[i] == '(') {
				openParenthesis.push(i);
			}
			else if (line[i] == ')') {
				let open = openParenthesis.pop();
				if (openParenthesis.length == 0) {
					links.push([openBrackets.pop(), open, i]);
					findBrackets = true;
					openBrackets = [];
					openParenthesis = [];
				}
			}
		}
	}
	for (let i = links.length - 1; i >= 0; i--) {
		line = line.substring(0, links[i][0]) + '<a href="' + line.substring(links[i][1] + 1, links[i][2]) +'">' + line.substring(links[i][0] + 1, links[i][1] - 1) +'</a>' + line.substring(links[i][2] + 1);
	}
	return line;
}


