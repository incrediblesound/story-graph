var _ = require('lodash');

module.exports = tokenizer;

function tokenizer(tokens){

	var result = {
		types: [],
		things: [],
		rules: [],
		locations: [],
		transitions: []
	}

	var parserMap = {
		['simple type']: simpleType,
		['thing']: thing,
		['compound type']: compoundType,
		['decorator']: decorator,
		['location']: location,
		['rule']: rule,
		['transition']: transition
	}
	_.each(tokens, function(tok){
		parserMap[tok.type](tok.line, result)
	})
	
	return result;
}

function simpleType(line, result){
	var calledIdx = line.indexOf('called');
	var name = line[calledIdx+1];
	result.types.push({ type: 'simple', name: name});
}

function thing(line, result){
	var preDef = line.indexOf('a') > -1 ? line.indexOf('a') :  line.indexOf('an');
	var calledIdx = line.indexOf('called');
	var types = line.slice(preDef+1, calledIdx);
	var name = line[calledIdx+1];
	name = name.replace(',','')
	var remainder = line.slice(calledIdx+1)
	var current, location, locations = [];
	while(remainder.length){
		current = remainder.shift();
		location = [];
		while(!_.contains(current, '<')){
			current = remainder.shift()
		}
		while(!_.contains(current, '>')){
			location.push(current)
			current = remainder.shift()
		}
		location.push(current)
		locations.push(location.join(' ').replace(/<|>/g, ''));
	}
	result.things.push({ types, name, locations });
}

function transition(line, result){
	line.shift(); // remove the 'From'
	var first = [], second = [], text = [];
	var typeOrThing;

	var current = line.shift();
	while(!_.contains(current, '>')){
		first.push(current);
		current = line.shift();
	}
	first.push(current);
	line.shift() // remove the 'to'

	current = line.shift();
	while(!_.contains(current, '>')){
		second.push(current);
		current = line.shift();
	}
	second.push(current);

	if(line[0] === 'the'){ line.shift() }

	typeOrThing = line.shift()
	
	current = line.shift();
	while(!_.contains(current, '>')){
		text.push(current);
		current = line.shift();
	}
	text.push(current);
	result.transitions.push({
		from: first.join(' ').replace(/<|>/g, ''),
		to:  second.join(' ').replace(/<|>/g, ''),
		text:  text.join(' ').replace(/<|>/g, ''),
		typeOrThing
	})

}

function compoundType(line, result){
	var referenceName = line[1];
	var baseType = line[line.length-1];
	var addedType = line[line.length-2];
	if(/^a$|^an$/.test(addedType)){
		result.types.push({
			type: 'compound',
			name: referenceName, 
			base: baseType
		})
	} else {
		result.types.push({ 
			type: 'compound',
			name: referenceName, 
			base: baseType, 
			addition: addedType
		})
	}
}

function decorator(line, result){
	var first = line[3];
	if(line.length === 4){
		result.types.push({ type: 'decorator', addition: [first] })
	} else {
		var second = line[7];
		result.types.push({ type: 'decorator', addition: [first, second] })
	}
}

function location(line, result){
	var current = line.shift();
	while(!_.contains(current, '<')){
		current = line.shift();
	}

	var name = [];
	while(!_.contains(current, '>')){
		name.push(current);
		current = line.shift();
	}
	name.push(current)

	result.locations.push({
		name: name.join(' ').replace(/<|>/g, '')
	})
}

function rule(line, result){
	line = line.slice(2);
	var source = [];
	var target = [];
	var encounterText = [];
	var consequenceText = [];

	while(!_.contains(line[0], '<')){
		source.push(line.shift());
	}
	
	while(!_.contains(line[0], '>')){
		encounterText.push(line.shift());
	}
	encounterText.push(line.shift());

	line.shift() // remove a or an
	var consequentA = [];
	var consequentB = [];

	while(line[0] !== 'then'){
		target.push(line.shift());
	}
	line = line.slice(2);

	while(!_.contains(line[0], '<')){
		consequentA.push(line.shift());
	}

	while(!_.contains(line[0], '>')){
		consequenceText.push(line.shift());
	}
	consequenceText.push(line.shift());

	if(line.length){
		line.shift();
		while(line.length){
			consequentB.push(line.shift());
		}
	}
	result.rules.push({
		source: source,
		target: target,
		consequentA: consequentA,
		consequentB: consequentB,
		encounterText: encounterText.join(' ').replace(/\<|\>/g, ''),
		consequenceText: consequenceText.join(' ').replace(/\<|\>/g, '')
	})
}
