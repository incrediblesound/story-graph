var Type = function(name){
	this.types = [].concat(name);
}

Type.prototype.extend = function(name){
	if(name instanceof Type){
		name = name.get();
	} else {
		name = [].concat(name)
	}
	var types = this.get();
	types = types.concat(name)
	var newType = new Type(types);
	
	return newType;
}

Type.prototype.get = function(){
	return this.types.slice();
}

Type.prototype.replace = function(oldType, newType){
	var index = this.types.indexOf(oldType);
	this.types[index] = newType;
}

Type.prototype.add = function(newType){
	this.types.push(newType);
}

Type.prototype.remove = function(type){
	var index = this.types.indexOf(type);
	this.types.splice(index, 1);
}

module.exports = Type;