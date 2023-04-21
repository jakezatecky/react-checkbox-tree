function NodeModelError(message) {
    this.message = message;
    this.stack = Error().stack;
}

NodeModelError.prototype = Object.create(Error.prototype);
NodeModelError.prototype.name = 'NodeModelError';

export default NodeModelError;
