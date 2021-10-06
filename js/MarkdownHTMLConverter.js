class MarkdownHTMLConverter {
	/**
	 * Converts a markdown text to HTML.
	 * @param {string} text: A markdown text.
	 */
	convert = function(text) {
		// Split input by lines.
		let parts = text.split(/\r?\n/);
		// Conversion result.
		let result = '';
		// Current block result.
		let current = '';
		for (let i = 0; i < parts.length; i++) {
			// Remove the initial spaces so we can identify a wrapper.
			let line = parts[i].trimStart();
			if (this.#isHeader(line)) {
				// If this line is a header, include what we had up to now as paragraph and then the header.
				if (current.length > 0) {
					result += this.#transformLine(current, [this.#wrapLineParagraph, this.#findLinksWithoutNesting]);
					current = '';
				}
				result += this.#transformLine(line, [this.#wrapLineHeader, this.#findLinksWithoutNesting]);
			}
			else if (this.#isEmpty(line)) {
				// If this line is empty, include what we had up to now as paragraph and continue.
				if (current.length > 0) {
					result += this.#transformLine(current, [this.#wrapLineParagraph, this.#findLinksWithoutNesting]);
					current = '';
				}
			}
			else {
				// If this line is not empty or a header, keep building a paragraph.
				current = current.length == 0 ? line : current + ` ${line}`;
			}
		}
		// Include the last paragraph, if any. 
		if (current.length > 0) {
			result += this.#transformLine(current, [this.#wrapLineParagraph, this.#findLinksWithoutNesting]);
		}
		return result;
	}

	/**
	 * Converts a markdown line to HTML.
	 * @param {string} line: A markdown line.
	 * @param {array}  callbacks: A set of callbacks that apply tranformations to the line string.
	 */
	#transformLine = function(line, callbacks) {
		// Apply all necessary filters to the line.
		for (let i = 0; i < callbacks.length; i++) {
			line = callbacks[i].call(this, line);
		}
		return line;
	}

	/**
	 * Determines if a line is empty text.
	 * @param {string} line: A markdown line.
	 */
	#isEmpty = function(line) {
		return line.length == 0;
	}

	/**
	 * Returns the h-number if a line is a header, and 0 otherwise.
	 * @param {string} line: A markdown line.
	 */
	#isHeader = function(line) {
		let headingSize = 0;
		while (line[headingSize] == '#') {
			headingSize++;
		}
		// Headers must have a number of '#' between 1 and 6, otherwise it's a paragraph.
		return headingSize > 6 ? 0 : headingSize;
	}

	/**
	 * Wraps a line with an <h> tag.
	 * @param {string} line: A markdown line.
	 */
	#wrapLineHeader = function(line) {
		// Compute the h-number.
		let headingSize = this.#isHeader(line);
		// Remove '#'s and spaces.
		let content = line.substring(headingSize).trimStart();
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
	 * Converts markdown links to HTML avoiding conflicts when there is text that matches
	 * the markdown link regex nested in other text that matches the markdown link regex.
	 * @param {string} line: A markdown line.
	 */
	#findLinksWithoutNesting = function (line) {
		// Store found links. We find the links first, then replace them.
		let links = [];
		// Store found brackets.
		let openBrackets = [];
		// Track the position of an open parenthesis in the context of a link.
		let openParenthesis = null;
		// Defines the stage of the logic: whether we're looking for brackets,
		// or we have that already and we're looking for parenthesis. 
		let findBrackets = true;
		for (let i = 0; i < line.length - 2; i++) {
			// Phase 1: find link text.
			if (findBrackets) {
				// We push all opening brackets to a stack, so when we find a
				// closing one we match it with the last non-closed opening one found.
				if (line[i] == '[') {
					openBrackets.push(i);
				}
				else if (line[i] == ']') {
					if (line[i + 1] == '(' && openBrackets.length > 0) {
						// Found the structure of a link. Either a closing parenthesis is
						// ahead, or no more links can be found. 
						openParenthesis = i + 1;
						findBrackets = false;
					}
					else {
						// Found a closing bracket but this is not a link.
						openBrackets.pop();
					}
				}
			}
			// Phase 2: find link url.
			else if (line[i] == ')') {
				// Found a link, so we store it for later replacement. We store a triplet
				// of indexes in the form [start, beginningOfURL, end].
				links.push([openBrackets.pop(), openParenthesis, i]);
				// Reset values to attempt to find another link in the remainder of the string.
				findBrackets = true;
				openBrackets = [];
				openParenthesis = null;
			}
		}
		// From right to left (so the stored link data doesn't lose relevance), 
		// replace all link instances found with the equivalent HTML.
		for (let i = links.length - 1; i >= 0; i--) {
			line = line.substring(0, links[i][0]) + '<a href="' + line.substring(links[i][1] + 1, links[i][2]) +'">' + line.substring(links[i][0] + 1, links[i][1] - 1) +'</a>' + line.substring(links[i][2] + 1);
		}
		return line;
	}

	/**
	 * Converts markdown links to HTML by using regular expressions on the line string.
	 * @param {string} line: A markdown line.
	 */
	#findLinksUsingRegex = function (line) {
		return line.replace(/\[(.+)\]\((.+)\)/, '<a href="$2">$1</a>');
	}
}
