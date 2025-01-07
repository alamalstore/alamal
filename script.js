if (window.matchMedia('(display-mode: standalone)').matches) {
    // الموقع يُعرض كـ "تطبيق ويب"
}
 else {
    // الموقع يُعرض في المتصفح
    window.addEventListener('load', function() {
        if (!window.navigator.standalone) {
            // يمكن إضافة إشعار للمستخدم بتثبيت التطبيق
        }
    });
}

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(() => console.log("Service Worker Registered"))
      .catch((error) => console.error("Service Worker Registration Failed:", error));
  }

// جلب العناصر المضافة للسلة من localStorage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// تحديث عداد السلة في الـ Header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cartCount.textContent = cartItems.length;  // تحديث عدد العناصر في السلة
}

// إضافة المنتجات إلى السلة
function addToCart(productName, productPrice) {
    // إضافة المنتج إلى السلة
    cartItems.push({ name: productName, price: productPrice });
    
    // حفظ السلة في localStorage
    localStorage.setItem('cartItems', JSON.stringify(cartItems));

    // تحديث عداد السلة
    updateCartCount();
}

// عرض المنتجات في الصفحة الرئيسية مع دعم البحث
function displayProducts(products, searchQuery = '') {
    const productContainer = document.querySelector('.product-list');
    productContainer.innerHTML = '';  // مسح المنتجات السابقة

    // تصفية المنتجات بناءً على نص البحث
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filteredProducts.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');
        productDiv.innerHTML = `
            <img src="${product.img}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p>السعر: ${product.price} جنيه</p>
            <button class="add-to-cart" data-product="${product.name}" data-price="${product.price}">أضف إلى السلة</button>
        `;
        productContainer.appendChild(productDiv);
    });

    // إضافة الحدث لكل زر "أضف إلى السلة"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productName = button.getAttribute('data-product');
            const productPrice = parseFloat(button.getAttribute('data-price'));

            // إضافة المنتج إلى السلة
            addToCart(productName, productPrice);
        });
    });
}

// عرض محتويات السلة في صفحة السلة
function displayCart() {
    const cartTableBody = document.getElementById('cart-items-list');
    const totalPriceElement = document.getElementById('cart-total');
    const emptyMessage = document.getElementById('cart-empty-message');
    cartTableBody.innerHTML = '';  // مسح العناصر السابقة
    let totalPrice = 0;

    if (cartItems.length === 0) {
        emptyMessage.style.display = 'block';
        totalPriceElement.style.display = 'none';
        document.getElementById('whatsapp-checkout').style.display = 'none';
    } else {
        emptyMessage.style.display = 'none';
        totalPriceElement.style.display = 'block';
        document.getElementById('whatsapp-checkout').style.display = 'block';

        // عرض المنتجات في السلة
        cartItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price} جنيه</td>
            `;
            cartTableBody.appendChild(row);
            totalPrice += item.price;
        });

        // عرض الإجمالي
        totalPriceElement.textContent = `الإجمالي: ${totalPrice} جنيه`;

        // إنشاء رابط واتساب
        createWhatsAppLink(totalPrice);
    }
}

// إنشاء رابط الشراء عبر واتساب
function createWhatsAppLink(totalPrice) {
    const whatsappButton = document.getElementById('whatsapp-btn');
    const productsText = cartItems.map(item => `${item.name} - ${item.price} ريال`).join('%0A');
    const message = `مرحباً، أرغب في شراء المنتجات التالية:%0A${productsText}%0Aالإجمالي: ${totalPrice} جنيه.`;
    const whatsappUrl = `https://wa.me/249119479189?text=${encodeURIComponent(message)}`;

    // عند الضغط على الزر يتم فتح رابط واتساب
    whatsappButton.onclick = function() {
        window.open(whatsappUrl, '_blank');
    };
}

// تهيئة الصفحة عند تحميلها
document.addEventListener('DOMContentLoaded', function() {
    // قائمة المنتجات
    const productList = [
        
        { name: "لحمة عجالي", price: 13000, img: "img/ei_1735077637290-removebg-preview.jpg", description: "كيلو لحمة عجالي" },
        { name: ".لحمة عجالي", price: 6500, img: "img/ei_1735077637290-removebg-preview.jpg", description: "نص لحمة عجالي" },
        { name: "..لحمة عجالي", price: 3300, img: "img/ei_1735077637290-removebg-preview.jpg", description: "ربع لحمه عجالي" },
        { name: "لحمة ضان", price: 24000, img: "img/meat-3359248_1920 (1).jpg", description: "كيلو لحمة ضان" },
        { name: ".لحمة ضان", price: 12000, img: "img/meat-3359248_1920 (1).jpg", description: "نص لحمة ضان" },
        { name: "..لحمة ضان", price: 6000, img: "img/meat-3359248_1920 (1).jpg", description: "ربع لحمة ضان" },
        { name: "لحمة عجالي مفرومه", price: 15000, img: "img1/2018_5_28_21_59_16_26 (1).jpg", description: "كيلو مفرومه" },
        { name: "لحمة عجالي مفرومه.", price: 7500, img: "img1/2018_5_28_21_59_16_26 (1).jpg", description: "نص كيلو مفرومه" },
        { name: "لحمة عجالي مفرومه..", price: 4000, img: "img1/2018_5_28_21_59_16_26 (1).jpg", description: "ربع كيلو مفرومه" },
        { name: "كبدة عجالي", price: 18000, img: "img1/ei_1734972675443-removebg-preview.jpg", description: "كيلو كبدة عجالي" },
        { name: "كبدة عجالي.", price: 9000, img: "img1/ei_1734972675443-removebg-preview.jpg", description: "نص كبدة عجالي" },
        { name: "كبدة عجالي..", price: 4500, img: "img1/ei_1734972675443-removebg-preview.jpg", description: "ربع كبدة عجالي" },
        { name: "دجاج", price: 12000, img: "img1/9B7AB858-ED5E-45D8-9974-888B513E12CE.jpg", description: "كيلو دجاج" },
        { name: "دجاج.", price: 6000, img: "img1/9B7AB858-ED5E-45D8-9974-888B513E12CE.jpg", description: "نص كيلو دجاج" },
        { name: "بطاطس", price: 5000, img: "img/potato-3440360_1920 (1).jpg", description: "كيلو بطاطس" },
        { name: ".بطاطس", price: 2500, img: "img/potato-3440360_1920 (1).jpg", description: "نص كيلو بطاطس" },
        { name: "بامبي", price: 3500, img: "img/1730965247587.jpg", description: "كيلو بامبي" },
        { name: ".بامبي", price: 1800, img: "img/1730965247587.jpg", description: "نص كيلو بامبي" },
        { name: "باميه", price: 7500, img: "img/image_fx_ 1(4).jpg", description: "كيلو باميه" },
        { name: ".باميه", price: 3800, img: "img/image_fx_ 1(4).jpg", description: "نص كيلو باميه" },
        { name: ".باميه", price: 1900, img: "img/image_fx_ 1(4).jpg", description: "ربع كيلو باميه" },
        { name: "باميه فرك", price: 7500, img: "img/image_fx_ 1(4).jpg", description: "كيلو باميه" },
        { name: ".باميه فرك", price: 3800, img: "img/image_fx_ 1(4).jpg", description: "نص كيلو باميه" },
        { name: ".باميه فرك", price: 1900, img: "img/image_fx_ 1(4).jpg", description: "ربع كيلو باميه" },
        { name: "اسود(بازنجان)", price: 4000, img: "img/image_fx_.jpg", description: "كيلو اسود" },
        { name: "اسود", price: 2000, img: "img/image_fx_.jpg", description: "نص كيلو اسود" },
        { name: "قرع", price: 3500, img: "img/image_fx_ (1) (1).jpg", description: "كيلوه قرع" },
        { name: ".قرع", price: 1750, img: "img/image_fx_ (1) (1).jpg", description: "نص كيلو قرع" },
        { name: "كوزه", price: 3500, img: "img/image_fx_ (2) (1).jpg", description: "كيلو كوسه" },
        { name: ".كوزه", price: 1800, img: "img/image_fx_ (2) (1).jpg", description: "نص كيلو كوسه" },
        { name: "رجله خضره", price: 2000, img: "img1/ei_1731608358596-removebg-preview.jpg", description: " رجله خضره يمكنك الاختيار عدة مرات" },
        { name: "طماطم", price: 7000, img: "img/a-tomato-877019_1920 (1).jpg", description: "كيلو طماطم" },
        { name: ".طماطم", price: 3500, img: "img/a-tomato-877019_1920 (1).jpg", description: "نص كيلو طماطم" },
        { name: "..طماطم", price: 1800, img: "img/a-tomato-877019_1920 (1).jpg", description: "ريع كيلو طماطم" },
        { name: "سلطه", price: 5000, img: "img/vegetables-7662621_1920 (1).jpg", description: "سلطة خضار طازجه" },
        { name: ".سلطه", price: 3000, img: "img/vegetables-7662621_1920 (1).jpg", description: "سلطة خضار طازجه" },
        { name: "شطه", price: 2000, img: "img/1730965302722.jpg", description: "اخضار احسب سعرك" },
        { name: ".شطه", price: 1000, img: "img/1730965302722.jpg", description: "اخضار احسب سعرك" },
        { name: "..شطه", price: 500, img: "img/1730965302722.jpg", description: "اخضار احسب سعرك" },
        { name: ".ليمون", price: 1000, img: "img/ei_1731755591215-removebg-preview.jpg", description: "5حبات ليمون ب" },
        { name: "..ليمون", price: 2000, img: "img/ei_1731755591215-removebg-preview.jpg", description: "10حبات ليمون ب" },
        { name: "بصل أخضر", price: 1000, img: "img/image_fx_ (5).jpg", description: "اخضار احسب سعرك" },
        { name: ".بصل أخضر", price: 2000, img: "img/image_fx_ (5).jpg", description: "اخضار احسب سعرك" },
        { name: "..بصل أخضر", price: 3000, img: "img/image_fx_ (5).jpg", description: "اخضار احسب سعرك" },
        { name: "فلفليه", price: 1000, img: "img/image_fx_ (3) (1).jpg", description: "اخضار احسب سعرك" },
        { name: ".فلفليه", price: 2000, img: "img/image_fx_ (3) (1).jpg", description: "اخضار احسب سعرك" },
        { name: "..فلفليه", price: 3000, img: "img/image_fx_ (3) (1).jpg", description: "اخضار احسب سعرك" },
        { name: "جرجير", price: 1000, img: "img/watercress-4257303_1920 (1).jpg", description: "جرجير طازج" },
        { name: "جزر", price: 2000, img: "img/carrots-673184_1920 (1).jpg", description: "جزر" },
        { name: "خيار", price: 5000, img: "img/cucumber-7259270_1920 (1).jpg", description: "كيلو خيار" },
        { name: ".خيار", price: 2500, img: "img/cucumber-7259270_1920 (1).jpg", description: "نص كيلو خيار" },
        { name: "..خيار", price: 1300, img: "img/cucumber-7259270_1920 (1).jpg", description: "ربع كيلو خيار" },
        { name: "عجور", price: 1000, img: "img/image_fx_ (4).jpg", description: "عجوره واحدة ب" },
        { name: "تفاح", price: 1200, img: "img/ei_1734696807142-removebg-preview.jpg", description: "دسته 12 حبه" },
        { name: "تفاح.", price: 6000, img: "img/ei_1734696807142-removebg-preview.jpg", description: "نص دسته" },
        { name: "تفاح..", price: 3000, img: "img/ei_1734696807142-removebg-preview.jpg", description: "ربع دسته" },
        { name: ".جوافه", price: 5000, img: "img/ei_1734696960682-removebg-preview.jpg", description: "كيلو جوافه" },
        { name: "جوافه", price: 2500, img: "img/ei_1734696960682-removebg-preview.jpg", description: "نص كيلو جوافه" },
        { name: "جوافه.", price: 1300, img: "img/ei_1734696960682-removebg-preview.jpg", description: "ربع كيلو جوافه" },
        { name: "رمان", price: 2000, img: "img/ei_1734697037509-removebg-preview (1).jpg", description: "حبة رمان واحدة" },
        { name: "رمان.", price: 10000, img: "img/ei_1734697037509-removebg-preview (1).jpg", description: "5حبات رمان" },
        { name: "عنب", price: 10000, img: "img/ei_1734696883430-removebg-preview.jpg", description: "نص كيلو" },
        { name: ".عنب", price: 5000, img: "img/ei_1734696883430-removebg-preview.jpg", description: "ربع كيلو" },
        { name: "..عنب", price: 2500, img: "img/ei_1734696883430-removebg-preview.jpg", description: "علبة عنب صغيره" },
        { name: "برتقال", price: 4500, img: "img/ei_1734696846138-removebg-preview.jpg", description: "دستة برتقال" },
        { name: "برتقال.", price: 2300, img: "img/ei_1734696846138-removebg-preview.jpg", description: "نص دسته برتقال" },
        { name: "برتقال..", price: 1200, img: "img/ei_1734696846138-removebg-preview.jpg", description: "ربع دسته برتقال" },
        { name: "جريب", price: 6000, img: "img/ei_1734696921137-removebg-preview.jpg", description: "دستة جريب" },
        { name: "جريب.", price: 3000, img: "img/ei_1734696921137-removebg-preview.jpg", description: "نص دسته" },
        { name: "جريب..", price: 1500, img: "img/ei_1734696921137-removebg-preview.jpg", description: "ربع دسته" },
        { name: "موز", price: 2500, img: "img/ei_1734696989741-removebg-preview.jpg", description: "كيلو موز" },
        { name: "موز.", price: 1300, img: "img/ei_1734696989741-removebg-preview.jpg", description: "نص كيلو موز" },
        { name: "تمر", price: 3000, img: "img/ei_1731587410119-removebg-preview.jpg", description: "ملوة تمر" },
        { name: ".تمر", price: 1500, img: "img/ei_1731587410119-removebg-preview.jpg", description: "نص ملوة تمر" },
        { name: " عيش خبز", price: 500, img: "img/ei_1731751898951-removebg-preview.jpg", description: "4عشات ب يمكنك الاختيار عدة مرات" },
        { name: "عيش", price: 1000, img: "img/ei_1731751898951-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: ".عيش", price: 3000, img: "img/ei_1731751898951-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "..عيش", price: 5000, img: "img/ei_1731751898951-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },      
        { name: "عيش الي", price: 1000, img: "img1/1731701567197.jpg", description: "يمكنك الاختيلر عدة مرات" },
        { name: ".عيش الي", price: 3000, img: "img1/1731701567197.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "..عيش الي", price: 5000, img: "img1/1731701567197.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "دقيق سيقا", price: 2200, img: "img1/ei_1731608054582-removebg-preview.jpg", description: " (كيلو دقيق (انتاج شركة سيقا" },
        { name: "دقيق سمولينا", price: 2200, img: "img1/ei_1734856532272-removebg-preview.jpg", description: "دقيق سمولينا فاخر" },
        { name: "دقيق قمح", price: 4500, img: "img/دقيق (1).jpg", description: "ملوة دقيق قمح" },
        { name: ".دقيق قمح", price: 2300, img: "img/دقيق (1).jpg", description: "نص ملوة دقيق قمح" },
        { name: "دقيق ابيض", price: 4000, img: "img/كيف_يصنع_الطحين (1).jpg", description: "ملوة دقيق ابيض" },
        { name: ".دقيق ابيض", price: 2000, img: "img/كيف_يصنع_الطحين (1).jpg", description: "نص ملوه" },
        { name: "دقيق دخن", price: 5000, img: "img/d567ca79-7448-4f46-b92e-6bafb3135e99.jpg", description: "ملوة دقيق دخن" },
        { name: ".دقيق دخن", price: 2500, img: "img/d567ca79-7448-4f46-b92e-6bafb3135e99.jpg", description: "نص ملوه دقيق دخن" },
        { name: "سكر", price: 2500, img: "img1/ei_1731587279355-removebg-preview.jpg", description: "كيلو سكر" },
        { name: ".سكر", price: 1300, img: "img1/ei_1731587279355-removebg-preview.jpg", description: "نص كيلو سكر" },
        { name: "شوال سكر", price: 12000, img: "img/سكر-كنانه-780x470 (1).jpg", description: "شوال سكر 5كيلو" },
        { name: ".شوال سكر", price: 24000, img: "img/سكر-كنانه-780x470 (1).jpg", description: "شوال سكر 10كيلو" },
        { name: "كبكبي", price: 7000, img: "img1/ei_1731600582219-removebg-preview.jpg", description: "ملوة كبكبي" },
        { name: ".كبكبي", price: 3500, img: "img1/ei_1731600582219-removebg-preview.jpg", description: "نص ملوه كبكبي" },
        { name: "..كبكبي", price: 1800, img: "img1/ei_1731600582219-removebg-preview.jpg", description: "ربع ملوة كبكبي" },
        { name: "عدسيه (بليله)", price: 8500, img: "img/pigean1 (1).jpg", description: "ملوة عدسيه" },
        { name: "عدسيه", price: 4300, img: "img/pigean1 (1).jpg", description: "نص ملوة" },
        { name: "عدسيه", price: 2200, img: "img/pigean1 (1).jpg", description: "ربع ملوة" },
        { name: "فاصوليا", price: 5000, img: "img1/ei_1731592911797-removebg-preview.jpg", description: "كيلو فاصوليا" },
        { name: ".فاصوليا", price: 2500, img: "img1/ei_1731592911797-removebg-preview.jpg", description: " نص كيلو فاصوليا" },
        { name: "..فاصوليا", price: 1300, img: "img1/ei_1731592911797-removebg-preview.jpg", description: "ربع كيلو فاصوليا" },
        { name: "عدس", price: 3600, img: "img1/ei_1731592849739-removebg-preview.jpg", description: "كيلو عدس" },
        { name: ".عدس", price: 1800, img: "img1/ei_1731592849739-removebg-preview.jpg", description: "نص كيلو عدس" },
        { name: "..عدس", price: 900, img: "img1/ei_1731592849739-removebg-preview.jpg", description: "ربع كيلو عدس" },
        { name: "رز", price: 3000, img: "img1/ei_1731592875777-removebg-preview.jpg", description: "كيلو رز" },
        { name: ".رز", price: 1500, img: "img1/ei_1731592875777-removebg-preview.jpg", description: "نص كيلو رز" },
        { name: "..رز", price: 800, img: "img1/ei_1731592875777-removebg-preview.jpg", description: "ربع كيلو رز" },
        { name: "رز كبسه", price: 3000, img: "img/ما-هي-أفضل-أنواع-الأرز.jpg", description: "كيلو رز كبسه" },
        { name: ".رز كبسه", price: 1500, img: "img/ما-هي-أفضل-أنواع-الأرز.jpg", description: "نص كيلو" },
        { name: "..رز كبسه", price: 800, img: "img/ما-هي-أفضل-أنواع-الأرز.jpg", description: "ربع كيلو" },
        { name: "فنكوش", price: 7000, img: "img/ei_1731751812625-removebg-preview.jpg", description: "كيلو فنكوش" },
        { name: "فنكوش.", price: 3500, img: "img/ei_1731751812625-removebg-preview.jpg", description: "نص كيلو" },
        { name: "فنكوش..", price: 1800, img: "img/ei_1731751812625-removebg-preview.jpg", description: "ربع كيلو" },
        { name: "فشار", price: 4000, img: "img/ei_1731751866938-removebg-preview.jpg", description: "كيلو فشار" },
        { name: "فشار", price: 2000, img: "img/ei_1731751866938-removebg-preview.jpg", description: "نص كيلو" },
        { name: "فشار", price: 1000, img: "img/ei_1731751866938-removebg-preview.jpg", description: "ربع كيلو" },
        { name: "شطه حمرا", price: 500, img: "img/1731143405468.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: ".شطه حمرا", price: 1000, img: "img/1731143405468.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "دكوه", price: 500, img: "img/1731143429171.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: ".دكوه", price: 1000, img: "img/1731143429171.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "ويكه", price: 1000, img: "img1/1731608221985.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "بصل", price: 2000, img: "img/onions-1397037_1920 (1).jpg", description: "ملوة بصل" },
        { name: ".بصل", price: 4000, img: "img/onions-1397037_1920 (1).jpg", description: "نص ربع بصل" },
        { name: "..بصل", price: 8000, img: "img/onions-1397037_1920 (1).jpg", description: "ربع بصل" },
        { name: "مرقة دجاج", price: 200, img: "img/ei_1731751480774-removebg-preview.jpg", description: "القطعه الواحدة ب 200" },
        { name: "ثوم", price: 1000, img: "img/garlic-3419544_1280 (1).jpg", description: "يمكنك اختيار الثوم عدة مرات" },
        { name: "كسبره", price: 1000, img: "img1/ei_1731587888826-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "كسبره مسحونه", price: 1000, img: "img1/ei_1731587592367-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "زنجبيل", price: 1000, img: "img/ginger-1960613_1280 (1).jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "زنجبيل مسحون", price: 1000, img: "img/ei_1731587498607-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "قرفه", price: 1000, img: "img1/ei_1731587655490-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "قرنفل", price: 1000, img: "img1/ei_1731587348599-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات(اقل سعر)" },
        { name: "شمار", price: 1000, img: "img1/ei_1731587721125-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "كمون(الحبه السودا)", price: 1000, img: "img1/ei_1731588860551-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "فول", price: 1000, img: "img/hq720.jpg", description: "اختار حسب سعرك" },
        { name: ".فول", price: 2000, img: "img/hq720.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "طعميه", price: 500, img: "img/1731701662444.jpg", description: "حبتين ب100 10حبات ب" },
        { name: ".طعميه", price: 1000, img: "img/1731701662444.jpg", description: "يمكنك الاختيار عدة مرات" },
        { name: "بيض", price: 600, img: "img/ei_1731780353147-removebg-preview.jpg", description: "بيضه واحده ب" },
        { name: "بيض.", price: 3000, img: "img/ei_1731780353147-removebg-preview.jpg", description: "5 بيضه ب" },
        { name: "طقم بيض", price: 14500, img: "img/ei_1731780335724-removebg-preview.jpg", description: "طقم بيض " },
        { name: "زبادي بلدي", price: 1300, img: "img1/1731701612938.jpg", description: "رطل زبادي بلدي" },
        { name: "جبنه", price: 18000, img: "img/ei_1731751456840-removebg-preview.jpg", description: "كيلو جبنه" },
        { name: ".جبنه", price: 9000, img: "img/ei_1731751456840-removebg-preview.jpg", description: "نص كيلو" },
        { name: "..جبنه", price: 4500, img: "img/ei_1731751456840-removebg-preview.jpg", description: "ربع كيلو" },
        { name: "جبنه,", price: 2300, img: "img/ei_1731751456840-removebg-preview.jpg", description: "نص ربع" },
        { name: "جبنه رودس", price: 800, img: "img/ei_1731750070992-removebg-preview.jpg", description: "جبنة رودس يمكنك الاختيار عدة مرات" },    
        { name: "زيتون", price: 8000, img: "img/ei_1731750100103-removebg-preview.jpg", description: "كيلو زيتون" },
        { name: ".زيتون", price: 4000, img: "img/ei_1731750100103-removebg-preview.jpg", description: "نص كيلو زيتون" },
        { name: "زيتون..", price: 2000, img: "img/ei_1731750100103-removebg-preview.jpg", description: "ربع كيلو زيتون" },
        { name: "زيتون مقطع", price: 8000, img: "img/ei_1731750133670-removebg-preview.jpg", description: "كيلو" },
        { name: "زيتون مقطع", price: 4000, img: "img/ei_1731750133670-removebg-preview.jpg", description: "نص كيلو" },
        { name: "زيتون مقطع", price: 2000, img: "img/ei_1731750133670-removebg-preview.jpg", description: "ربع كيلو" },  
        { name: "عصير مانجو", price: 28000, img: "img1/ei_1734797721915-removebg-preview.jpg", description: "عصير مانجو بلومينج حجم كبير" },
        { name: "عصير مانجو.", price: 18000, img: "img1/ei_1734797721915-removebg-preview.jpg", description: "عصير مانجو بلومينج حجم اصغير" },
        { name: "عصير برتقال", price: 28000, img: "img1/ei_1734797854127-removebg-preview.jpg", description: "عصير برتقال بلومينج حجم كبير" },
        { name: "عصير برتقال.", price: 18000, img: "img1/ei_1734797854127-removebg-preview.jpg", description: "عصير برتقال بلومينج حجم اصغير" },
        { name: "عصير اناناس", price: 28000, img: "img1/ei_1734797778852-removebg-preview.jpg", description: "عصير اناناس بلومينج حجم كبير" },
        { name: "عصير اناناس.", price: 18000, img: "img1/ei_1734797778852-removebg-preview.jpg", description: "عصير انانس بلومينج حجم اصغير" },
        { name: "عصير فواكة استوائيه", price: 28000, img: "img1/ei_1734797809199-removebg-preview.jpg", description: "حجم كبير" },
        { name: "عصير فواكة استوائيه.", price: 18000, img: "img1/ei_1734797809199-removebg-preview.jpg", description: "حجم اصغير" },
        { name: "عصير مانجو-", price: 10000, img: "img1/ei_1734856419214-removebg-preview.jpg", description: "حجم اكبر" },
        { name: "عصير مانجو--", price: 8000, img: "img1/ei_1734856419214-removebg-preview.jpg", description: "حجم اقل" },
        { name: "عصير برتقال-", price: 10000, img: "img1/ei_1734856345668-removebg-preview.jpg", description: "حجم اكبر" },
        { name: "عصير برتقال--", price: 8000, img: "img1/ei_1734856345668-removebg-preview.jpg", description: "حجم اقل" },
        { name: "عصير اناناس-", price: 10000, img: "img1/ei_1734856388728-removebg-preview.jpg", description: "حجم اكبر" },
        { name: "عصير اناناس--", price: 8000, img: "img1/ei_1734856388728-removebg-preview.jpg", description: "حجم اقل" },
        { name: " صلصه مجانا", price: 500, img: "img1/ei_1731593282850-removebg-preview.jpg", description: "ظرف صلصله مجانا يمكنك اختيار عدة ظروف" },
        { name: "صلصه", price: 3600, img: "img1/ei_1731600621391-removebg-preview.jpg", description: "علبة صلصة الفراشه" },
        { name: ".صلصه", price: 3600, img: "img1/ei_1731600652049-removebg-preview.jpg", description: "علبة صلصة سعيد" },
        { name: "زيت فول", price: 1000, img: "img1/ei_1731592819883-removebg-preview.jpg", description: " يمكنك الاختيار حسب سعرك او عدة مرات"  },
        { name: ".زيت فول", price: 2000, img: "img1/ei_1731592819883-removebg-preview.jpg", description: "يمكنك الاختيار حسب سعرك او عدة مرات" },
        { name: " زيت تحمير", price: 1000, img: "img1/ei_1731592819883-removebg-preview.jpg", description: "يمكنك الاختيار حسب سعرك او عدة مرات" },
        { name: ".زيت تحمير", price: 2000, img: "img1/ei_1731592819883-removebg-preview.jpg", description: "يمكنك الاختيار حسب سعرك او عدة مرات" },
        { name: "زيت فول-", price: 20000, img: "img1/ei_1734856577503-removebg-preview.jpg", description: "زيت فول نقي" },
        { name: "زيت كنوز", price: 5000, img: "img1/ei_1734807243575-removebg-preview (1).jpg", description: "زيت كنوز" },
        { name: "زيت الوافي", price: 5000, img: "img/1731592288427.jpg", description: "زيت الوافي 900مل" },
        { name: ".زيت الوافي", price: 19000, img: "img1/ei_1731592752318-removebg-preview.jpg", description: "زيت الوافي 4لتر" },
        { name: "خميره", price: 300, img: "img/ei_1731749366170-removebg-preview.jpg", description: "ظرف يمكنك الاختيار عدة مرات" }, 
        { name: "باكنج باودر", price: 800, img: "img1/ei_1731755615723-removebg-preview.jpg", description: "ظرف يمكنك الاختيار عدة مرات" }, 
        { name: "فانليا", price: 800, img: "img/ei_1731752179544-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" }, 
        { name: "نشاء", price: 1000, img: "img/ei_1731752154085-removebg-preview.jpg", description: "يمكنك الاختيار عدة مرات" }, 
        { name: "كستر", price: 800, img: "img1/ei_1731755822410-removebg-preview.jpg", description: "ظرف كستر" },
        { name: "خل ابيض", price: 2500, img: "img/ei_1731751734860-removebg-preview.jpg", description: "خل ابيض" },
        { name: "ملح", price: 300, img: "img/ei_1731587452255-removebg-preview.jpg", description: "ظرف ملح" },
        { name: ".ملح", price: 500, img: "img/ei_1731587452255-removebg-preview.jpg", description: "2 ظرف ملح" },
        { name: "ملح تعبيه", price: 500, img: "img/ei_1731587452255-removebg-preview.jpg", description: " (اقل طلب) يمكنك الاختيار عدة مرات" },
        { name: "لبن كابو", price: 39000, img: "img/ei_1734696590753-removebg-preview.jpg", description: "لبن كابو 2250جرام" },
        { name: "لبن كابو.", price: 19000, img: "img/ei_1734696662520-removebg-preview.jpg", description: "لبن كابو  1000 جرام" },
        { name: "لبن كابو..", price: 4500, img: "img/ei_1734696472444-removebg-preview.jpg", description: "لبن كابو 200 جرام" },
        { name: "لبن بودره", price: 15000, img: "img/أضرار_الحليب_المجفف.jpg", description: "كيلو لبن بودره" },
        { name: "لبن بودره.", price: 7500, img: "img/أضرار_الحليب_المجفف.jpg", description: "نص كيلو" },
        { name: "لبن بودره..", price: 3800, img: "img/أضرار_الحليب_المجفف.jpg", description: "ربع كيلو" },
        { name: "لبن بودره..", price: 1900, img: "img/أضرار_الحليب_المجفف.jpg", description: "نص ربع كيلو" },
        { name: " بن حب", price: 6500, img: "img1/ei_1731587859083-removebg-preview.jpg", description: "بن رطل" },
        { name: " .بن حب", price: 3300, img: "img1/ei_1731587859083-removebg-preview.jpg", description: "بن نص رطل" },
        { name: "..بن حب", price: 1700, img: "img1/ei_1731587859083-removebg-preview.jpg", description: "بن ربع رطل" },
        { name: "بن مسحون", price: 9000, img: "img1/ei_1731587685380-removebg-preview.jpg", description: "رطل بن مسحون" },
        { name: ".بن مسحون", price: 4500, img: "img1/ei_1731587685380-removebg-preview.jpg", description: "نص رطل بن مسحون" },
        { name: "..بن مسحون", price: 2300, img: "img1/ei_1731587685380-removebg-preview.jpg", description: "ربع رطل بن مسحون" },
        { name: "شاي تعبيه", price: 1000, img: "img/ei_1731587544800-removebg-preview (1).jpg", description: "نص ربع" },
        { name: "شاي الغزالتين", price: 2000, img: "img1/ei_1731601395773-removebg-preview (1).jpg", description: "ربع شاي الغزالتين" },
        { name: ".شاي الغزالتين", price: 3800, img: "img1/ei_1731601395773-removebg-preview (1).jpg", description: "نص رطل" },
        { name: "..شاي الغزالتين", price: 7500, img: "img1/ei_1731601395773-removebg-preview (1).jpg", description: "رطل شاي الغزالتين" },
        { name: "شعريه نوبو", price: 1300, img: "img1/ei_1731607995331-removebg-preview.jpg", description: "شعريه نوبو" },
        { name: "مكرونه نوبو", price: 1300, img: "img1/ei_1731607972769-removebg-preview.jpg", description: "مكرونه كوع" },
        { name: "مكرونه اسباجتي", price: 1300, img: "img1/ei_1731608036079-removebg-preview (1).jpg", description: "اسباجتي" },
        { name: "طحنيه تعبيه", price: 8500, img: "img/sweet-3-28-1-2021 (1).jpg", description: "كيلو طحنيه يمكنك الاختيار عدة مرات" },
        { name: ".طحنيه تعبيه", price: 4300, img: "img/sweet-3-28-1-2021 (1).jpg", description: "نص كيلو طحنيه" },
        { name: "..طحنيه تعبيه", price: 2200, img: "img/sweet-3-28-1-2021 (1).jpg", description: "ربع كيلو" },
        { name: "طحنية الوافي", price: 11500, img: "img1/ei_1731607886849-removebg-preview.jpg", description: "حجم كبير" },
        { name: ".طحنية الوافي", price:6000, img: "img/ei_1731750044887-removebg-preview.jpg", description: "حجم وسط" },
        { name: "طحنية الوطنيه", price: 11500, img: "img1/ei_1731607898994-removebg-preview.jpg", description: "حجم كبير" },
        { name: ".طحنية الوطنيه", price: 6000, img: "img1/ei_1731607874744-removebg-preview.jpg", description: "حجم وسط" },
        { name: "مربى", price: 9000, img: "img/ei_1731751511283-removebg-preview.jpg", description: "مربى كبير" },
        { name: ".مربى", price: 4000, img: "img/ei_1731751511283-removebg-preview.jpg", description: "مربى وسط" },
        { name: "..مربى", price: 2000, img: "img/ei_1731751511283-removebg-preview.jpg", description: "مربى صغير" },
        { name: "اندومي ", price: 500, img: "img1/ei_1731780282744-removebg-preview.jpg", description: "اندومي خضار يمكنك الاختيار عدة مرات" },
        { name: "بسكويت", price: 500, img: "img/ei_1731749618851-removebg-preview.jpg", description: "بسكويت جلكوز" },
        { name: "بسكويت.", price: 500, img: "img/ei_1731749667653-removebg-preview.jpg", description: "بسكويت بيك" },
        { name: "بسكويت..", price: 1000, img: "img/ei_1731749498236-removebg-preview.jpg", description: "بسكويت اوريو" },
        { name: "كيكه", price: 500, img: "img/ei_1731749256110-removebg-preview.jpg", description: "كيك السيسي" },
        { name: "ماكس تيلا", price: 10000, img: "img/ei_1731751763920-removebg-preview.jpg", description: "ماكس تيلا حجم كبير" },
        { name: "ماكس تيلا.", price: 4000, img: "img/ei_1731751788838-removebg-preview.jpg", description: "حجم وسط" },
        { name: "ماكس تيلا..", price: 1000, img: "img/ei_1731749310685-removebg-preview.jpg", description: "حجم صغير" },
        { name: "قشطه", price: 2000, img: "img/ei_1731784622818-removebg-preview.jpg", description: "" },
        { name: "صابون غسيل", price: 800, img: "img1/ei_1731749244152-removebg-preview.jpg", description: "صابون غسيل استار" },
        { name: "صابون غسيل.", price: 1000, img: "img/ei_1731749706564-removebg-preview.jpg", description: "صابون غسيل أصيل" },
        { name: "صابون غسيل..", price: 1000, img: "img/ei_1731749562306-removebg-preview.jpg", description: "صابون غسيل الدولار" },
        { name: "صابون جلسرين", price: 1500, img: "img/images (3).jpg", description: "" },
        { name: "صابون جلسرين.", price: 1500, img: "img1/100367-scaled.jpg", description: "" },
        { name: "صابون حمام", price: 2000, img: "img1/ei_1731752022045-removebg-preview.jpg", description: "صابون lux حجم كبير" },
        { name: "صابون حمام.", price: 1500, img: "img1/ei_1731752022045-removebg-preview.jpg", description: "صابون lux حجم وسط" },
        { name: "صابون حمام..", price: 1000, img: "img1/ei_1731752022045-removebg-preview.jpg", description: "صابون lux حجم صغير" },
        { name: "صابون حمام,", price: 1500, img: "img1/ei_1731752048693-removebg-preview.jpg", description: "صابون لايف بوي وسط" },
        { name: ".صابون حمام", price: 1000, img: "img1/ei_1731752048693-removebg-preview.jpg", description: "صابون لايف بوي صغير" },
        { name: "صابون بشرى", price: 3000, img: "img/ei_1731752223655-removebg-preview.jpg", description: "صابون بشرى وسط" },
        { name: "صابون بشرى.", price: 1500, img: "img/ei_1731752223655-removebg-preview.jpg", description: "صابون بشرى صغير" },
        { name: "صابون بشرى..", price: 10000, img: "img1/ei_1734856457993-removebg-preview.jpg", description: "صابون بشرى حجم كبير" },
        { name: "صابون فيبا", price: 2000, img: "img1/ei_1734807182863-removebg-preview.jpg", description: "صابون فيبا الأصلي" },
        { name: " صابون امارلس", price: 1000, img: "img1/ei_1734856612142-removebg-preview.jpg", description: "حجم صغير" },
        { name: "صابون تايد", price: 1000, img: "img1/56f61b10-85f5-4751-ad8b-ebfef721169c.jpg", description: "صابون بودره تايد يمكنك اختيار عدة ظروف" },
        { name: "صابون تعبيه", price: 3000, img: "img/مسحوق+التنظيف+التجاري+بالجملة+بالمصنع+الغسيل+الغسيل+ا_.الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+صابون+المصنع.jpg", description: "كيلو صابون بودره" },
        { name: "صابون تعبيه.", price: 1500, img: "img/مسحوق+التنظيف+التجاري+بالجملة+بالمصنع+الغسيل+الغسيل+ا_.الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+الغسيل+صابون+المصنع.jpg", description: "نص كيلو صابون بودره" },
        { name: "معجون اسنان", price: 3500, img: "img1/ei_1731751974015-removebg-preview.jpg", description: "معجون سنجل حجم كبير" },
        { name: ".معجون اسنان", price: 2000, img: "img1/ei_1731751923147-removebg-preview.jpg", description: "معجون سنجل حجم وسط" },
        { name: "..معجون اسنان", price: 1000, img: "img1/ei_1731751951638-removebg-preview.jpg", description: "معجون سنجل حجم صغير" },
        { name: "معجون اسنان.", price: 1000, img: "img1/ei_1731780314653-removebg-preview.jpg", description: "معجون الغفران" },
        { name: "فرشة اسنان", price: 800, img: "img1/ei_1731751998032-removebg-preview.jpg", description: "ناعم وسط خشن الاختيار بعد ارسال الفاتوره" },
            
    ];

    // عرض المنتجات في الصفحة الرئيسية
    displayProducts(productList);

    // تحديث عداد السلة عند تحميل الصفحة
    updateCartCount();

    // إذا كنا في صفحة السلة، نعرض محتويات السلة
    if (window.location.pathname.includes('cart.html')) {
        displayCart();  // عرض محتويات السلة
    }

    // إضافة مستمع الحدث للبحث
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', function() {
        const searchQuery = searchInput.value.trim();
        displayProducts(productList, searchQuery);  // إعادة عرض المنتجات بناءً على نص البحث
    });
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  deferredPrompt = event;
  const installButton = document.getElementById('install-btn');
  installButton.style.display = 'block'; // عرض الزر

  installButton.addEventListener('click', () => {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      deferredPrompt = null;
    });
  });
});
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    let foodLink = document.getElementById("https://alamalstore.github.io/alamal/food.html");

    if (foodLink) {
        foodLink.addEventListener("click", function(event) {
            window.location.href = "food.html"; // الانتقال فورًا إلى صفحة الأطعمة
        });
    }
});
