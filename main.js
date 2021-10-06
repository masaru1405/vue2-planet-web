var app = new Vue({
  el: '#app',
  data: {
    maximum: 99,
    sliderStatus: false,
    products: null,
    cart: [] //cart = [{{product}, qty}, {{product}, qty}], lista de objetos, sendo 'product' um objeto proprio
  },

  //https://vuejs.org/v2/guide/filters.html
  filters: {
    currency(value){
      return '$' + Number.parseFloat(value).toFixed(2)
    }
  },
  methods: {
    addItem(product){
      var whichProduct
      var existing = this.cart.filter(function(item, index){
        if(item.product.id == Number(product.id)){
          whichProduct = index
          return true
        }else{
          return false
        }
      })

      if(existing.length){
        this.cart[whichProduct].qty++
      }else{
        this.cart.push({product: product, qty: 1})
      }
    }
  },
  computed: {
    cartTotal(){
      let sum = 0
      for (i in this.cart){
        sum += this.cart[i].product.price * this.cart[i].qty
      }
      return sum
    },
    
    cartQty(){
      let qty = 0
      for(i in this.cart){
        qty += this.cart[i].qty
      }
      return qty
    }
  },
  mounted(){
    fetch('https://hplussport.com/api/products/order/price')
    .then(response => response.json())
    .then(data => {
      this.products = data
    })
  }
})