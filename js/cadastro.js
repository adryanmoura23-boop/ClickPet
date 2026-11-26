/* ==========================================================
   cadastro.js - Formulário de cadastro do cliente e do pet
   - Máscaras (CPF, telefone, CEP) vindas de comum.js
   - Validação do CPF (dígitos verificadores) e da idade mínima (18 anos)
   - Validação do formulário com as classes do Bootstrap
   - Contador de caracteres do campo de observações
   - Salva o cadastro no navegador (localStorage) - sem servidor
   ========================================================== */
'use strict';

/* Confere se um CPF é válido (cálculo dos dois dígitos verificadores). */
function validarCPF(texto) {
  const cpf = String(texto).replace(/\D/g, '');
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false; /* ex.: 111.111.111-11 */

  function digito(base, pesoInicial) {
    let soma = 0;
    for (let i = 0; i < base.length; i++) soma += parseInt(base[i], 10) * (pesoInicial - i);
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  }
  const d1 = digito(cpf.slice(0, 9), 10);
  const d2 = digito(cpf.slice(0, 10), 11);
  return d1 === parseInt(cpf[9], 10) && d2 === parseInt(cpf[10], 10);
}

/* Calcula a idade em anos completos a partir de "AAAA-MM-DD". */
function calcularIdade(dataNascimento, hoje) {
  const partes = dataNascimento.split('-').map(Number);
  if (partes.length !== 3 || partes.some(isNaN)) return -1;
  let idade = hoje.getFullYear() - partes[0];
  const fezAniversario = (hoje.getMonth() + 1 > partes[1]) ||
                         (hoje.getMonth() + 1 === partes[1] && hoje.getDate() >= partes[2]);
  if (!fezAniversario) idade--;
  return idade;
}

function iniciarCadastro() {
  const form = document.getElementById('form-cadastro');
  if (!form) return;

  aplicarMascara('cpf', mascaraCPF);
  aplicarMascara('telefone', mascaraTelefone);
  aplicarMascara('cep', mascaraCEP);

  const cpf = document.getElementById('cpf');
  const nascimento = document.getElementById('nascimento');
  const obs = document.getElementById('obs-pet');
  const contador = document.getElementById('contador-obs');

  /* Data de nascimento: não pode ser no futuro */
  const hoje = new Date();
  nascimento.max = hoje.getFullYear() + '-' +
                   String(hoje.getMonth() + 1).padStart(2, '0') + '-' +
                   String(hoje.getDate()).padStart(2, '0');

  /* Validações personalizadas: setCustomValidity marca o campo como inválido */
  function validarCamposEspeciais() {
    cpf.setCustomValidity(validarCPF(cpf.value) ? '' : 'CPF inválido');
    if (nascimento.value && calcularIdade(nascimento.value, new Date()) < 18) {
      nascimento.setCustomValidity('É preciso ter 18 anos ou mais');
    } else {
      nascimento.setCustomValidity('');
    }
  }
  cpf.addEventListener('input', validarCamposEspeciais);
  nascimento.addEventListener('change', validarCamposEspeciais);

  /* Contador de caracteres das observações */
  if (obs && contador) {
    obs.addEventListener('input', function () {
      contador.textContent = obs.value.length + ' / ' + obs.maxLength + ' caracteres';
    });
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    validarCamposEspeciais();

    const aviso = document.getElementById('aviso-cadastro');
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      const primeiro = form.querySelector(':invalid');
      if (primeiro) primeiro.focus();
      aviso.className = 'alert alert-danger';
      aviso.textContent = 'Há campos obrigatórios vazios ou inválidos. Corrija os campos destacados e envie novamente.';
      return;
    }

    /* Monta um objeto com os dados (checkboxes de contato viram lista) */
    const dados = Object.fromEntries(new FormData(form).entries());
    dados.contato = new FormData(form).getAll('contato');
    try { localStorage.setItem('clickpet_cadastro', JSON.stringify(dados)); } catch (e) { /* ignora */ }

    form.reset();
    form.classList.remove('was-validated');
    if (contador) contador.textContent = '0 / ' + obs.maxLength + ' caracteres';
    aviso.className = 'alert alert-success';
    aviso.innerHTML = 'Cadastro de <strong></strong> e do pet <strong></strong> realizado com sucesso! ' +
                      'Agora você já pode <a href="agendamento.html">agendar um serviço</a>.';
    const fortes = aviso.querySelectorAll('strong');
    fortes[0].textContent = dados.nome;
    fortes[1].textContent = dados['pet-nome'];
    aviso.focus();
  });

  form.addEventListener('reset', function () {
    form.classList.remove('was-validated');
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', iniciarCadastro);
}
