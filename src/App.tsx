import { useState } from 'react'
import './App.scss'
import { screens } from './utility/shorthands'
import { OrderContext } from './state/OrderContext';
import { Products } from './components/Products/Products';
import { Orders } from './components/Categories/Orders';

function App() {
  const [currentScreen, setCurrentScreen] = useState(screens.PRODUCTS);
  const [order, setOrder] = useState<Object[]>([]);

  const handleSetOrder = (productOrder: Array<Object>) => {
    console.log(productOrder);
    setOrder(productOrder);
  }

  function displayFunction(screen: string) {
    switch(screen) {
      case screens.PRODUCTS: 
        return <Products handleSetOrder={handleSetOrder}/>
      case screens.CATEGORIES: 
        return <Orders/>
      case screens.ORDERS: 
        return <div>ORDERS</div>
      case screens.PLACE_ORDER: 
        return <div>PLACE_ORDER</div>
      default:
        return <div>Default</div>
    }
  }

  return (
    <OrderContext.Provider value={order}>
      <div className="navigation">
        <button onClick={() => setCurrentScreen(screens.PRODUCTS)}>PRODUCTS</button>
        <button onClick={() => setCurrentScreen(screens.CATEGORIES)}> CATEGORIES</button>
        <button onClick={() => setCurrentScreen(screens.ORDERS)}>ORDERS</button>
      </div>
      {displayFunction(currentScreen)}
    </OrderContext.Provider>
  )
}

export default App
