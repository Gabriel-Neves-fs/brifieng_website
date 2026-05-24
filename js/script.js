const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY;
const SERVICE_ID = import.meta.env.VITE_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID;

const emailConfigured = Boolean(PUBLIC_KEY && SERVICE_ID && TEMPLATE_ID);
const missingEmailConfigMessage =
  "EmailJS sem credenciais. Configure o .env local ou as variáveis de ambiente na Vercel.";

if (!emailConfigured) {
  console.warn(missingEmailConfigMessage);
}

if (emailConfigured) {
  emailjs.init({ publicKey: PUBLIC_KEY });
}

const state = { objetivo: "", prazo: "", orcamento: "" };

function selectRadio(el, group) {
  document
    .querySelectorAll(`#${group} .radio-opt`)
    .forEach((o) => o.classList.remove("active"));
  el.classList.add("active");
  state[group] = el.dataset.val;
  updateProgress();
}

function toggleOutro(el) {
  const box = document.getElementById("outro-objetivo");
  const isOutro = el.dataset.val === "Outro";
  box.classList.toggle("show", isOutro);
}

function toggleChip(el) {
  el.classList.toggle("active");
  updateProgress();
}

function toggleFuncOutro(el) {
  const box = document.getElementById("outro-func");
  box.classList.toggle("show", el.classList.contains("active"));
}

function toggleChipSingle(el, group) {
  document
    .querySelectorAll(`#${group} .chip`)
    .forEach((c) => c.classList.remove("active"));
  el.classList.add("active");
  updateProgress();
}

function getChips(id) {
  return (
    [...document.querySelectorAll(`#${id} .chip.active`)]
      .map((c) => c.dataset.val)
      .join(", ") || "Não informado"
  );
}
function getVal(id) {
  return document.getElementById(id)?.value?.trim() || "Não informado";
}
function getRadio(group) {
  return state[group] || "Não informado";
}

function updateProgress() {
  const fields = [
    getVal("nome") !== "Não informado",
    getVal("contato") !== "Não informado",
    getRadio("objetivo") !== "Não informado",
    document.querySelectorAll("#funcs .chip.active").length > 0,
    getRadio("prazo") !== "Não informado",
    getRadio("orcamento") !== "Não informado",
  ];
  const pct = (fields.filter(Boolean).length / fields.length) * 100;
  document.getElementById("progressFill").style.width = pct + "%";
}

document.querySelectorAll("input, textarea").forEach((el) => {
  el.addEventListener("input", updateProgress);
});

function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = `toast ${type} show`;
  setTimeout(() => (t.className = "toast"), 3500);
}

function getEmailJSErrorMessage(err) {
  const status = err?.status ? ` (${err.status})` : "";
  const text = err?.text || err?.message || "Erro desconhecido";
  const normalizedText = String(text).toLowerCase();

  if (!emailConfigured) {
    return missingEmailConfigMessage;
  }

  if (err?.status === 422) {
    return "EmailJS 422: confira as variáveis do template, principalmente o campo To Email.";
  }

  if (normalizedText.includes("public key")) {
    return `Public Key do EmailJS inválida${status}.`;
  }

  if (normalizedText.includes("service")) {
    return `Service ID do EmailJS inválido${status}.`;
  }

  if (normalizedText.includes("template")) {
    return `Template ID ou variáveis do template inválidas${status}.`;
  }

  return `Erro ao enviar pelo EmailJS${status}: ${text}`;
}

function montarTexto() {
  const obj = getRadio("objetivo");
  const objOutro = obj === "Outro" ? ` — ${getVal("objetivo_outro")}` : "";
  const funcList = getChips("funcs");
  const funcOutroTexto = document
    .querySelector('#funcs .chip[data-val="Outro"]')
    ?.classList.contains("active")
    ? ` (${getVal("func_outro")})`
    : "";

  return `
BRIEFING — CRIAÇÃO DE SITE
============================

CONTATO
Nome: ${getVal("nome")}
Contato: ${getVal("contato")}
Negócio / Segmento: ${getVal("negocio")}

OBJETIVO DO SITE
${obj}${objOutro}

FUNCIONALIDADES DESEJADAS
${funcList}${funcOutroTexto}

Detalhes sobre funcionalidades:
${getVal("func_desc")}

REFERÊNCIAS E ESTILO
Referência 1: ${getVal("ref1")}
Referência 2: ${getVal("ref2")}
Identidade visual: ${getChips("visual")}

PRAZO E ORÇAMENTO
Prazo: ${getRadio("prazo")}
Orçamento: ${getRadio("orcamento")}

EXTRAS
Domínio / Hospedagem: ${getChips("dominio")}
Observações: ${getVal("obs")}
  `.trim();
}

async function enviarBriefing() {
  if (!emailConfigured) {
    showToast(missingEmailConfigMessage, "error");
    return;
  }

  const nome = getVal("nome");
  const contato = getVal("contato");

  if (nome === "Não informado" || contato === "Não informado") {
    showToast("Preencha pelo menos nome e contato.", "error");
    return;
  }

  const btn = document.getElementById("submitBtn");
  btn.disabled = true;
  btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Enviando...`;

  const texto = montarTexto();
  const negocio = getVal("negocio");
  const assunto = `Novo briefing - ${nome} - ${negocio}`;
  const destinatario = "gabrieldevv01@gmail.com";
  const emailResposta = contato.includes("@")
    ? contato
    : "gabrieldevv01@gmail.com";

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
      from_name: nome,
      name: nome,
      user_name: nome,
      from_email: emailResposta,
      reply_to: emailResposta,
      user_email: emailResposta,
      email: emailResposta,
      contact: contato,
      to_email: destinatario,
      to_name: "Gabriel Neves",
      recipient_email: destinatario,
      recipient: destinatario,
      subject: assunto,
      title: assunto,
      message: texto,
      briefing: texto,
      negocio,
      business: negocio,
      objetivo: getRadio("objetivo"),
      prazo: getRadio("prazo"),
      orcamento: getRadio("orcamento"),
    });
    showToast("Briefing enviado com sucesso! ✓");
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Enviado!`;
  } catch (err) {
    console.error(err);
    showToast(getEmailJSErrorMessage(err), "error");
    btn.disabled = false;
    btn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Enviar briefing`;
  }
}

// Tornar funções globais para onclick inline do HTML
window.selectRadio = selectRadio;
window.toggleOutro = toggleOutro;
window.toggleChip = toggleChip;
window.toggleFuncOutro = toggleFuncOutro;
window.toggleChipSingle = toggleChipSingle;
window.enviarBriefing = enviarBriefing;
