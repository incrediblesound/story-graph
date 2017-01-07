export default class Type {
  constructor(types) {
    this.types = Array.isArray(types) ? types : [types];
  }
  extend(type) {
    return new Type(this.get().concat(type instanceof Type ? type.get() : [type]));
  }
  get() {
    return this.types.slice();
  }
  replace(oldType, newType) {
    let index = this.types.indexOf(oldType)
    if(index < 0){
      throw new Error(`Tried to replace "${oldType}" in type set not containing ${oldType}.`)
    }
    this.types[index] = newType;
  }
  add(type) {
    this.types.push(type);
  }
  remove(type) {
    this.types.splice(this.types.indexOf(type), 1);
  }
};
