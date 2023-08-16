import currency from "currency.js";

//Conversion de numeros
export function strtonumber(num) {
    num = num.replace(/\./g, "").replace(/\$/g, "");
    return currency(num).value;
  }
  
  export function numbertostr(num) {
    return currency(num, {
      //symbol: "$",
      decimal: ",",
      separator: ".",
      precision: 0,
    }).format();
  }