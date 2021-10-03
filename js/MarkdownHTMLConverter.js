class MarkdownHTMLConverter {
	/**
	 * Converts a markdown text to HTML.
	 * @param {string} text: A markdown text.
	 */
	convert = function(text) {
		let parts = text.split(/\r?\n/);
		let result = '';
		let current = '';
		for (let i = 0; i < parts.length; i++) {
			if ((parts[i].length == 0 || parts[i][0] == '#') && current.length > 0) {
				result += this.#transformLine(current, [this.#wrapLineParagraph, this.#findLinksWithoutNesting]);
				current = '';
			}
			if (parts[i][0] == '#') {
				result += this.#transformLine(parts[i], [this.#wrapLineHeader, this.#findLinksWithoutNesting]);
			}
			else if (parts[i].length > 0) {
				current = current.length == 0 ? parts[i] : current + ` ${parts[i]}`;
			}
		}
		return result;
	}

	/**
	 * Converts a markdown line to HTML.
	 * @param {string} line: A markdown line.
	 * @param {array}  callbacks: A set of callbacks that apply tranformations to the line string.
	 */
	#transformLine = function(line, callbacks) {
		for (let i = 0; i < callbacks.length; i++) {
			line = callbacks[i](line);
		}
		return line;
	}

	/**
	 * Wraps a line with either a <p> or <h> tag.
	 * @param {string} line: A markdown line.
	 */
	 #wrapLine = function (line) {
		return line[0] == '#' ? this.#wrapLineHeader(line) : this.#wrapLineParagraph(line);
	}

	/**
	 * Wraps a line with an <h> tag.
	 * @param {string} line: A markdown line.
	 */
	#wrapLineHeader = function(line) {
		let headingSize = 0;
		while (line[headingSize] == '#' && headingSize < 6) {
			headingSize++;
		}
		let content = line.substring(headingSize);
		return `<h${headingSize}>${content}</h${headingSize}>`;
	}

	/**
	 * Wraps a line with a <p> tag.
	 * @param {string} line: A markdown line.
	 */
	#wrapLineParagraph = function(line) {
		return `<p>${line}</p>`;
	}

	/**
	 * Converts markdown links to HTML by using regular expressions on the line string.
	 * @param {string} line: A markdown line.
	 */
	#findLinksUsingRegex = function (line) {
		return line.replace(/\[(.+)\]\((.+)\)/, '<a href="$2">$1</a>');
	}

	/**
	 * Converts markdown links to HTML avoiding conflicts when there is text that matches
	 * the markdown link regex nested in other text that matches the markdown link regex.
	 * @param {string} line: A markdown line.
	 */
	#findLinksWithoutNesting = function (line) {
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


}
