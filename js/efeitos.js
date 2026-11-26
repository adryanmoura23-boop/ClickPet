/* ==========================================================
   efeitos.js - Efeitos visuais do ClickPet
   - Animação de aparecer ao rolar a página (IntersectionObserver)
   - Botão "voltar ao topo"
   Se o visitante preferir menos movimento (configuração do sistema),
   as animações não são usadas e o conteúdo aparece direto.
   ========================================================== */
'use strict';

/* Decide se o botão "voltar ao topo" deve aparecer (após rolar 300 px) */
function deveMostrarBotaoTopo(posicaoRolagem) {
  return posicaoRolagem > 300;
}

function iniciarEfeitos() {
  const reduzMovimento = window.matchMedia &&
                         window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1) Aparecer ao rolar: elementos com a classe "revelar" */
  const alvos = document.querySelectorAll('.card, .passo, .faixa-cta, .beneficio, .quadro');
  if ('IntersectionObserver' in window && !reduzMovimento && alvos.length) {
    document.documentElement.classList.add('js-reveal');
    const observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (entrada) {
        if (entrada.isIntersecting) {
          const el = entrada.target;
          el.classList.add('visivel');
          observador.unobserve(el); /* anima só uma vez */
          /* Depois da animação, tira as classes para o efeito de hover dos cards voltar a funcionar */
          setTimeout(function () { el.classList.remove('revelar', 'visivel'); }, 800);
        }
      });
    }, { threshold: 0.12 });
    alvos.forEach(function (el) { el.classList.add('revelar'); observador.observe(el); });
  }

  /* 2) Botão voltar ao topo */
  const botao = document.getElementById('btn-topo');
  if (botao) {
    window.addEventListener('scroll', function () {
      botao.classList.toggle('visivel', deveMostrarBotaoTopo(window.scrollY));
    }, { passive: true });
    botao.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduzMovimento ? 'auto' : 'smooth' });
      const conteudo = document.getElementById('conteudo');
      if (conteudo) conteudo.focus({ preventScroll: true }); /* leva o foco ao topo para leitores de tela */
    });
  }
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', iniciarEfeitos);
}
