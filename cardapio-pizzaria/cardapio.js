const tamanhos = [
  { nome: "Pequena", fatias: 4, sabores: 1 },
  { nome: "Média", fatias: 6, sabores: 2 },
  { nome: "Grande", fatias: 8, sabores: 3 },
  { nome: "Família", fatias: 12, sabores: 4 }
];
const categorias = [
  { id: "promocoes", nome: "Promoções", itens: [
    { nome: "Pepperoni", desc:"Molho de tomate, mussarela e pepperoni fatiado.", precos: [35, 45, 55, 68], foto:"img/pizza-pepperoni.jpg" },
    { nome: "Margherita", desc:"Molho de tomate, mussarela, manjerição e azeite.", precos: [32, 42, 52, 64], foto:"img/pizza-margherita.jpg"},
    { nome: "Promo Calabresa", desc:"Molho de tomate, mussarela, calabresa fatiada, cebola e orégano.", preco: 32.90, foto:"img/pizza-calabresa.jpg" },
    { nome: "Combo Família", desc:"Pizza grande de 2 sabores (Frango + Calabresa) e refrigerante 2L.", preco: 50.90, foto:"img/pizza-frango-calabresa.jpeg"}
  ]},
  { id: "tradicionais", nome: "Tradicionais", itens: [
    { nome: "Mussarela", desc: "Molho de tomate, mussarela e orégano.", precos: [28, 38, 48, 60], foto:"img/pizza-mussarela.jpg"},
    { nome: "Calabresa", desc: "Calabresa fatiada, cebola e orégano.", precos: [30, 40, 50, 62], foto:"img/pizza-calabresa.jpg"},
    { nome: "Portuguesa", desc: "Presunto, ovos, cebola, ervilha e mussarela.", precos: [36, 45, 54, 60], foto:"img/pizza-portuguesa.jpg"},
    { nome: "Frango com Catupiry", desc: "Frango desfiado, mussarela, catupiry original e orégano.", precos: [36, 46, 56, 68], foto: "img/pizza-frango.jpeg"},
    { nome: "Quatro Queijos", desc: "Mussarela, cheddar, parmesão e catupiry", precos: [ 42, 52, 62, 69.90], foto: "img/pizza-4-queijos.jpeg"}
  ]},
   {id: "especiais", nome: "Especiais", itens: [
    { nome: "Camarão", desc: "Molho de tomate, mussarela, camarão e orégano.", precos: [ 39, 50, 60, 70], foto: "img/pizza-camarao.jpeg"},
    { nome: "Sertaneja", desc: "Molho de tomate, mussarela, carne seca desfiada, catupiry e orégano.", precos: [ 42, 54, 62, 74], foto: "img/pizza-sertaneja.jpg"},
    { nome: "Peito de peru com catupiry", desc: "Molho de tomate, mussarela, peito de peru e catupiry.", precos: [ 39, 50, 60, 70], foto: "img/pizza-peito-peru.jpg"},
    { nome: "Queijo coalho e file mignon em tiras", desc: "Molho de tomate, mussarela, queijo colaho e file mignon em tiras.", precos: [ 46, 55, 67, 78], foto: "img/pizza-queijo-coalho.jpg"},
    { nome: "Shimeji e pepperoni", desc: "Molho de tomate, mussarela, pepperoni, shimeji, pimentão e azeite.", precos: [ 48, 56, 68, 79], foto: "img/pizza-shimeji-pepperoni.jpeg"}
  ]},
  { id: "monteasua", nome: "Monte a sua", montar: true, itens: [] },
  { id: "doces", nome: "Doces", itens: [
    { nome: "Dois chocolates", desc: "Metade chocolate com morango, metade chocolate branco com M&M's.", precos: [ 38, 48, 58, 70], foto: "img/pizza-choco.jpeg" },
    { nome: "Chocolate", desc: "Chocolate ao leite e morango frescos.", precos: [ 38, 48, 58, 70], foto: "img/pizza-doce-duo.jpeg" },
    { nome: "Banana nevada", desc: "Banana em rodelas, creme de leite, chocolate branco, merengue e canela.", precos: [ 45, 55, 62, 80], foto: "img/pizza-banana.jpg" },
  ]},
  { id: "calzone", nome: "Calzone", itens: [
    { nome: "Calzone de Pepperoni", desc: "Muito Pepperoni e queijo derretido", preco: 30, foto:"img/calzone-pepperoni.jpg" },
    { nome: "Calzone de Frango com catupiry", desc: "Muito frango com catupiry", preco: 30, foto:"img/calzone-pepperoni.jpg" }
  ]},
   { id: "bebidas", nome: "Bebidas", itens: [
    { nome: "Coca-Cola 1L", desc: "Refrigerante gelado.", preco: 10, foto: "img/coca-cola1l.jpg" },
    { nome: "Guaraná 2L", desc: "Refrigerante gelado.", preco: 12, foto: "img/guarana-2l.jpg"},
    { nome: "Suco de Laranja 500ml", desc: "Natural, sem açúcar.", preco: 8, foto: "img/suco-laranja.jpg" }
  ]}
];

// sabores que podem entrar no "Monte a sua" (pizzas salgadas com tamanho)
const saboresMonte = [];
categorias.forEach(function (cat) {
  if (cat.id === "doces") return;
  cat.itens.forEach(function (item) {
    if (item.precos) saboresMonte.push(item);
  });
});

function brl(v) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function cardItem(item) {
  const foto = item.foto
    ? `<img src="${item.foto}" alt="${item.nome}" class="item-foto">`
    : `<div class="item-foto item-foto-vazia" aria-hidden="true"><i class="bi bi-circle"></i></div>`;

  let seletor = "";
  let precoInicial = item.preco;
  let nomeInicial = item.nome;

  if (item.precos) {
    seletor = `<select class="form-select form-select-sm mb-2 select-tamanho" aria-label="Tamanho de ${item.nome}">` +
      tamanhos.map(function (t, i) {
        return `<option value="${item.precos[i]}" data-tam="${t.nome}" ${i === 1 ? "selected" : ""}>${t.nome} (${t.fatias} fatias) - ${brl(item.precos[i])}</option>`;
      }).join("") +
      `</select>`;
    precoInicial = item.precos[1];
    nomeInicial = `${item.nome} (${tamanhos[1].nome})`;
  }

  return `
    <div class="col-12 col-md-6 mb-3">
      <article class="card item-card h-100">
        <div class="d-flex h-100">
          <div class="flex-grow-1 p-3 d-flex flex-column">
            <h3 class="fs-6 mb-1">${item.nome}</h3>
            <p class="small text-muted flex-grow-1 mb-2">${item.desc}</p>
            ${seletor}
            <p class="price mb-0 preco-item">${brl(precoInicial)}</p>
          </div>
          <div class="position-relative flex-shrink-0 item-foto-wrap">
            ${foto}
            <button class="btn btn-danger rounded-circle btn-add item-add"
              data-base="${item.nome}" data-nome="${nomeInicial}" data-preco="${precoInicial}"
              aria-label="Adicionar ${item.nome} ao carrinho">
              <i class="bi bi-plus-lg" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </article>
    </div>`;
}

function montarHTML() {
  return `
    <article class="card item-card">
      <div class="p-3">
        <p class="small text-muted mb-2">Escolha o tamanho e os sabores. O preço é o do sabor mais caro escolhido.</p>
        <label class="form-label small mb-1" for="monte-tamanho">Tamanho</label>
        <select id="monte-tamanho" class="form-select form-select-sm mb-2">
          ${tamanhos.map(function (t, i) {
            return `<option value="${i}" ${i === 1 ? "selected" : ""}>${t.nome} (${t.fatias} fatias, ${t.sabores} sabor${t.sabores > 1 ? "es" : ""})</option>`;
          }).join("")}
        </select>
        <div id="monte-sabores"></div>
        <p class="price my-2" id="monte-preco"></p>
        <button class="btn btn-danger btn-add" id="monte-add" data-nome="" data-preco="0">Adicionar ao carrinho</button>
      </div>
    </article>`;
}

function montarSabores() {
  const t = tamanhos[Number(document.querySelector("#monte-tamanho").value)];
  let html = "";
  for (let n = 1; n <= t.sabores; n++) {
    html += `<select class="form-select form-select-sm mb-2 monte-sabor" aria-label="Sabor ${n}">` +
      saboresMonte.map(function (s, i) {
        return `<option value="${s.nome}" ${i === n - 1 ? "selected" : ""}>${s.nome}</option>`;
      }).join("") +
      `</select>`;
  }
  document.querySelector("#monte-sabores").innerHTML = html;
}

function atualizarMonte() {
  const idx = Number(document.querySelector("#monte-tamanho").value);
  const t = tamanhos[idx];
  const nomes = [];
  let preco = 0;

  document.querySelectorAll(".monte-sabor").forEach(function (sel) {
    const sabor = saboresMonte.find(function (s) { return s.nome === sel.value; });
    nomes.push(sabor.nome);
    if (sabor.precos[idx] > preco) preco = sabor.precos[idx];
  });

  const botao = document.querySelector("#monte-add");
  botao.dataset.nome = `Monte a sua (${t.nome}): ${nomes.join(" + ")}`;
  botao.dataset.preco = preco;
  document.querySelector("#monte-preco").textContent = brl(preco);
}

const abas = document.querySelector("#abas");
const conteudo = document.querySelector("#conteudo-abas");

categorias.forEach(function (cat, i) {
  abas.innerHTML += `
    <li class="nav-item">
     <a class="nav-link ${i === 0 ? "active" : ""}" href="#${cat.id}">${cat.nome}</a>
    </li>`;

  const corpo = cat.montar
    ? montarHTML()
    : `<div class="row">${cat.itens.map(cardItem).join("")}</div>`;

  conteudo.innerHTML += `
    <section id="${cat.id}" class="categoria mb-4">
     <h2 class="fs-5 mb-3">${cat.nome}</h2>
     ${corpo}
    </section>`;
});

montarSabores();
atualizarMonte();

conteudo.addEventListener("change", function (e) {
  if (e.target.classList.contains("select-tamanho")) {
    const card = e.target.closest(".item-card");
    const botao = card.querySelector(".btn-add");
    const op = e.target.selectedOptions[0];
    botao.dataset.preco = op.value;
    botao.dataset.nome = botao.dataset.base + " (" + op.dataset.tam + ")";
    card.querySelector(".preco-item").textContent = brl(Number(op.value));
  }

  if (e.target.id === "monte-tamanho") {
    montarSabores();
    atualizarMonte();
  }

  if (e.target.classList.contains("monte-sabor")) {
    atualizarMonte();
  }
});
