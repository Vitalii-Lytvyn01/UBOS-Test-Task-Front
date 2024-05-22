import './Categories.scss';
import { useContext, useEffect, useState } from 'react';
import { api } from '../../utility/api';
import { Category, Product } from '../../utility/types';

export function Categories() {
  const [categoryList, setCategoryList] = useState<Category[]>([]);
  const [refetch, setRefetch] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [actionCategory, setActionCategory] = useState("Edit");
  const [editCategory, setEditCategory] = useState<Category>();
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    console.log('useEffect');
    let categoriesPromise = api.get('categories');

    categoriesPromise.then(data => data.json()).then(data => setCategoryList(data))
  },[refetch])

  function handleOpenEdit(item: Category | undefined, action: string) {
    setOpenForm(!openForm);
    setActionCategory(action);
    setEditCategory(item);
  }

  function useFilters():Category[]  {
    let result = categoryList.filter(item => item.name.toLowerCase().includes(nameFilter.toLowerCase()));

    return result;
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    let inputs = e.target as HTMLFormElement;
    const nameInput = inputs.querySelector('input[name="name"]') as HTMLInputElement;

    switch(actionCategory) {
      case "Add": 
        api.post("categories", {
          "name": nameInput.value,
        }).then(data => {
          console.log(data.json());
          setRefetch(!refetch);
          handleOpenEdit(undefined, "Add");
        })
        break;
      case "Edit":
        api.put("categories", {
          "name": nameInput.value,
          "_id": editCategory?._id
        }).then(data => {
          console.log(data.json());
          setRefetch(!refetch);
          handleOpenEdit(undefined, "Edit");
        })
        break;
      default: 
        break;
    }
  }

  let categories = useFilters().map(item => {
    return <div className="list_item" key={item._id}>
      <div className="list_item__name">
        Name: {item.name}
      </div>
      <button
        onClick={() => handleOpenEdit(item, "Edit")}
      >Edit</button>
    </div>
  })

  return <div className="categories_list">
    <div className="buttons-container">
      <div className="filters-container">
        <input
          className='text-input input'
          type="text"
          value={nameFilter}
          placeholder='Search by name'
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>
      <button
        onClick={() => handleOpenEdit(undefined,"Add")}
        >{openForm ? "Product List" : "Add Product"}</button>
    </div>
    {!openForm 
    ? <div className="list-container">
        {categories}
      </div>
    : 
      <form
      className='category-form'
      onSubmit={handleSubmit}>
        <label htmlFor="name">Product Name:</label>
        <input 
          className='text-input'
          type="text"
          name="name"
          id="name"
          defaultValue={editCategory ? editCategory.name : undefined}
          required/>
      <button>{actionCategory} Category</button>
      </form>
    }
  </div>
}
