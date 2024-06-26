const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const phoneWhatsapp = document.getElementById("phone-whatsapp");
const dateValue = document.getElementById("date");
const timeValue = document.getElementById("time");



let cart = [];
phoneWhatsapp.addEventListener("click",function(){
  window.open("https://wa.me/15997011512?text=Olá%20gostaria%20de%20fazer%20um%20pedido%20.","_blank")
});

cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex"
  
});
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
})
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none"
})
menu.addEventListener("click", function (event) {
  
  let parentButton = event.target.closest(".add-to-cart-btn")
  
  if (parentButton) {
    const name = parentButton.getAttribute("data-name")
    const price = parseFloat(parentButton.getAttribute("data-price"))
    
    addToCart(name, price)
  }
});

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name)

  if(existingItem){
    existingItem.quantity += 1;
    return;
  }
  cart.push({
    name,
    price,
    quantity: 1,
  });
  cartCounter.innerHTML = cart.length;
}

function updateCartModal(){
  cartItemsContainer.innerHTML = "";
  let total = 0;
  addressInput.value = ""; 
  dateValue.value = "";
  timeValue.value = "";

  cart.forEach(item =>{
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex","justify-between","mb-4","flex-col")

    cartItemElement.innerHTML =  `
    <div class="flex items-center justify-between" >
      <div>
        <p class="font-medium">${item.name}</P>
        <p>qtd: ${item.quantity}</P>
        <p  class="font-medium mt-2">R$  ${item.price.toFixed(2)}</P>
      </div>
      
      <button class="remove-from-cart-btn" data-name= "${item.name}">
        Remover
      </button>
      

    </div>`
  
  total+= item.price * item.quantity;
  cartItemsContainer.appendChild(cartItemElement)
  })
  cartTotal.textContent = total.toLocaleString("pt-BR",{
    style: "currency",
    currency: "BRL"
  });
  cartCounter.innerHTML = cart.length;
}

cartItemsContainer.addEventListener("click", function(event){
  if(event.target.classList.contains("remove-from-cart-btn")){
    const name = event.target.getAttribute("data-name")
    removeItemCart(name);
  }
})

function removeItemCart(name){
  const index = cart.findIndex(item => item.name === name);

  if(index !== -1){
    const item = cart[index];

    if(item.quantity > 1){
      item.quantity -=1;
      updateCartModal();
      return;
    }

    cart.splice(index,1);
    updateCartModal();
  }
}

addressInput.addEventListener("input", function(event){
  let inputValue = event.target.value;
  if(inputValue !== ""){
    addressInput.classList.remove("border-red-500")
    addressWarn.classList.add("hidden")
  }
})

checkoutBtn.addEventListener("click", function(){
  const isOpen = checkRestaurantOpen();
  if(!isOpen){
    
    Toastify({
      text: "Ops Fechado",
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "right", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
      background: "#ef4444",
      },
    }).showToast()
    
    return;
  }

  if(cart.length === 0)return;
  if(addressInput.value === ""){
    addressWarn.classList.remove("hidden")
    addressInput.classList.add("border-red-500")
    return;
  }

  cartItems = cart.map((item) => {
    return(
          `(  ${item.name}   Quantidade:  ${item.quantity}  Preço: R$ ${item.price} ) |     `
  )
  }).join("")
  
  const message = encodeURIComponent(cartItems);
  const phone = "15997011512";
  const total = cartTotal.textContent;
  const data = dateValue.value;
  const horas = timeValue.value;

  window.open(`https://wa.me/${phone}?text=${message}%20Total:%20${total}%20Endereço: %20${addressInput.value}%20Data da entrega : %20${data}%20Horas : %20${horas}`,"_blank")

  cart =[];
  updateCartModal();
})


function checkRestaurantOpen(){
  const data = new Date();
  const hora = data.getHours();
  return hora >= 8 && hora < 22;

}


const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
  spanItem.classList.remove("bg-red-500")
  spanItem.classList.add("bg-green-600")
}else{
  spanItem.classList.remove("bg-green-600")
  spanItem.classList.add("bg-red-500")
}


