export default class Type {
  types: string[];

  constructor(types) {
    this.types = Array.isArray(types) ? types : [types];
  }
  extend(type) {
    const newType = type instanceof Type ? type.get() : [type];
    const currentTypes = this.get();
    const nextTypes = [ ...currentTypes, ...newType ];
    return new Type(nextTypes);
  }
  get() {
    return this.types.slice();
  }
  replace(oldType, newType) {
    const index = this.types.indexOf(oldType)
    if (index < 0) {
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
}
