# Shopping-Cart
This is a React project utilizing Bootstrap for some controls and styling and which leverages a Strapi backend to return product information. This project began as an assignment within Module 19 of the MITxPro course that I am taking in which we were asked to "refactor" certain aspects of this project. Within the starter files provided by the course there was no implementation of the restock function, and no implementation of the "remove from cart" functionality. Those items are implemented here within the cart.jsx file. 

# Changes made to the starter files
I implemented the following: 

    * Restock functionality including PUT commands to update the products back to pre-determined levels in the Strapi database
    * Remove from cart functionality
    * Updated styling, background images, control colors, and control text

# Future Roadmap (long term)
The restock functionality at present time simply obtains a list of products from the Strapi database and renders them appended to the existing product list. I really dislike this implementation but the starter files for some reason were provided with the product list at first predefined in a global variable and I did not have enough time to refactor the whole app. 

# Future Roadmap (short term)
I would like to implement the following: 

    1) Have the product list populated from a call to the Strapi database rather than via the constant that was provided in the starter files as a "simulated" load of the products. 
    
    2) Update the restock functionality conditionally depending on the number of items that the stock has been depleted by. i.e. have a given stock for each item that restock will take the 'instock' value back up to. 

    3) Update the Check Out feature to update the stock in the Strapi database to the new values and reset the cart and checkout. 
