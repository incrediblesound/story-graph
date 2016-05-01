var _ = require('lodash');

module.exports = function(structure){
var result = `var SG = require(\'./src/main.js\');\n
var world = new SG.World();
var Thing = SG.Thing;
var Type = SG.Type;
var c = SG.constants;\n`

result = compileTypes(structure.types, result);
result = compileLocations(structure.locations, result);
result = compileThings(structure.things, result);
result = compileRules(structure.rules, result);
result = compileTransitions(structure.transitions, result)

result += 'var story = world.makeStory(4);\n console.log(story);\n';

return result;

}

// compile all the types
function compileTypes(types, result){
    var funcMap = {
        simple: writeSimpleType,
        compound: writeCompoundType,
        decorator: writeTypeDecorator
    }
    _.each(types, function(data){
        result = funcMap[data.type](data, result);
    })
    return result;
}

function writeSimpleType(data, result){
    result += 'var '+data.name+' = new Type(\''+data.name+'\')\n';
    return result;
}

function writeCompoundType(data, result){
    var typeExpression = `${data.base}.extend('${data.name}')`;
    if(data.additions){
        data.additions.forEach((decorator) => {
            typeExpression = `${decorator}(${typeExpression})`;
        })
    }
    result += 'var '+data.name+' = ';
    result += typeExpression+';\n\n';
    return result;
}

function writeTypeDecorator(data, result){
    _.each(data.addition, function(value){
        result += 'var '+value+' = function(type){\n';
        result += '\treturn type.extend(\''+value+'\');\n}\n\n';
    })
    return result;
}

// compile locations
function compileLocations(data, result){
    _.each(data, (location) => {
        result += 'world.addLocation({ name: \''+location.name+'\' });\n\n';
    })
    return result;
}

//compile transitions
function compileTransitions(data, result){
    _.each(data, function(transition){
        result += 'world.addRule({\n';
        result += '\tcause: {\n';
        result += '\t\ttype: ['+transition.typeOrThing+', c.move_out, \''+transition.from+'\'],\n';
        result += '\t\tvalue: [\'\']\n\t},\n';
        result += '\tconsequent: {\n';
        result += '\t\ttype: [c.source, c.move_in, \''+transition.to+'\'],\n';
        result += '\t\tvalue: [c.source, \''+transition.text+'\', \''+transition.to+'\']\n\t},\n';
        result += '\tisDirectional: true,\n';
        result += '\tmutations: null,\n';
        result += '\tconsequentThing: null\n'
        result += '})\n\n';
    })
    return result;
}

// compile all the things
function compileThings(things, result){
    _.each(things, function(data){
        result += 'var '+data.name+' = new Thing({';
        result += 'type: '+processTypes(data.types)+
                  ', name: \''+data.name+'\''+
                  ', locations: '+JSON.stringify(data.locations)+
                  ' })\n';
        result += 'var '+data.name+' = world.addThing('+data.name+')\n\n';
    })
    return result;
}

// compile all the rules
function compileRules(rules, result){
    _.each(rules, function(rule){
        result += 'world.addRule({\n';
        result += '\tcause: {\n';
        result += '\t\ttype: ['+processTypes(rule.source.slice())+', c.encounter, '+
                   processTypes(rule.target.slice())+'],\n';
        result += '\t\tvalue: [c.source, \''+rule.encounterText+'\', c.target]\n\t},\n';
        result += '\tconsequent: {\n';
        result += '\t\ttype: [],\n';
        var source = matchEntity(rule.consequentA, rule, 'c.source');
        var target = matchEntity(rule.consequentB, rule, 'c.target');
        result += '\t\tvalue: ['+source+', \''+rule.consequenceText+'\''+target+']\n\t},\n';
        result += '\tisDirectional: true,\n';
        result += '\tmutations: null,\n';
        result += '\tconsequentThing: null/*{ type:\'\', name:\'\', members:[c.source,c.target],';
        result += 'lifeTime: 1, initialize: function(world){}}*/\n'
        result += '})\n\n';
    })

    return result;

    function matchEntity(data, rule, position){
        var result;
        if(!data.length){
            return '';
        }
        if(isEqual(data, rule.source) && isEqual(data, rule.target)){
            result = position;
        }
        else if(isEqual(data, rule.source)){
            result = 'c.source'
        } else {
            result = 'c.target'
        }

        if(position === 'c.target'){ result = ', '+result; }

        return result;
    }
}

// helper for printing type decorators
function processTypes(types){
    var result = '', current;
    var tail = '';
    while(types.length > 1){
        current = types.shift();
        result += current+'(';
        tail   += ')';
    }
    return result+types[0]+tail;
}

function isEqual(a, b){
    var result = true;
    _.each(a, function(val, i){
        result = result && (val === b[i]);
    })
    return result;
}
