const navbar = document.getElementById('navbar');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.getElementById('navLinks');
const yearSpan = document.getElementById('year');
const cartCount = document.getElementById('cartCount');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutModal = document.getElementById('checkoutModal');
const closeCheckout = document.getElementById('closeCheckout');
const checkoutBtn = document.getElementById('checkoutBtn');
const assistantToggle = document.getElementById('assistantToggle');
const assistantPanel = document.getElementById('assistantPanel');
const assistantClose = document.getElementById('assistantClose');
const assistantAnswer = document.getElementById('assistantAnswer');
const nextStepBtn = document.getElementById('nextStep');
const prevStepBtn = document.getElementById('prevStep');
const progressFill = document.getElementById('progressFill');
const steps = Array.from(document.querySelectorAll('.checkout-form .step'));
const addToCartButtons = document.querySelectorAll('.add-to-cart');

let activeStep = 0;
let cart = [];

function updateNavbar() {
  if (!navbar) return;

  const scrollTop = window.scrollY;
  const progress = Math.min(1, Math.max(0, scrollTop / 180));

  navbar.style.setProperty('--nav-progress', progress.toFixed(3));
  navbar.classList.toggle('scrolled', progress > 0.05);
}

function openCart() {
  cartDrawer?.classList.add('open');
  overlay?.classList.add('open');
}

function closeCartDrawer() {
  cartDrawer?.classList.remove('open');
  overlay?.classList.remove('open');
}

function updateCart() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-cart">السلة فارغة حالياً</p>';
    cartTotal.textContent = '0 درهم';
    return;
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  cartTotal.textContent = `${total.toLocaleString('fr-FR')} درهم`;
  cartItems.innerHTML = cart
    .map(
      (item) => `
        <div class="cart-item">
          <div>
            <strong>${item.name}</strong>
            <p>${item.price.toLocaleString('fr-FR')} درهم</p>
          </div>
          <div>
            <button class="icon-btn" data-action="decrease" data-name="${item.name}">−</button>
            <span>${item.quantity}</span>
            <button class="icon-btn" data-action="increase" data-name="${item.name}">+</button>
          </div>
        </div>
      `,
    )
    .join('');
}

function addProductToCart(name, price = 149) {
  const existing = cart.find((item) => item.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCart();
}

function updateCheckoutStep() {
  steps.forEach((step, index) => {
    step.classList.toggle('active', index === activeStep);
  });
  progressFill.style.width = `${((activeStep + 1) / steps.length) * 100}%`;
  prevStepBtn.style.display = activeStep === 0 ? 'none' : 'inline-flex';
  nextStepBtn.textContent = activeStep === steps.length - 1 ? 'إرسال الطلب' : 'التالي';
}

if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

let ticking = false;

window.addEventListener('scroll', () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      updateNavbar();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });

updateNavbar();

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelector('.cart-toggle')?.addEventListener('click', openCart);
closeCart?.addEventListener('click', closeCartDrawer);
overlay?.addEventListener('click', closeCartDrawer);

cartItems?.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-action]');
  if (!button) return;
  const { action, name } = button.dataset;
  const item = cart.find((entry) => entry.name === name);
  if (!item) return;
  if (action === 'increase') item.quantity += 1;
  if (action === 'decrease') {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart = cart.filter((entry) => entry.name !== name);
    }
  }
  updateCart();
});

addToCartButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const productName = button.dataset.product || 'منتج مميز';
    addProductToCart(productName);
    openCart();
  });
});

assistantToggle?.addEventListener('click', () => {
  assistantPanel?.classList.toggle('open');
});

assistantClose?.addEventListener('click', () => {
  assistantPanel?.classList.remove('open');
});

document.querySelectorAll('.assistant-questions button').forEach((button) => {
  button.addEventListener('click', () => {
    const question = button.dataset.question;
    assistantAnswer.textContent = question === 'ما الأفضل للمناعة؟'
      ? 'نوصي بعسل الأزهار البرية؛ فهو غني بالمواد المفيدة ويمنحك تجربة نكهية مميزة.'
      : question === 'هل يناسب الأطفال؟'
        ? 'نعم، لدينا أنواع خفيفة ومريحة مناسبة للاستخدام اليومي مع الأطفال.'
        : 'الفرق يكمن في المصدر واللون والملمس، وكل نوع يروي قصة مختلفة من الطبيعة.';
  });
});

checkoutBtn?.addEventListener('click', () => {
  checkoutModal?.classList.add('open');
  overlay?.classList.add('open');
});

closeCheckout?.addEventListener('click', () => {
  checkoutModal?.classList.remove('open');
  overlay?.classList.remove('open');
});

nextStepBtn?.addEventListener('click', () => {
  if (activeStep < steps.length - 1) {
    activeStep += 1;
    updateCheckoutStep();
  } else {
    alert('تم إرسال الطلب بنجاح. سنعاود التواصل معك قريبًا.');
    checkoutModal?.classList.remove('open');
    overlay?.classList.remove('open');
    activeStep = 0;
    updateCheckoutStep();
  }
});

prevStepBtn?.addEventListener('click', () => {
  if (activeStep > 0) {
    activeStep -= 1;
    updateCheckoutStep();
  }
});

updateCheckoutStep();
