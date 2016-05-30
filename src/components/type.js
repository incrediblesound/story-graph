module.exports = class Type {
  constructor(name) {
    this.types = [name];
  }
  extend(name) {
    return new Type(this.get().concat(name instanceof Type ? name.get() : [name]));
  }
  get() {
    return this.types.slice();
  }
  replace(oldType, newType) {
    this.types[this.types.indexOf(oldType)] = newType;
  }
  add(type) {
    this.types.push(type);
  }
  remove(type) {
    this.types.splice(this.types.indexOf(type), 1);
  }
};
