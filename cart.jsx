// simulate getting products from DataBase


  const products = [
  { name: "Apples:", country: "Italy", cost: 3, instock: 10, id: 0},
  { name: "Oranges:", country: "Spain", cost: 4, instock: 3, id: 2 },
  { name: "Beans:", country: "USA", cost: 2, instock: 5, id: 3 },
  { name: "Cabbage:", country: "USA", cost: 1, instock: 8, id: 4 },
];




//=========Cart=============
const Cart = (props) => {
  const { Card, Accordion, Button } = ReactBootstrap;
  let data = props.location.data ? props.location.data : products;
  console.log(`data:${JSON.stringify(data)}`);

  return <Accordion defaultActiveKey="0">{list}</Accordion>;
};

const useDataApi = (initialUrl, initialData) => {
  const { useState, useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  console.log(`useDataApi called`);
  useEffect(() => {
    console.log("useEffect Called");
    let didCancel = false;
    const fetchData = async () => {
      dispatch({ type: "FETCH_INIT" });
      try {
        const result = await axios(url);
        console.log("FETCH FROM URl");
        if (!didCancel) {
          dispatch({ type: "FETCH_SUCCESS", payload: result.data });
        }
      } catch (error) {
        if (!didCancel) {
          dispatch({ type: "FETCH_FAILURE" });
        }
      }
    };
    fetchData();
    return () => {
      didCancel = true;
    };
  }, [url]);
  return [state, setUrl];
};

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

const Products = (props) => {
  
  const [items, setItems] = React.useState(products);
  const [cart, setCart] = React.useState([]);
  const [total, setTotal] = React.useState(0);
 
  const {
    Card,
    Accordion,
    Button,
    Container,
    Row,
    Col,
    Image,
    Input,
  } = ReactBootstrap;
  //  Fetch Data
  const { Fragment, useState, useEffect, useReducer } = React;
  const [query, setQuery] = useState("http://localhost:1337/api/products");
  const [{ data, isLoading, isError }, doFetch] = useDataApi(
    "http://localhost:1337/api/products",
    {
      data: [],
    }
  );
  console.log(`Rendering Product Component Products ${JSON.stringify(data)}`);


  // Fetch Data
  const addToCart = (e) => {
    let name = e.target.name;
    let item = items.filter((item) => item.name == name);
    let currStock = item[0].instock;

    if (currStock === 0) {
      return;
    }
    currStock = currStock - 1;
    item[0].instock = currStock;
    console.log(`add to Cart ${JSON.stringify(item)}`);
    setCart([...cart, ...item]);
    console.log('Current Stock is: ', currStock);
    doFetch(query);
  };
  const deleteCartItem = (delIndex) => {
    let newCart = cart.filter((item, i) => delIndex != i);
    console.log(newCart);
    let delItem = cart.filter((item, index) => delIndex == index);
    let newStock = items.map((item, index) => {
      if (item.name == delItem[0].name) item.instock = item.instock +1;
        return item;      
    });
    

    setCart(newCart);
    setItems(newStock);
  };

  const restockProducts = (url) => {
    
    let itemIds = items.map((item) => item.id);
    itemIds.forEach(restock);
    

    function restock(item, index){
      let appleStock = 10;
      let orangeStock = 3;
      let beansStock = 5;
      let cabbageStock = 8;
            

      let data = {
        data: {
        id: 0,
        instock: 0
        }
      }
                  
      console.log("RESTOCK CALLED FOR ID: ", item );
      let restockUrl = "http://localhost:1337/api/products" + "/" + item;
      console.log("RESTOCK URL : ", restockUrl );
      if (item===0) {
        data.data.id=0;
        data.data.instock = appleStock
        console.log("Apples restocked - new QTY is: ", data.instock);
        putData(restockUrl, data);
      }
      else if (item===2) {
        data.data.id=2;
        data.data.instock = orangeStock;
        console.log("Oranges restocked - new QTY is: ", data.instock);
        putData(restockUrl, data);
      }
      else if (item===3) {
        data.data.id=3;
        data.data.instock = beansStock;
        console.log("Beans restocked - new QTY is: ", data.instock);
        putData(restockUrl, data);
      }
      else if (item===4){
        data.data.id=4;
        data.data.instock = cabbageStock;
        console.log("Cabbages restocked - new QTY is: ", data.instock);
        putData(restockUrl, data);
      }
      else {
        console.log("A new item needs to be added to the restock code");
      }
        
    };
    loadRestockedItems(query);
      console.log(`Rendering Restocked Products ${JSON.stringify(data)}`);  
  };

  const putData = async (url, content) =>{
    const response = await fetch(url, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(content)
    });
 
   const data = await response.json( );
 

    console.log(content);
    console.log(JSON.stringify(content));
 };


  let list = items.map((item, index) => {
    let n = index + 1049;
    let url = "https://picsum.photos/id/" + n + "/50/50";

    return (
      <li key={index}>
        <Image src={url} width={70} roundedCircle></Image>
        <Button size="large">
          {item.name} ${item.cost} each / {item.instock} in stock
        </Button>
        <input value="Add to cart" name={item.name} type="submit" onClick={addToCart}></input>
      </li>
    );
  });
  let cartList = cart.map((item, index) => {
    return (
      <Accordion.Item className="acitem" key={1+index} eventKey={1 + index}>
      <Accordion.Header className="acheader">
        {item.name}
      </Accordion.Header>
      <Accordion.Body className="acbody" onClick={() => deleteCartItem(index)}
        eventKey={1 + index}>
        $ {item.cost} from {item.country} - click here to remove from cart
      </Accordion.Body>
    </Accordion.Item>
    );
  });

  let finalList = () => {
    let total = checkOut();
    let final = cart.map((item, index) => {
      return (
        <div key={index} index={index}>
          {item.name}
        </div>
      );
    });
    return { final, total };
  };

  const checkOut = () => {
    let costs = cart.map((item) => item.cost);
    const reducer = (accum, current) => accum + current;
    let newTotal = costs.reduce(reducer, 0);
    console.log(`total updated to ${newTotal}`);
    return newTotal;
  };

  const loadRestockedItems = (url) => {;
    doFetch(url);
    let newList = data.data.map((item) => {
     let {name, cost, instock, country} = item.attributes;
     return {name, cost, instock, country};
    })
    setItems([...items, ...newList]);
  }


  return (
    <Container>
      <Row>
        <Col>
          <h2>Available Products</h2>
          <ul style={{ listStyleType: "none" }}>{list}</ul>
        </Col>
        <Col>
          <h2 className="cartheader">Cart Contents</h2>
          <Accordion defaultActiveKey="0">{cartList}</Accordion>
        </Col>
        <Col>
          <h2>CheckOut</h2>
          <Button onClick={checkOut}>CheckOut ${finalList().total}</Button>
          <div> {finalList().total > 0 && finalList().final} </div>
        </Col>
      </Row>
      <Row>
        <form
          onSubmit={(event) => {
            restockProducts(`http://localhost:1337/api/${query}`);
            console.log(`Restock called on ${query}`);
            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <button type="submit">ReStock Products</button>
        </form>
      </Row>
    </Container>
  );
};
// ========================================
ReactDOM.render(<Products />, document.getElementById("root"));
