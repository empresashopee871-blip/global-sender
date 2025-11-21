const owner = "empresashopeee871-blip";
const repo = "global-sender";
const filePath = "dados.json";
const token = "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";

let dados = {};
let shaFile = "";

// carregar lista do github
async function carregar() {
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`);
    const j = await r.json();

    shaFile = j.sha;
    dados = JSON.parse(atob(j.content));

    atualizarTela();
}

function atualizarTela() {
    const caixa = document.getElementById("atual");
    caixa.innerText = 
        dados.sms[0] ||
        dados.instagram[0] ||
        dados.facebook[0] ||
        "ACABOU TUDO!";
}

async function salvar() {
    await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            message: "Atualização automática",
            content: btoa(JSON.stringify(dados, null, 2)),
            sha: shaFile
        })
    });
}

// SMS
async function sms() {
    if (!dados.sms.length) return alert("Acabou SMS");
    let n = dados.sms.shift();
    await salvar();
    window.location.href = `sms:${n}?body=${encodeURIComponent(dados.msg)}`;
    atualizarTela();
}

// INSTAGRAM
async function insta() {
    if (!dados.instagram.length) return alert("Acabou Instagram");
    let user = dados.instagram.shift();
    await salvar();
    navigator.clipboard.writeText(dados.msg);
    window.location.href = "instagram://app";
    atualizarTela();
}

// FACEBOOK
async function face() {
    if (!dados.facebook.length) return alert("Acabou Facebook");
    let link = dados.facebook.shift();
    await salvar();
    navigator.clipboard.writeText(dados.msg);
    window.location.href = "fb://";
    atualizarTela();
}

carregar();
