/* ==========================================================
   inicio.js - Controle do carrossel da página inicial
   O carrossel é do Bootstrap. Aqui adicionamos um botão para
   pausar/retomar a troca automática de slides (acessibilidade).
   ========================================================== */
'use strict';

function iniciarCarrossel() {
  const elemento = document.getElementById('carrossel-inicio');
  const botao = document.getElementById('btn-pausar-carrossel');
  if (!elemento || !botao || typeof bootstrap === 'undefined') return;

  const carrossel = bootstrap.Carousel.getOrCreateInstance(elemento);
  let pausado = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Quem prefere menos movimento começa com o carrossel parado */
  if (pausado) carrossel.pause();

  function atualizarBotao() {
    botao.textContent = pausado ? 'Retomar slides' : 'Pausar slides';
    botao.setAttribute('aria-pressed', String(pausado));
  }
  atualizarBotao();

  botao.addEventListener('click', function () {
    pausado = !pausado;
    if (pausado) carrossel.pause(); else carrossel.cycle();
    atualizarBotao();
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', iniciarCarrossel);
}
