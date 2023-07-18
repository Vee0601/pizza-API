document.addEventListener('alpine:init', () => {
    Alpine.data('pizzaCartWithAPIWidget', function () {
        return {
            init() {
                axios
                    .get('https://pizza-api.projectcodex.net/api/pizzas')
                    .then((result) => {
                        this.pizzas = result.data.pizzas
                    })
                    .then(() => {
                        return this.createCart();
                    })
                    .then((result) => {
                        this.cartId = result.data.cart_code
                    });

            },
            featuredPizzas(){
                return axios
                .get('https://pizza-api.projectcodex.net/api/pizzas/featured')
            },
            postfeaturedPizzas(){
                return axios
                .post('https://pizza-api.projectcodex.net/api/pizzas/featured')
            },


            createCart() {
                return axios.get('https://pizza-api.projectcodex.net/api/pizza-cart/create?username=' + this.username)

            },

           async showCart() {
                const url = `https://pizza-api.projectcodex.net/api/pizza-cart/${this.cartId}/get`;

                await axios
                    .get(url)
                    .then((result) => {
                        this.cart = result.data;
                    })
                    .catch(err => console.log(err.message));
            },

            pizzaImage(pizza) {
                return `./images/${pizza.size}.png`
            },

            message: '',
            username: '',
            pizzas: [],
            cartId: '',
            cart: { total: 0 },
            CartPayment: '',
            paymentMessage: '',


            add(pizza) {

                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }

                axios
                    .post('https://pizza-api.projectcodex.net/api/pizza-cart/add', params)
                    .then(() => {
                     console.log(this.message)
                        this.message = pizza.flavour + ' added to cart',
                        this.showCart();
                    })
                    .then(()=> {
                        return this.featuredPizzas()
                    })
                    .then(()=> {
                        return this.postfeaturedPizzas()
                    })
                    .catch(err => alert(err));

                //alert(pizza.id)

            },

            remove(pizza) {

                const params = {
                    cart_code: this.cartId,
                    pizza_id: pizza.id
                }

                axios
                    .post('https://pizza-api.projectcodex.net/api/pizza-cart/remove', params)
                    .then(() => {

                        this.showCart(),
                            this.message = pizza.flavour + ' removed from cart';
                    })
                    .catch(err => alert(err));

            },

            payment(cart) {
                const param = {
                    cart_code: this.cartId,
                }

                axios
                    .post('https://pizza-api.projectcodex.net/api/pizza-cart/pay')
                    .then(() => {
                        if (cart.total <= this.CartPayment) {
                            this.paymentMessage = 'Enjoy your pizza'
                            setTimeout(() => {
                                this.paymentMessage = '';
                                this.init
                            }, 4000)
                        }
                        else {
                            this.paymentMessage = 'sorry-not enough money!'
                        }
                    })

            }

        }
    });
})