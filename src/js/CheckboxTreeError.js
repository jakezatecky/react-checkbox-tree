function CheckboxTreeError(message) {
    this.message = message;
    this.stack = Error().stack;
}

CheckboxTreeError.prototype = Object.create(Error.prototype);
CheckboxTreeError.prototype.name = 'CheckboxTreeError';

export default CheckboxTreeError;
