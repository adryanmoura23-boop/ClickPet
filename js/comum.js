/* ==========================================================
   comum.js - Funções usadas em TODAS as páginas do ClickPet
   - Saudação conforme a hora do dia (função temporal)
   - Aviso "aberto/fechado agora" conforme o horário de funcionamento
   - Ano do rodapé atualizado automaticamente
   - Botões de acessibilidade (fonte maior/menor e alto contraste)
   - Máscaras de campos (CPF, telefone, CEP) reaproveitadas nos formulários
   ========================================================== */
'use strict';

/* Horário de funcionamento: dia da semana (0 = domingo) -> [abre, fecha].
   null = fechado o dia todo. */
const HORARIOS = {
  0: null,
  1: [9, 19], 2: [9, 19], 3: [9, 19], 4: [9, 19], 5: [9, 19],
  6: [9, 17]
};

const DIAS_SEMANA = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira',
                     'quinta-feira', 'sexta-feira', 'sábado'];

/* Retorna "Bom dia", "Boa tarde" ou "Boa noite" de acordo com a hora. */
function gerarSaudacao(data) {
  const hora = data.getHours();
  if (hora >= 5 && hora < 12) return 'Bom dia';
  if (hora >= 12 && hora < 18) return 'Boa tarde';
  return 'Boa noite';
}

/* Retorna true se a loja está aberta na data/hora informada. */
function lojaAberta(data) {
  const faixa = HORARIOS[data.getDay()];
  if (!faixa) return false;
  const horaDecimal = data.getHours() + data.getMinutes() / 60;
  return horaDecimal >= faixa[0] && horaDecimal < faixa[1];
}

/* ---------- Máscaras de formulário ---------- */
function somenteDigitos(texto) {
  return String(texto).replace(/\D/g, '');
}

function mascaraCPF(texto) {
  const d = somenteDigitos(texto).slice(0, 11);
  return d.replace(/^(\d{3})(\d)/, '$1.$2')
          .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
          .replace(/\.(\d{3})(\d)/, '.$1-$2');
}

function mascaraTelefone(texto) {
  const d = somenteDigitos(texto).slice(0, 11);
  if (d.length <= 2) return d ? '(' + d : '';
  if (d.length <= 6) return '(' + d.slice(0, 2) + ') ' + d.slice(2);
  if (d.length <= 10) return '(' + d.slice(0, 2) + ') ' + d.slice(2, 6) + '-' + d.slice(6);
  return '(' + d.slice(0, 2) + ') ' + d.slice(2, 7) + '-' + d.slice(7);
}

function mascaraCEP(texto) {
  const d = somenteDigitos(texto).slice(0, 8);
  return d.length > 5 ? d.slice(0, 5) + '-' + d.slice(5) : d;
}

/* Liga uma máscara a um campo: reaplica a cada digitação. */
function aplicarMascara(idCampo, funcaoMascara) {
  const campo = document.getElementById(idCampo);
  if (!campo) return;
  campo.addEventListener('input', function () {
    campo.value = funcaoMascara(campo.value);
  });
}

/* ---------- Atualização da barra superior ---------- */
function atualizarBarraTopo() {
  const agora = new Date();

  const saudacao = document.getElementById('saudacao');
  if (saudacao) {
    saudacao.textContent = gerarSaudacao(agora) + '! Hoje é ' + DIAS_SEMANA[agora.getDay()] + '.';
  }

  const status = document.getElementById('status-loja');
  if (status) {
    const aberta = lojaAberta(agora);
    status.textContent = aberta ? 'Aberto agora' : 'Fechado agora';
    status.className = 'badge ' + (aberta ? 'text-bg-success' : 'text-bg-danger');
  }

  const ano = document.getElementById('ano');
  if (ano) ano.textContent = agora.getFullYear();
}

/* ---------- Acessibilidade: tamanho da fonte e contraste ---------- */
const TAMANHOS_FONTE = [100, 112.5, 125, 150]; /* porcentagens do tamanho padrão */

function guardar(chave, valor) {
  try { localStorage.setItem(chave, valor); } catch (e) { /* ignora se bloqueado */ }
}
function ler(chave) {
  try { return localStorage.getItem(chave); } catch (e) { return null; }
}

function aplicarFonte(indice) {
  const i = Math.max(0, Math.min(TAMANHOS_FONTE.length - 1, indice));
  document.documentElement.style.fontSize = TAMANHOS_FONTE[i] + '%';
  guardar('clickpet_fonte', i);
  return i;
}

function iniciarAcessibilidade() {
  let indice = parseInt(ler('clickpet_fonte'), 10);
  if (isNaN(indice)) indice = 0;
  indice = aplicarFonte(indice);

  const maior = document.getElementById('btn-fonte-maior');
  const menor = document.getElementById('btn-fonte-menor');
  const contraste = document.getElementById('btn-contraste');

  if (maior) maior.addEventListener('click', function () { indice = aplicarFonte(indice + 1); });
  if (menor) menor.addEventListener('click', function () { indice = aplicarFonte(indice - 1); });

  /* Alto contraste: lembra a escolha entre as páginas */
  function definirContraste(ligado) {
    document.body.classList.toggle('alto-contraste', ligado);
    if (contraste) contraste.setAttribute('aria-pressed', String(ligado));
    guardar('clickpet_contraste', ligado ? '1' : '0');
  }
  definirContraste(ler('clickpet_contraste') === '1');
  if (contraste) {
    contraste.addEventListener('click', function () {
      definirContraste(!document.body.classList.contains('alto-contraste'));
    });
  }
}

/* ---------- Inicialização ---------- */
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', function () {
    atualizarBarraTopo();
    setInterval(atualizarBarraTopo, 60000); /* atualiza a cada minuto */
    iniciarAcessibilidade();
  });
}
