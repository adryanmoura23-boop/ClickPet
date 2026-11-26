/* ==========================================================
   agendamento.js - Escolha do serviço e agendamento
   Serviços: Banho e Tosa.
   Métodos: tele-busca (buscamos e levamos o pet) ou entrega no local.
   - Calendário (input type="date") com datas válidas (não passadas,
     sem domingo, até 60 dias à frente)
   - Horários gerados conforme o dia da semana e os já ocupados
   - Agendamentos salvos no navegador (localStorage)
   Usa HORARIOS, DIAS_SEMANA e mascaraTelefone de comum.js.
   ========================================================== */
'use strict';

const SERVICOS = {
  banho: { nome: 'Banho', preco: 50 },
  tosa:  { nome: 'Tosa',  preco: 70 }
};
const DIAS_MAXIMOS = 60;          /* até quantos dias à frente se pode agendar */
const CHAVE_AGENDA = 'clickpet_agendamentos';

/* "AAAA-MM-DD" -> Date no fuso local (evita erro de um dia do new Date(string)) */
function dataDeTexto(texto) {
  const p = texto.split('-').map(Number);
  return new Date(p[0], p[1] - 1, p[2]);
}

/* Date -> "AAAA-MM-DD" */
function textoDeData(data) {
  return data.getFullYear() + '-' +
         String(data.getMonth() + 1).padStart(2, '0') + '-' +
         String(data.getDate()).padStart(2, '0');
}

/* "AAAA-MM-DD" -> "DD/MM/AAAA" */
function formatarData(texto) {
  const p = texto.split('-');
  return p[2] + '/' + p[1] + '/' + p[0];
}

/* Verifica se a data escolhida pode receber agendamentos. */
function validarDataAgendamento(texto, agora) {
  if (!texto) return { ok: false, motivo: 'Escolha uma data.' };
  const data = dataDeTexto(texto);
  if (isNaN(data.getTime())) return { ok: false, motivo: 'Data inválida.' };

  const hoje = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate());
  const limite = new Date(hoje);
  limite.setDate(limite.getDate() + DIAS_MAXIMOS);

  if (data < hoje) return { ok: false, motivo: 'Não é possível agendar em uma data que já passou.' };
  if (data > limite) return { ok: false, motivo: 'Só é possível agendar até ' + DIAS_MAXIMOS + ' dias à frente.' };
  if (!HORARIOS[data.getDay()]) return { ok: false, motivo: 'Não abrimos aos domingos. Escolha outro dia.' };
  return { ok: true, motivo: '' };
}

/* Gera a lista de horários (de hora em hora) da data escolhida.
   O último horário começa 1 hora antes de fechar.
   ocupados = lista de "HH:MM" já reservados nesse dia. */
function gerarHorarios(texto, agora, ocupados) {
  const data = dataDeTexto(texto);
  const faixa = HORARIOS[data.getDay()];
  if (!faixa) return [];

  const ehHoje = textoDeData(data) === textoDeData(agora);
  const horarios = [];
  for (let h = faixa[0]; h < faixa[1]; h++) {
    const valor = String(h).padStart(2, '0') + ':00';
    const jaPassou = ehHoje && (h <= agora.getHours());
    const ocupado = (ocupados || []).indexOf(valor) !== -1;
    horarios.push({ valor: valor, disponivel: !jaPassou && !ocupado, ocupado: ocupado });
  }
  return horarios;
}

/* ---------- Armazenamento dos agendamentos ---------- */
function lerAgenda() {
  try { return JSON.parse(localStorage.getItem(CHAVE_AGENDA)) || []; } catch (e) { return []; }
}
function salvarAgenda(lista) {
  try { localStorage.setItem(CHAVE_AGENDA, JSON.stringify(lista)); } catch (e) { /* ignora */ }
}
function horariosOcupados(texto) {
  return lerAgenda().filter(function (a) { return a.data === texto; })
                    .map(function (a) { return a.hora; });
}

/* ---------- Interface ---------- */
function iniciarAgendamento() {
  const form = document.getElementById('form-agendamento');
  if (!form) return;

  const campoData = document.getElementById('data');
  const selectHora = document.getElementById('hora');
  const msgData = document.getElementById('msg-data');
  const blocoEndereco = document.getElementById('bloco-endereco');
  const blocoLocal = document.getElementById('bloco-local');
  const camposEndereco = ['ag-rua', 'ag-numero', 'ag-bairro'].map(function (id) { return document.getElementById(id); });
  const aviso = document.getElementById('aviso-agendamento');

  aplicarMascara('ag-telefone', mascaraTelefone);

  /* Limites do calendário: de hoje até 60 dias à frente */
  const agora = new Date();
  const limite = new Date(agora); limite.setDate(limite.getDate() + DIAS_MAXIMOS);
  campoData.min = textoDeData(agora);
  campoData.max = textoDeData(limite);

  /* Preenche dados do tutor e do pet se o cadastro já foi feito */
  try {
    const cad = JSON.parse(localStorage.getItem('clickpet_cadastro'));
    if (cad) {
      document.getElementById('ag-tutor').value = cad.nome || '';
      document.getElementById('ag-telefone').value = cad.telefone || '';
      document.getElementById('ag-pet').value = cad['pet-nome'] || '';
      document.getElementById('ag-rua').value = cad.rua || '';
      document.getElementById('ag-numero').value = cad.numero || '';
      document.getElementById('ag-bairro').value = cad.bairro || '';
    }
  } catch (e) { /* sem cadastro salvo */ }

  /* Mostra/esconde o endereço conforme o método (tele-busca ou entrega) */
  function atualizarMetodo() {
    const metodo = form.querySelector('input[name="metodo"]:checked');
    const teleBusca = metodo && metodo.value === 'tele-busca';
    blocoEndereco.hidden = !teleBusca;
    blocoLocal.hidden = teleBusca || !metodo;
    camposEndereco.forEach(function (c) { c.required = !!teleBusca; });
  }
  form.querySelectorAll('input[name="metodo"]').forEach(function (r) {
    r.addEventListener('change', atualizarMetodo);
  });
  atualizarMetodo();

  /* Atualiza a lista de horários quando a data muda */
  function atualizarHorarios() {
    selectHora.innerHTML = '<option value="" selected disabled>Escolha um horário</option>';
    campoData.setCustomValidity('');
    msgData.textContent = '';

    const resultado = validarDataAgendamento(campoData.value, new Date());
    if (!resultado.ok) {
      if (campoData.value) {
        campoData.setCustomValidity(resultado.motivo);
        msgData.textContent = resultado.motivo;
      }
      selectHora.disabled = true;
      return;
    }

    const lista = gerarHorarios(campoData.value, new Date(), horariosOcupados(campoData.value));
    let livres = 0;
    lista.forEach(function (h) {
      const op = document.createElement('option');
      op.value = h.valor;
      op.textContent = h.valor + (h.ocupado ? ' (ocupado)' : '');
      op.disabled = !h.disponivel;
      selectHora.appendChild(op);
      if (h.disponivel) livres++;
    });
    selectHora.disabled = livres === 0;
    if (livres === 0) {
      /* Sem horário livre: marca a data como inválida para impedir o envio */
      campoData.setCustomValidity('Não há horários livres neste dia.');
      msgData.textContent = 'Não há horários livres neste dia. Escolha outra data.';
    } else {
      msgData.textContent = livres + ' horário(s) livre(s) em ' +
                            DIAS_SEMANA[dataDeTexto(campoData.value).getDay()] + '.';
    }
  }
  campoData.addEventListener('change', atualizarHorarios);
  atualizarHorarios();

  /* Lista "Meus agendamentos" */
  function mostrarAgenda() {
    const ul = document.getElementById('lista-agendamentos');
    const vazio = document.getElementById('sem-agendamentos');
    const agenda = lerAgenda().sort(function (a, b) { return (a.data + a.hora).localeCompare(b.data + b.hora); });
    ul.innerHTML = '';
    vazio.hidden = agenda.length > 0;
    agenda.forEach(function (a) {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center flex-wrap gap-2';
      const texto = document.createElement('span');
      texto.textContent = SERVICOS[a.servico].nome + ' de ' + a.pet + ' - ' + formatarData(a.data) +
                          ' às ' + a.hora + ' (' + (a.metodo === 'tele-busca' ? 'tele-busca' : 'entrega no local') + ')';
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'btn btn-outline-danger btn-sm';
      botao.textContent = 'Cancelar';
      botao.setAttribute('aria-label', 'Cancelar agendamento de ' + a.pet + ' em ' + formatarData(a.data) + ' às ' + a.hora);
      botao.addEventListener('click', function () {
        salvarAgenda(lerAgenda().filter(function (x) { return x.id !== a.id; }));
        mostrarAgenda();
        atualizarHorarios();
      });
      li.appendChild(texto);
      li.appendChild(botao);
      ul.appendChild(li);
    });
  }
  mostrarAgenda();

  /* Envio do formulário */
  form.addEventListener('submit', function (evento) {
    evento.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      const primeiro = form.querySelector(':invalid');
      if (primeiro) primeiro.focus();
      aviso.className = 'alert alert-danger';
      aviso.textContent = 'Preencha todos os campos obrigatórios para concluir o agendamento.';
      return;
    }
    /* Evita duplo agendamento caso o horário tenha sido ocupado nesse meio tempo */
    if (horariosOcupados(campoData.value).indexOf(selectHora.value) !== -1) {
      aviso.className = 'alert alert-danger';
      aviso.textContent = 'Esse horário acabou de ser ocupado. Escolha outro.';
      atualizarHorarios();
      return;
    }

    /* Segurança extra: o horário precisa estar escolhido */
    if (!selectHora.value) {
      aviso.className = 'alert alert-danger';
      aviso.textContent = 'Escolha um horário disponível.';
      selectHora.focus();
      return;
    }

    const servico = form.querySelector('input[name="servico"]:checked').value;
    const metodo = form.querySelector('input[name="metodo"]:checked').value;
    const novo = {
      id: Date.now(),
      servico: servico,
      metodo: metodo,
      data: campoData.value,
      hora: selectHora.value,
      tutor: document.getElementById('ag-tutor').value,
      telefone: document.getElementById('ag-telefone').value,
      pet: document.getElementById('ag-pet').value
    };
    const agenda = lerAgenda();
    agenda.push(novo);
    salvarAgenda(agenda);

    const preco = SERVICOS[servico].preco.toFixed(2).replace('.', ',');
    aviso.className = 'alert alert-success';
    aviso.textContent = 'Agendamento confirmado! ' + SERVICOS[servico].nome + ' para ' + novo.pet + ' em ' +
                        formatarData(novo.data) + ' (' + DIAS_SEMANA[dataDeTexto(novo.data).getDay()] + ') às ' +
                        novo.hora + ', por ' + (metodo === 'tele-busca' ? 'tele-busca' : 'entrega no local') +
                        '. Valor: R$ ' + preco + '.';
    aviso.focus();

    form.classList.remove('was-validated');
    campoData.value = '';
    atualizarHorarios();
    mostrarAgenda();
  });
}

if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', iniciarAgendamento);
}
