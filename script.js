
        let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

        const contador = document.querySelector("#cart-count");
        const lista = document.querySelector("#carrinho-lista");
        const totalEl= document.querySelector("#carrinho-total");
        const botoes = document.querySelectorAll(".btn-add");

         
        function formatar(valor) {
            return valor.toLocaleString("pt-BR", {
                style: "currency", currency:"BRL"});
        }
         
        function atualizarTela() {
            let total = 0;
            let quantidade = 0;
            let html = "";
        

        carrinho.forEach(function(item,posicao){
            total +=item.preco * item.qtd;
            quantidade += item.qtd;
        
            html += `
            <div class="d-flex justify-content-between align-items-center border-bottom py-2">
               <div>
                <div class="fw-semibold">${item.nome}</div>
                <small class="text-muted">${formatar(item.preco)} cada</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                <button class="btn btn-outline-secondary btn-sm" data-acao="menos" data-pos="${posicao}" aria-label="Diminuir ${item.nome}"><i class="bi bi-dash-lg" aria-hidden="true"></i>
                </button>
                <span>${item.qtd}</span>
                <button class="btn btn-qtd btn-sm" data-acao="mais" data-pos="${posicao}" aria-label="Aumentar ${item.nome}"><i class="bi bi-plus-lg" aria-hidden="true"></i>
                </button>
                </div>
            </div>`;
        });

        if (carrinho.length === 0) {
            html = '<p class="text-muted mb-0">Seu carrinho está vazio</p>';
        }

        lista.innerHTML = html;
        totalEl.textContent = formatar(total);
        contador.textContent = quantidade;
        localStorage.setItem("carrinho", JSON.stringify(carrinho));
    }

        const toastEl = document.querySelector("#toastAdd");
        const toastTexto = document.querySelector("#toastAddTexto");

        botoes.forEach(function(botao) {
            botao.addEventListener("click", function () {
               const nome = botao.dataset.nome;
               const preco = Number(botao.dataset.preco);

               const existente = carrinho.find(function (item){
                return item.nome === nome;
               });

               if (existente) {
                existente.qtd++;
               } else {
                carrinho.push({ nome: nome, preco: preco, qtd: 1});
               }

               atualizarTela();

               toastTexto.textContent = nome + " adicionado ao carrinho";
               bootstrap.Toast.getOrCreateInstance(toastEl).show();

               contador.classList.remove("badge-pulo");
               void contador.offsetWidth;
               contador.classList.add("badge-pulo");
            });
        });

        lista.addEventListener("click", function (e){
            const botao = e.target.closest("button");
            if (!botao) return;

            const posicao = Number(botao.dataset.pos);

            if (botao.dataset.acao === "mais") {
                carrinho[posicao].qtd++;
            } else if (botao.dataset.acao === "menos") {
                carrinho[posicao].qtd--;
               if (carrinho[posicao].qtd === 0){
                carrinho.splice(posicao, 1);
            }
        }

           atualizarTela();
        });
        
           atualizarTela();
        
    // ----- Horário da loja (tempo real) ------//

    const aviso = document.querySelector("#aviso-loja");

    function atualizarHorario() {
        const agora = new Date();
        const dia = agora.getDay();
        const hora = agora.getHours();

        if (dia !== 1 && hora >= 18) {
        aviso.className = "alert alert-success py-2 px-3 my-3";
        aviso.textContent = "Loja aberta · funcionamos até 23h59";
    } else if (dia === 1) {
        aviso.className = "alert alert-warning py-2 px-3 my-3";
        aviso.textContent = "Loja fechada · abrimos amanhã (terça) às 18h";
    } else {
        aviso.className = "alert alert-warning py-2 px-3 my-3";
        aviso.textContent = "Loja fechada · abrimos hoje às 18h";
    }
}

    atualizarHorario();
    setInterval(atualizarHorario, 60000);

    // ----- Finalizar pedido (status simulado) //
    const btnFinalizar = document.querySelector("#btn-finalizar");
    const statusBox = document.querySelector("#pedido-status");
    const rodape = document.querySelector("#carrinho-rodape");

    const etapas = [
        {titulo: "Pedido recebido", texto: "A pizzaria já recebeu o seu pedido.", pct: 25},
        {titulo: "Seu pedido está sendo preparado", texto:"Nossos pizzaiolos já começaram a fazer o seu pedido", pct: 50},
        {titulo: "Saiu pra entrega", texto:"O entregador está a caminho.", pct: 75},
        {titulo: "Pedido entregue", texto:"Bom apetite!", pct: 100}
    ];

    let temporizadores = [];

    function mostrarEtapa(i, total) {
        const e = etapas[i];
        statusBox.innerHTML = `
        <h3 class="fs-5 mb-1">${e.titulo}</h3>
        <p class="text-muted">${e.texto}</p>
        <div class="progress mb-3" role="progressbar" aria-label="Andamento do pedido">
         <div class="progress-bar bg-danger" style="width:${e.pct}%"></div>
        </div>
        <p class="small mb-3">Total do pedido: <strong>${formatar(total)}</strong></p>
        <button class="btn btn-outline-secondary btn-sm" id="btn-novo-pedido">Fazer novo pedido</button>`;
    }

    function voltarAoCarrinho() {
        temporizadores.forEach(clearTimeout);
        temporizadores = [];
        statusBox.classList.add("d-none");
        lista.classList.remove("d-none");
        rodape.classList.remove("d-none");
    }

    btnFinalizar.addEventListener("click", function (){
        if (carrinho.length === 0) {
            alert("Seu carrinho está vazio.");
            return;
        }

        let total = 0;
        carrinho.forEach(function (item){
            total += item.preco * item.qtd;
        });

        if (total < 25){
            alert("O pedido mínimo é R$ 25,00.");
            return;
        }

        carrinho = [];
        atualizarTela();

        lista.classList.add("d-none");
        rodape.classList.add("d-none");
        statusBox.classList.remove("d-none");

        mostrarEtapa(0, total);
        for (let i = 1; i < etapas.length; i ++) {
            temporizadores.push(setTimeout(function (){
                mostrarEtapa(i, total);
            }, i * 6000));
        }
            
    });

    statusBox.addEventListener("click", function (e) {
        if (e.target.id  === "btn-novo-pedido") {
            voltarAoCarrinho();
        }
    });

    // ----- Como instalar (abre a aba do aparelho da pessoa) ------//

    /*
        Escrevi este trecho para o cliente já cair na aba certa do "Como instalar", sem precisar procurar o aparelho dele. Eu leio o userAgent do navegador, que é o texto em que o aparelho se apresenta, e procuro por "Android" ou por iPhone, iPad e iPod. Tive que tratar o iPad separado: desde o iPadOS 13 ele se apresenta como se fosse um Mac, então eu confiro se o aparelho diz ser Macintosh e ao mesmo tempo tem tela de toque, porque um Mac de verdade não tem. Quem não cai em nenhum dos dois casos vê a aba do computador. Se a detecção errar, não tem problema nenhum, porque as três abas continuam clicáveis e a pessoa troca na mão.
    */
    const agente = navigator.userAgent;
    const ehIOS = /iPhone|iPad|iPod/.test(agente) || (/Macintosh/.test(agente) && navigator.maxTouchPoints > 1);
    const ehAndroid = /Android/i.test(agente);

    let idAba = "#aba-desktop";
    if (ehIOS) {
        idAba = "#aba-ios";
    } else if (ehAndroid) {
        idAba = "#aba-android";
    }

    // Uso o próprio Bootstrap para trocar a aba, o mesmo que já uso nos toasts, em vez de mexer nas classes na mão.
    const abaDoAparelho = document.querySelector(idAba);
    if (abaDoAparelho) {
        bootstrap.Tab.getOrCreateInstance(abaDoAparelho).show();
    }


    //-- PREFERENIAS E ALERGIAS --//
    const PERFIL_CHAVE = "perfilAlimentar";
    const PERFIL_PREFERENCIAS = ["Vegetariano", "Vegano"];
    const PERFIL_ALERGIAS = ["Amendoim", "Glúten", "Leite", "Ovo", "Frutos do mar"];

    function carregarPerfil() {
        const salvo = localStorage.getItem(PERFIL_CHAVE);
        return salvo ? JSON.parse(salvo) : { preferencias: [], alergias: [] };
    }

    function salvarPerfil(perfil) {
        localStorage.setItem(PERFIL_CHAVE, JSON.stringify(perfil));
    }

    function criarCheckboxesPerfil(containerId, opcoes, marcados, prefixo) {
        const container = document.getElementById(containerId);
        container.innerHTML = "";
        opcoes.forEach(function (opcao, i) {
            const id = prefixo + i;
            const div = document.createElement("div");
            div.className = "form-check";
            div.innerHTML = `
                    <input class="form-check-input" type="checkbox" id="${id}" value="${opcao}"
                        ${marcados.includes(opcao) ? "checked" : ""}>
                        <label class="form-check-label" for="${id}">${opcao}</label>`;
            container.appendChild(div);
        });
    }
    function normalizar(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
    function lerMarcadosPerfil(containerId) {
        const marcados = document.querySelectorAll(`#${containerId} input:checked`);
        return Array.from(marcados).map(function (input) {
            return input.value;
        });
    }

        function renderizarCardapioPerfil(perfil) {
            const cardapio = document.getElementById("perfilCardapio");
            cardapio.innerHTML = "";

            
            const todosItens = categorias.flatMap(function (cat) {
                return cat.itens;
        });
    

                todosItens.forEach(function (item) {
                    const tags = item.tags || [];
                    const alergenos = item.alergenos || [];

                    const atende = perfil.preferencias.every(function (p) {
                        return tags.includes(p);
                    });
                
                    if (!atende) return;

                    const textoItem = normalizar(item.nome + " " + item.desc);
                    const perigos = perfil.alergias.filter(function (a) {
                        return alergenos.includes(a) || textoItem.includes(normalizar(a));
                    });
                    const temAlergeno = perigos.length > 0;

                    const col = document.createElement("div");
                    col.className = "col-md-6";
                    col.innerHTML = `
                    <div class="card h-100 ${temAlergeno ? "perfil-alerta" : "perfil-seguro"}">
                         <div class="card-body">
                              <h4 class="h6 card-title">${item.nome}</h4>
                              ${temAlergeno
                                ? `<span class="badge text-bg-danger">Contém: ${perigos.join(", ")}</span>`
                                : `<span class="badge text-bg-success">Nenhum alérgeno seu encontrado</span>`}
                        </div>
                    </div>`;
                    cardapio.appendChild(col);
                   });
                }

            function iniciarPerfil() {
                const perfil = carregarPerfil();
                criarCheckboxesPerfil("perfilPreferencias", PERFIL_PREFERENCIAS, perfil.preferencias, "pref");
                             const todasAlergias = PERFIL_ALERGIAS.concat(
                    perfil.alergias.filter(function (a) { return !PERFIL_ALERGIAS.includes(a); })
                );
                criarCheckboxesPerfil("perfilAlergias", todasAlergias, perfil.alergias, "alg");
                renderizarCardapioPerfil(perfil);
            }

    document.getElementById("btnSalvarPerfil").addEventListener("click", function () {
        const perfil = {
            preferencias: lerMarcadosPerfil("perfilPreferencias"),
            alergias: lerMarcadosPerfil("perfilAlergias")
        };
        salvarPerfil(perfil);
        renderizarCardapioPerfil(perfil);
    });

    document.getElementById("btnLimparPerfil").addEventListener("click", function () {
        localStorage.removeItem(PERFIL_CHAVE);
        iniciarPerfil();
    });
        document.getElementById("btnAddAlergia").addEventListener("click", function () {
        const input = document.getElementById("alergiaExtra");
        const nova = input.value.trim().replace(/[<>"'&]/g, "");
        if (!nova) return;

        const perfil = {
            preferencias: lerMarcadosPerfil("perfilPreferencias"),
            alergias: lerMarcadosPerfil("perfilAlergias")
        };

        const existente = PERFIL_ALERGIAS.concat(perfil.alergias).find(function (a) {
            return normalizar(a) === normalizar(nova);
        });
        const nome = existente || nova;
        if (!perfil.alergias.includes(nome)) perfil.alergias.push(nome);

        salvarPerfil(perfil);
        input.value = "";
        iniciarPerfil();
    });

    document.getElementById("alergiaExtra").addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById("btnAddAlergia").click();
        }
    });
    iniciarPerfil();
        // ----- PWA: registrar o service worker -----
    if ("serviceWorker" in navigator) {
        window.addEventListener("load", function () {
            navigator.serviceWorker.register("sw.js");
        });
    }