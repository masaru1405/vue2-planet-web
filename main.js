Vue.component('price', {
  props: {
    value: Number,
    prefix: {
      type: String,
      default: '$'
    },
    precision: {
      type: Number,
      default: 2
    },
    conversion: {
      type: Number,
      default: 1
    }
  },
  template: `
    <span>{{this.prefix + Number.parseFloat(this.value * this.conversion).toFixed(this.precision)}}</span>
  `
})

Vue.component('product-list', {
  props: ['products', 'maximum'],
  template: `
  <transition-group name="fade" tag="div">
    <div  class="row d-flex mb-3 align-items-center" 
          v-for="(item, index) in products" :key="index"
          v-if="item.price<=Number(maximum)">
        <div class="col-1 m-auto">
          <button class="btn btn-info" @click="$emit('add', item)">+</button>
        </div>
        <div class="col-4">
          <img class="img-fluid d-block" :src="item.image" :alt="item.name">
        </div>
        <div class="col">
          <h3 class="text-info">{{item.name}}</h3>
          <p class="mb-0">{{item.description}}</p>
          <div class="h5 float-right">
              <price
                :value="Number(item.price)">
              </price>
          </div>
        </div>
    </div>
  </transition-group>
  `
})

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
    },

    deleteItem(index){
      if(this.cart[index].qty > 1){
        this.cart[index].qty--
      }else{
        this.cart.splice(index, 1) //splice(à partir da posicao, qtd. de items que serão removidos)
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