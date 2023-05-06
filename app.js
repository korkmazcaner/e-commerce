const categories = document.querySelector(".categories");
const products = document.querySelector(".products");
const modalWrapper = document.querySelector(".modal-wrapper");
const openBtn = document.querySelector("#open-btn");
const closeBtn = document.querySelector("#close-btn");
const modalList = document.querySelector(".modal-list");
const priceTotal = document.querySelector("#modal-info");

function getCategories() {
  // Veri çekme isteği atma
  fetch("https://api.escuelajs.co/api/v1/categories")
    // Gelen veriyi işleme
    .then((res) => {
      return res.json();
    })
    // işlenen veriyi foreach ile herbir obje için ekrana basma
    .then((obj) => {
      obj.slice(0, 4).forEach((category) => {
        const { image, name } = category;
        //gelen herbir obje için div oluşturma
        const categoryDiv = document.createElement("div");
        //dive class ekleme
        categoryDiv.classList.add("category");
        //divin içerini değiştirme, divin içine bir resim ve yazı eklenmidi böylece.
        categoryDiv.innerHTML = `
          <img src="${image}"/>
          <span>${name}</span>
          `;

        //oluşan divi htmldeki listeye atma
        categories.appendChild(categoryDiv);
      });
    });
}

getCategories();

function getProducts() {
  // Veri çekme isteği atma
  fetch("https://api.escuelajs.co/api/v1/products")
    // Gelen veriyi işleme
    .then((res) => {
      return res.json();
    })
    // işlenen veriyi foreach ile herbir obje için ekrana basma
    .then((obj) => {
      obj.slice(0, 25).forEach((product) => {
        //gelen her bir obje için div oluşturma
        const productDiv = document.createElement("div");
        //dive class ekleme
        productDiv.classList.add("product");

        const image = product.images[0];
        const name = product.title;
        const productCategory = product.category.name;
        const price = product.price;
        const productId = product.id;
        //divin içeriğini oluşturma ve değiştirme.
        productDiv.innerHTML = `
            <div>
            <img src=${image} />
            <span class="product-name">${name}</span></br>
            <span class="product-category">${productCategory}</span>
            </div>
            <div class="product-info">
              <span class="product-price">${price}</span>
              <button class="product-basket" onclick="addToBasket({id:${productId},title:'${name}',price:${price},img:'${image}', amount:1})">Sepet</button>
            </div>
          `;
        //oluşan divi htmldeki div içine ekleme
        products.appendChild(productDiv);
      });
    });
}
getProducts();
//Sepet

let basket = [];
let total = 0;
function addToBasket(product) {
  //sepete parametre olarak gelen elamnı arar
  const foundItem = basket.find((basketItem) => basketItem.id === product.id);

  if (foundItem) {
    //eğer eleamnından varsa bulunan elamnın miktrını arttır
    foundItem.amount++;
  } else {
    //eğer elemandan sepette bulunmadıysa sepete ekle
    basket.push(product);
  }
  console.log(basket);
}

//Sepete eklenenlerin listesi burası html yazdırılan
function getBasket() {
  basket.forEach((basketItem) => {
    const name = basketItem.title;
    const img = basketItem.img;
    const amount = basketItem.amount;
    const price = basketItem.price;
    const itemId = basketItem.id;

    //JS içinde basketItemDİv oluşturuldu
    const basketItemDiv = document.createElement("div");

    //js içinde class verildi
    basketItemDiv.classList.add("basket-item");

    basketItemDiv.innerHTML = `
    <img src=${img} alt="" />
    <h5>${name}</h5>
    <span class="amount">Adet: ${amount}</span>
    <span class="price">${price} $</span>
    <button class="delete" id="delete" onclick="deleteItem(${itemId},${price},${amount})">Sil</button>
  `;

    // elemanı htmldeki listeye gönderme
    modalList.appendChild(basketItemDiv);

    // toplam değişkenini güncelleme
    total += price * amount;
  });
  priceTotal.innerHTML = total;
}

// sepet dizisinden silme fonksiyonu
function deleteItem(id, price, amount) {
  basket = basket.filter((item) => item.id !== id);

  // silinen elemanın fiyatını total'den çıkartma
  total -= price * amount;
  priceTotal.innerHTML = total;
}

// silinen elemanı htmlden kaldırma
modalList.addEventListener("click", (e) => {
  if (e.target.id === "delete") {
    e.target.parentElement.remove();
  }
});

//Sepeti açmamak için
openBtn.addEventListener("click", () => {
  modalWrapper.classList.add("active");
  getBasket();
});

//Sepeti kapatmak için
closeBtn.addEventListener("click", () => {
  modalWrapper.classList.remove("active");
  modalList.innerHTML = "";
});
