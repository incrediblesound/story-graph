export default class Location {
  name: string
  id: number

  constructor(data) {
    this.name = data.name;
    this.id = data.id;
  }
}
