import './Products.scss';
import { useContext, useEffect, useState } from 'react';
import { api } from '../../utility/api';
import { Category, Product } from '../../utility/types';
import { OrderContext } from '../../state/OrderContext';

export function Products(props: { handleSetOrder: any; }) {
  const order = useContext(OrderContext);
  const {handleSetOrder} = props;
  const [productList, setProductList] = useState<Product[]>([]);
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [refetch, setRefetch] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [actionCategory, setActionCategory] = useState("Edit");
  const [editProduct, setEditProduct] = useState<Product>();

  useEffect(() => {
    console.log('useEffect');
    let productsPromise = api.get('products');
    let categoriesPromise = api.get('categories');

    productsPromise.then(data => data.json()).then(data => setProductList(data))
    categoriesPromise.then(data => data.json()).then(data => setCategoryList(data))
  },[refetch]);

  function handleAddToOrder(product: Product) {
    if(order.findIndex(item => item._id === product._id) === -1) {
      handleSetOrder([...order, product]);
    }
  }

  function handleOpenEdit(product: Product | undefined, action: string) {
    setOpenForm(!openForm);
    setActionCategory(action);
    setEditProduct(product);
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    let inputs = e.target as HTMLFormElement;
    const nameInput = inputs.querySelector('input[name="name"]') as HTMLInputElement;
    const priceInput = inputs.querySelector('input[name="price"]') as HTMLInputElement;
    const quantityInput = inputs.querySelector('input[name="quantity"]') as HTMLInputElement;
    const categoryInput = inputs.querySelector('select[name="category"]') as HTMLInputElement;

    switch(actionCategory) {
      case "Add": 
        api.post("products", {
          "name": nameInput.value,
          "price": priceInput.value,
          "quantity": quantityInput.value,
          "category_id": categoryInput.value,
        }).then(data => {
          console.log(data.json());
          setRefetch(!refetch);
          handleOpenEdit(undefined, "Add");
        })
        break;
      case "Edit":
        api.put("products", {
          "name": nameInput.value,
          "price": priceInput.value,
          "quantity": quantityInput.value,
          "category_id": categoryInput.value,
          "_id": editProduct?._id
        }).then(data => {
          console.log(data.json());
          setRefetch(!refetch);
          handleOpenEdit(undefined, "Add");
        })
        break;
      default: 
        break;
    }
  }

  const products = productList.map(item => 
  <div 
    className='list_item'
    key={item._id}
  >
    <div className="list_item__name">{item.name}</div>
    <div className="list_item__info">
      <div className="info__quantity">Quantity: {item.quantity}</div>
      <div className="info__price">Price: {item.price}$</div>
    </div>
    <div className="list_item__category">Category: {categoryList.find(cat => cat._id == item.category_id)?.name || 'No Category'}</div>
    <div className="list_item__buttons-container">
      <button
        onClick={() => handleAddToOrder(item)}
      >Add to Order</button>
      <button
        onClick={() => handleOpenEdit(item, "Edit")}
      >Edit</button>
    </div>
  </div>)

  return <div className="products_list">
      <div className="buttons-container">
        <button
          onClick={() => handleOpenEdit(undefined,"Add")}
          >{openForm ? "Product List" : "Add Product"}</button>
      </div>
      {!openForm 
      ? <div className="list-container">
          {products}
        </div>
      : 
       <form
        className='product-form'
        onSubmit={handleSubmit}>
        <label htmlFor="name">Product Name:</label>
        <input 
          className='text-input'
          type="text"
          name="name"
          id="name"
          defaultValue={editProduct ? editProduct.name : undefined}
          required/>
        <label htmlFor="price">Product Price:</label>
        <input 
         className='text-input'
          type="number"
          name="price" 
          id="price"
          step=".01"
          defaultValue={editProduct ? editProduct.price : undefined}
          required
        />
        <label htmlFor="quantity">Product Quantity:</label>
        <input 
          className='text-input'
          type="number"
          name="quantity" 
          id="quantity"
          defaultValue={editProduct ? editProduct.quantity : undefined}
          required
        />
        <label htmlFor="category">Product Category:</label>
        <select 
          className='text-input'
          name="category"
          id="category"
          required>
            {categoryList.map(item => <option selected={editProduct?.category_id === item._id} value={item._id}>{item.name}</option>)}
        </select>
        <button>{actionCategory} Product</button>
       </form>
      }
    </div>
}