import {Address} from "./address";
import {Place} from "./place";

export class AddressEntity {
  __type: string = "";
  address: Address = {} as Address;

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

    if (this.address.streetName) {
      formattedName += `${this.address.streetName}, `;
    }

    if (this.address.houseNumber) {
      formattedName += `${this.address.houseNumber}, `;
    }

    if (formattedName.endsWith(", ")) {
      formattedName = formattedName.substring(0, formattedName.lastIndexOf(", "));
    }

    return formattedName;
  }


  constructor(_type: string, address: Address) {
    this.__type = _type;
    this.address = address;
  }
}
