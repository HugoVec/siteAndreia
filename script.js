// ============ Configuração ============
// Número com DDI + DDD, só dígitos. Ex.: "5511999998888"
const WHATSAPP_NUMBER = "5519997637749";

const DEFAULT_MESSAGE = "Olá! Gostaria de agendar um horário.";
const treatmentMessage = (name) =>
  `Olá! Tenho interesse em ${name} e gostaria de marcar um horário.`;

// ============ Links do WhatsApp ============
document.querySelectorAll("[data-wa]").forEach((el) => {
  const message = el.dataset.treatment
    ? treatmentMessage(el.dataset.treatment)
    : el.dataset.msg || DEFAULT_MESSAGE;
  el.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  el.target = "_blank";
  el.rel = "noopener";
});

// ============ Header ao rolar ============
const header = document.getElementById("header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// ============ Menu mobile ============
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const setMenu = (open) => {
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  nav.classList.toggle("is-open", open);
};
burger.addEventListener("click", () => setMenu(burger.getAttribute("aria-expanded") !== "true"));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

// ============ Fade-in ao entrar na tela ============
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el) => io.observe(el));
} else {
  items.forEach((el) => el.classList.add("is-visible"));
}

// ============ Carrossel (setas + deslize) ============
document.querySelectorAll("[data-carousel]").forEach((carousel) => {
  const track = carousel.querySelector(".carousel__track");
  const prev = carousel.querySelector("[data-dir='-1']");
  const next = carousel.querySelector("[data-dir='1']");

  const step = () => {
    const card = track.firstElementChild;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    return card.getBoundingClientRect().width + gap;
  };
  const update = () => {
    const max = track.scrollWidth - track.clientWidth;
    carousel.classList.toggle("is-static", max <= 4);
    prev.disabled = track.scrollLeft <= 4;
    next.disabled = track.scrollLeft >= max - 4;
  };

  [prev, next].forEach((btn) =>
    btn.addEventListener("click", () => track.scrollBy({ left: Number(btn.dataset.dir) * step(), behavior: "smooth" }))
  );
  track.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
});
