String.prototype.padLeft = function(pad) {
	return pad.substring(0, pad.length - this.length) + this;
}
String.prototype.padRight = function(pad) {
	return this + pad.substring(0, pad.length - this.length);
}
