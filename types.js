var Type = require('./type.js');

var animal = new Type('animal');
var person = new Type('person');

var adult = person.extend('adult');
var child = person.extend('child');

var man = adult.extend('male');
var woman = adult.extend('female');

var girl = child.extend('female');
var boy = child.extend('male');

module.exports = {
	girl: girl,
	boy: boy,
	man: man,
	woman: woman,
	animal: animal
}