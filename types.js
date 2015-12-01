var Type = require('./src/type.js');

var animal = new Type('animal');
var person = new Type('person');
var situation = new Type('situation');

var group = situation.extend('group_people');
var tragedy = situation.extend('sad');

var adult = person.extend('adult');
var child = person.extend('child');

var man = adult.extend('male');
var woman = adult.extend('female');

var girl = child.extend('female');
var boy = child.extend('male');

module.exports = {
	child: child,
	girl: girl,
	boy: boy,
	man: man,
	woman: woman,
	animal: animal,
	tragedy: tragedy,
	situation: situation,
	group: group
}