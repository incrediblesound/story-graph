var _ = require('lodash');

module.exports = tokenizer;

function tokenizer(tokens){

	var result = {
		types: [],
		things: [],
		rules: []
	}

	var parserMap = {
		['simple type']: simpleType,
		['thing']: thing,
		['compound type']: compoundType,
		['decorator']: decorator,
		['rule']: rule
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
	result.things.push({ types: types, name: name });
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

	line = line.slice(2);
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
