export type Product = {
  "_id": string,
  "name": string,
  "price": number,
  "quantity": number,
  "category_id": string
}

export type Category = {
  "_id": string,
  "name": string,
}

export type Order = {
  "_id": string,
  "product_id": string,
  "quantity": number,
  "customer": string,
  "date": string,
  "cost": number,
}