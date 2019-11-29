import React, { Component } from 'react'
import { storeProducts, detailProduct} from './data';
const ProductContext = React.createContext();

class ProductProvider extends Component {
    state = {
        products: [],
        detailProduct: detailProduct,
        cart: [],
        isModalOpen: false,
        modalProduct: detailProduct,
        cartSubtotal: 0,
        cartTax: 0,
        cartTotal: 0
    }

    componentDidMount () {
        this.setProducts();
    }

    setProducts = () => {
        let tempProducts = [];
        storeProducts.forEach(item => {
            const singleItem = {...item};
            tempProducts = [...tempProducts, singleItem];
        });
    this.setState(() => {
        return {products: tempProducts}
    });   
    }

    getItem = (id) => {
        const product = this.state.products.find(item => item.id === id);
        return product;
    }

    detailHanlder = (id) => {
        const product = this.getItem(id);
        this.setState({ detailProduct : product });
    }
    addToCart = (id) => {
        const tempProducts = [...this.state.products];
        const index = tempProducts.indexOf(this.getItem(id));
        const product = tempProducts[index];
        product.inCart = true;
        product.count = 1;
        const price = product.price;
        product.total = price;
        this.setState({
            products: tempProducts,
            cart: [...this.state.cart,product]
        }, () => this.addTotals());
        console.log(this.state);
    }

    openModalHandler = id => {
       const product = this.getItem(id);
       this.setState({ modalProduct: product, isModalOpen: true}) 
    }

    closeModal = () => {
        this.setState({ isModalOpen: false })
    }

    increment = (id) => {
        let tempCart = [...this.state.cart];
        const selectedProduct = tempCart.find(item => item.id === id);
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        product.count++;
        product.total = product.count * product.price;
        
        this.setState({
             cart: [...tempCart]   
        }, () => this.addTotals());
        

    }

    decrement = (id) => {
        let tempCart = [...this.state.cart];
        const selectedProduct = tempCart.find(item => item.id === id);
        
        const index = tempCart.indexOf(selectedProduct);
        const product = tempCart[index];
        console.log(product);
        product.count = product.count - 1;
        product.total = product.price * product.count;     
 
        this.setState({ cart: [...tempCart]},
            () => {
                 if(product.count === 0) 
                 this.removeItem(id); 
                 
                 this.addTotals()
              });
    }

    removeItem = id => {
        let tempProducts = [...this.state.products];
        let tempCart = [...this.state.cart];
       
        tempCart = tempCart.filter(item => item.id !== id);
       
        const index = tempProducts.indexOf(this.getItem(id));
        let removedProduct = tempProducts[index];
        removedProduct.inCart = false;
        removedProduct.count = 0;
        removedProduct.total = 0;
        this.setState({
            products: [...tempProducts],
            cart: [...tempCart]
        }, () => {
            this.addTotals();
        });

    }

    clearCart = () => {
        this.setState({cart: []}
            ,() => {
            this.setProducts();
            this.addTotals();
            });
        console.log('cart was cleared');
    }

    addTotals = () => {
        let subTotal = 0;
        this.state.cart.map(item => subTotal += item.total);
        const tempTax = subTotal * 0.1;
        const tax = parseFloat(tempTax.toFixed(2));
        const total = subTotal + tax;
        this.setState({
            cartSubtotal: subTotal,
            cartTax: tax,
            cartTotal: total
        });

    }


    render() {
        return (
            <ProductContext.Provider value={{
                ...this.state,
                detailHanlder: this.detailHanlder,
                addToCart: this.addToCart,
                closeModal: this.closeModal,
                openModalHandler: this.openModalHandler,
                increment: this.increment,
                decrement: this.decrement,
                removeItem: this.removeItem,
                clearCart: this.clearCart
            }}
            >
                {this.props.children}
            </ProductContext.Provider>
        );
    }
}

const ProductConsumer = ProductContext.Consumer;

export {ProductProvider, ProductConsumer };