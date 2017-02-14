let autoId = 0;

/**
 * Return a unique DOM ID for an element on the document.
 *
 * @param {string} prefix
 *
 * @return {string}
 */
function uniqueDomId(prefix = 'unique') {
	let findingId = true;
	let id = '';

	while (findingId) {
		id = `${prefix}-${autoId}`;

		if (document.getElementById(id) === null) {
			findingId = false;
		}

		autoId += 1;
	}

	return id;
}

export default uniqueDomId;
