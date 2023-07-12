function TreeModelError(message) {
    this.message = message;
    this.stack = Error().stack;
}

TreeModelError.prototype = Object.create(Error.prototype);
TreeModelError.prototype.name = 'TreeModelError';

export default TreeModelError;
