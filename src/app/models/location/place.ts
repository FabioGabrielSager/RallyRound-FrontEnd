import {PlaceAddress} from "./placeAddress";
import {Address} from "./address";

export class Place {
  __type: string = "";
  address: PlaceAddress = {} as Address;
  name: string = "";

  getFormattedName(): string {
    let formattedName: string = "";

    if (this.address.adminDistrict) {
      formattedName += `${this.address.adminDistrict}, `;
    }

    if (this.address.adminDistrict2) {
      formattedName += `${this.address.adminDistrict2}, `;
    }

    if (this.address.locality) {
      formattedName += `${this.address.locality}, `;
    }

    if (this.address.neighborhood) {
      formattedName += `${this.address.neighborhood}, `;
    }

    if(this.name) {
      formattedName += this.name;
    }

    if (formattedName.endsWith(", ")) {
      formattedName = formattedName.substring(0, formattedName.lastIndexOf(", "));
    }

    return formattedName;
  }

  constructor(_type: string, address: PlaceAddress, name: string) {
    this.__type = _type;
    this.address = address;
    this.name = name;
  }
}
