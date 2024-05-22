import './Orders.scss'
import { useContext, useEffect, useState } from 'react';
import { api } from '../../utility/api';
import { Order, Product } from '../../utility/types';
import { OrderContext } from '../../state/OrderContext';

export function Orders(props: { handleSetOrder: any; }) {
  const order = useContext(OrderContext);
  const {handleSetOrder} = props;
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [productList, setProductList] = useState<Product[]>([]);
  const [refetch, setRefetch] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [idFilter, setIdFilter] = useState('');

  useEffect(( )=>{
    let productsPromise = api.get('products');
    let ordersPromise = api.get('orders');

    productsPromise.then(data => data.json()).then(data => setProductList(data))
    ordersPromise.then(data => data.json()).then(data => setOrderList(data))
  },[refetch]);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    let inputs = e.target as HTMLFormElement;
    let customerInput = inputs.querySelector(`input[name="name"]`) as HTMLInputElement;

    if(order.length === 0) {
      alert('You need items in cart to make an order');
    }

    const event = new Date();

    order.forEach(item => {
      const quantityInput = inputs.querySelector(`input[name="${item._id}"]`) as HTMLInputElement;
      api.post('orders', {
        "product_id": item._id,
        "quantity": quantityInput.value,
        "customer": customerInput.value,
        "cost": item.price * parseInt(quantityInput.value),
        "date": event.toISOString()
      }).then(data => {
        console.log(data.json());
      })

      api.put('products', {
        "_id": item._id,
        "quantity": item.quantity - parseInt(quantityInput.value),
      })
    })

    setRefetch(!refetch);
    setOpenForm(!openForm);
    handleSetOrder([]);
  }

  function useFilters():Order[]  {
    let result = orderList.filter(item => item._id.toLowerCase().includes(idFilter.toLowerCase()));

    return result;
  }

  let orders = useFilters().map((item) => {
    return <div className="list_item" key={item._id}>
      <div className="section">Order №: {item._id}</div>
      <div className="section">Product: {productList.find(product => product._id === item.product_id)?.name || "Product Unlisted"}</div>
      <div className="section">Quantity: {item.quantity}</div>
      <div className="section">Total Cost: {item.cost}</div>
      <div className="section">Customer: {item.customer}</div>
    </div>
  })

  let cartItems = order.map(item => {return <div className='cart-item' key={item._id}>
    <div className="section">Product: {item.name} Price: {item.price}</div>
    <label htmlFor={item._id}>Quantity:</label>
    <input
      name={item._id}
      type="number"
      min={1}
      max={item.quantity}
      defaultValue={1}
      required
    />
  </div>})

  return <div className="orders_list">
      <div className="buttons-container">
        <div className="filters-container">
        <input
          className='text-input input'
          type="text"
          value={idFilter}
          placeholder='Search by order number'
          onChange={(e) => setIdFilter(e.target.value)}
        />
      </div>
        <button
          onClick={() => setOpenForm(!openForm)}
          >{openForm ? "Product List" : "Create Order"}</button>
      </div>
      {!openForm 
    ? <div className="list-container">
        {orders}
      </div>
    : 
      <form
      className='order-form'
      onSubmit={handleSubmit}>
        {cartItems}
        <label htmlFor="name">Customer Name:</label>
        <input 
          className='text-input'
          type="text"
          name="name"
          id="name"
          required/>
      <button>Create Order</button>
      </form>
    }
  </div>
}