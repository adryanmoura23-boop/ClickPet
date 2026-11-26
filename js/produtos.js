/* ==========================================================
   produtos.js - Filtro de produtos por categoria
   Cada card tem o atributo data-categoria (alimentacao, higiene, brinquedos).
   Os botões do filtro têm data-filtro com o mesmo valor (ou "todos").
   ========================================================== */
'use strict';

function iniciarFiltroProdutos() {
  const botoes = document.querySelectorAll('[data-filtro]');
  const cards = document.querySelectorAll('[data-categoria]');
  const resultado = document.getElementById('resultado-filtro');
  if (!botoes.length) return;

  botoes.forEach(function (botao) {
    botao.addEventListener('click', function () {
      const filtro = botao.getAttribute('data-filtro');
      let visiveis = 0;

      cards.forEach(function (card) {
        const mostrar = filtro === 'todos' || card.getAttribute('data-categoria') === filtro;
        card.hidden = !mostrar;
        if (mostrar) visiveis++;
      });

      botoes.forEach(function (b) {
        const ativo = b === botao;
        b.classList.toggle('btn-clickpet', ativo);
        b.classList.toggle('btn-outline-secondary', !ativo);
        b.setAttribute('aria-pressed', String(ativo));
      });

      /* Região aria-live: leitores de tela anunciam o resultado do filtro */
      resultado.textContent = 'Exibindo ' + visiveis + ' produto(s).';
    });
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', iniciarFiltroProdutos);
}
