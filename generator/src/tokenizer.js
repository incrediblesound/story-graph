var _ = require('lodash');

module.exports = tokenizer;

function tokenizer(body){
  var tokens = [];
  body = body.split('.');
  _.each(body, function(line){
    line = _.compact(line.split(/\s/));
    if(!line.length) return;

    if(isATypeOrThing(line)){
      if(isATypeDefinition(line)){
        tokens.push({type: 'simple type', line: line });
      } else if(isAPlaceDefinition(line)){
        tokens.push({type: 'location', line: line})
      } else {
        tokens.push({type: 'thing', line: line })
      }
    }
    else if(isATransition(line)){
      tokens.push({type: 'transition', line: line })
    }
    else if(isACompondType(line)){
      tokens.push({type: 'compound type', line: line })
    }
    else if(isATypeDecorator(line)){
      tokens.push({type: 'decorator', line: line })
    }
    else if(isARuleDefinition(line)){
      tokens.push({type: 'rule', line: line })
    } else {
      console.log('Error: no match for line \"'+line.join(' ')+'\".')
    }
  })
  return tokens;
}

function isATypeOrThing(line){
  return (
    line[0] === 'There' &&
    line[1] === 'is' &&
    (line[2] === 'a' || line[2] === 'an')
  )
}

function isATransition(line){
  return (
    line[0] === 'From' &&
    _.includes(line, 'to')
  )
}

function isACompondType(line){
  return (
    (line[0] === 'A' || line[0] === 'An') &&
    line[2] === 'is' &&
    (line[3] === 'a' || line[3] === 'an')
  )
}

function isATypeDecorator(line){
  return (
    line[0] === 'Some' &&
    line[1] === 'things'
  );
}

function isARuleDefinition(line){
  return (
    line[0] === 'If'&&
    (line[1] === 'a' || line[1] === 'an') &&
    _.includes(line, 'then')
  )
}

function isATypeDefinition(line){
  return (
    line[3] === 'type'
  )
}

function isAPlaceDefinition(line){
  return (
    line[3] === 'place'
  )
}