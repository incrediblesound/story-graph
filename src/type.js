var Type = function(name){
	this.types = [].concat(name);
}

Type.prototype.extend = function(name){
	var newType = new Type(this.types);
	newType.types.push(name);
	return newType;
}

Type.prototype.get = function(){
	return this.types;
}
module.exports = Type;