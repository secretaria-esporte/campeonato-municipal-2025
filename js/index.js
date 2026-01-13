// Renderiza os jogos realizados a partir do JSON highlights
fetch('./json-files/highlights.json')
  .then(res => res.json())
  .then(data => {
    const swiperWrapper = document.querySelector('.swiper-wrapper');

    data.forEach(jogo => {
      const slide = document.createElement('div');
      slide.classList.add('swiper-slide');
      slide.innerHTML = `
        <article>
          <div class="highlights__image">
            <img class="card__logo" src="images/logo.png" alt="Logo do Campeonato Municipal 2025">
          </div>
          <div class="table__title">
            <h2>Campeonato Municipal 2025</h2>
            <p>${jogo.estadio} - ${jogo.diaSemana}</p>
            <h3>${jogo.data} - ${jogo.hora}</h3>
          </div>
          <div class="departure__container">
            <figure class="team__container">
              <img src="images/teams/${jogo.escudo_mandante}" alt="Escudo ${jogo.equipe_mandante}">
              <figcaption>${jogo.equipe_mandante}</figcaption>
            </figure>
            <figure class="scoreboard" role="status" aria-live="polite">
              <span class="score">${jogo.gols_mandante}</span>
              <span class="divider">X</span>
              <span class="score">${jogo.gols_visitante}</span>
            </figure>
            <figure class="team__container">
              <img src="images/teams/${jogo.escudo_visitante}" alt="Escudo ${jogo.equipe_visitante}">
              <figcaption>${jogo.equipe_visitante}</figcaption>
            </figure>
          </div>
          <div class="card__button">
            <a href="#classification" class="btn primary">${jogo.info_partida}</a>
          </div>
        </article>
      `;
      swiperWrapper.appendChild(slide);
    });

    // Inicializar o Swiper depois de criar todos os slides
    new Swiper('.swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: data.length > 1, // loop só se houver mais de 1 slide
      pagination: { el: '.swiper-pagination', clickable: true },
      autoplay: { delay: 5000, disableOnInteraction: false },
    });
  })
  .catch(err => console.error('Erro ao carregar highlights.json:', err));


/* ----- Menu de Navegação (Telas pequenas) ----- */
const navMenu = document.querySelector('.nav__menu');
const navOpenBtn = document.querySelector('.nav__toggle-open');
const navCloseBtn = document.querySelector('.nav__toggle-close');

const openNavHandler = () => {
    navMenu.style.display = 'flex';
    navOpenBtn.style.display = 'none';
    navCloseBtn.style.display = 'inline-block';
};

const closeNavHandler = () => {
    navMenu.style.display = 'none';
    navOpenBtn.style.display = 'inline-block';
    navCloseBtn.style.display = 'none';
};

const closeNavResize = () => {
    navMenu.style.display = 'flex';
    navOpenBtn.style.display = 'none';
    navCloseBtn.style.display = 'none';
};

navOpenBtn.addEventListener('click', openNavHandler);
navCloseBtn.addEventListener('click', closeNavHandler);

// Fechar menu ao clicar no link em telas pequenas
function updateNavListeners() {
    const navItems = navMenu.querySelectorAll('a');
    navItems.forEach(item => {
        item.removeEventListener('click', closeNavHandler); // Remover o primeiro para evitar duplicatas
        if (window.innerWidth < 768) {
            item.addEventListener('click', closeNavHandler);
        }
    });
}

window.addEventListener('resize', updateNavListeners);
window.addEventListener('DOMContentLoaded', updateNavListeners);

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeNavResize();
    } else {
        closeNavHandler();
    }
});

/* ----- Alternar tema (modo claro e escuro) ----- */
const themeBtn = document.querySelector('.nav__theme-btn');

const images = [
  {
    element: document.getElementById('img-1'),
    name: 'secretaria',
    alt: {
      light: 'Logo da Secretaria e Prefeitura no modo claro',
      dark: 'Logo da Secretaria e Prefeitura no modo escuro',
    },
  },
  {
    element: document.getElementById('img-2'),
    name: 'convec',
    alt: {
      light: 'Logo da Convec no modo claro',
      dark: 'Logo da Convec no modo escuro',
    },
  },
  {
    element: document.getElementById('img-3'),
    name: 'arena',
    alt: {
      light: 'Logo da Arena Pé na Areia no modo claro',
      dark: 'Logo da Arena Pé na Areia no modo escuro',
    },
  },
  {
    element: document.getElementById('img-4'),
    name: 'aspectho',
    alt: {
      light: 'Logo da Aspectho no modo claro',
      dark: 'Logo da Aspectho no modo escuro',
    },
  },
];

function applyTheme(theme) {
  const isDark = theme === 'dark';

  // Atualiza a classe do body
  document.body.classList.toggle('dark', isDark);

  // Atualiza imagens e seus respectivos alt
  const suffix = isDark ? '2' : '1';
  const altKey = isDark ? 'dark' : 'light';

  images.forEach(({ element, name, alt }) => {
    element.src = `images/supporters/${name}-${suffix}.png`;
    element.alt = alt[altKey];
  });

  // Atualiza o ícone do botão de tema
  themeBtn.innerHTML = isDark
    ? "<i class='i uil:sun' aria-hidden='true'></i>"
    : "<i class='i uil:moon' aria-hidden='true'></i>";

  // Acessibilidade
  themeBtn.setAttribute(
    'aria-label',
    isDark ? 'Ativar modo claro' : 'Ativar modo escuro'
  );

  // Salva o tema no localStorage
  localStorage.setItem('theme', theme);
}

// Alternar tema ao clicar no botão
themeBtn.addEventListener('click', () => {
  const isDark = document.body.classList.contains('dark');
  applyTheme(isDark ? '' : 'dark');
});

// Aplica tema salvo ao carregar a página
window.addEventListener('load', () => {
  const savedTheme = localStorage.getItem('theme') || '';
  applyTheme(savedTheme);
});

/* ----- Classificação / Grupos ----- */
let tabelaClassificacao = document.querySelector('.classification__table');
let line = document.querySelectorAll('.body__classification tr');

exibirTabelaClassificacao('A');

async function exibirTabelaClassificacao(letterGroup) {
    // Atualizar letra do grupo no index.html
    document.querySelector('.group__letter').innerHTML = letterGroup;

    try {
        const res = await fetch(`./json-files/group${letterGroup}.json`);
        if (!res.ok) throw new Error('Erro ao carregar arquivo JSON');

        const data = await res.json();

        data.sort((a, b) => a.posicao - b.posicao);

        data.forEach((equipe, indice) => {
            if (line[indice]) {
                line[indice].innerHTML = `
                    <td>${equipe.posicao}</td>
                    <td>${equipe.equipe}</td>
                    <td>${equipe.pontos}</td>
                    <td>${equipe.jogos}</td>
                    <td>${equipe.vitorias}</td>
                    <td>${equipe.empates}</td>
                    <td>${equipe.derrotas}</td>
                    <td>${equipe.gols_pro}</td>
                    <td>${equipe.gols_contra}</td>
                    <td>${equipe.saldo_de_gols}</td>
                `;
            }
        });
    } catch (error) {
        console.error(error);
    }
}

// Controlar a escolha da letra do grupo para exibir na tabela de classificação
let selectLetra = document.querySelector('.select__group');

selectLetra.addEventListener('change', (event) => {
    exibirTabelaClassificacao(event.target.value);
});

/* ----- Primeira Fase / Jogos ----- */
let tabelaJogos = document.querySelector('.table__games');

fetch('./json-files/firstPhase.json')
  .then(response => {
    if (!response.ok) {
      throw new Error('Erro ao carregar arquivo JSON');
    }
    return response.json();
  })
  .then(data => {
    data.forEach(jogo => {
      let linha = document.createElement('div');
      linha.classList.add('line-game'); // classe para estilização
      tabelaJogos.appendChild(linha);

      linha.innerHTML = `
        <article class="container__games" aria-labelledby="game-title-${jogo.id}">
          <header class='table__title' id="game-title-${jogo.id}">
            <img src="images/logo.png" alt="Campeonato Municipal 2025">
            <h2>Campeonato Municipal 2025</h2>
            <p>${jogo.estadio} - ${jogo.diaSemana}</p>
            <h3><time datetime="${jogo.dataISO}T${jogo.hora}">${jogo.data} - ${jogo.hora}</time></h3>
          </header>

          <div class="departure__container">
            <figure class="team__container">
              <img src="images/teams/${jogo.escudo_mandante}" alt="Escudo ${jogo.equipe_mandante}">
              <figcaption>${jogo.equipe_mandante}</figcaption>
            </figure>

            <figure class="scoreboard" role="status" aria-live="polite">
                <span class="score">${jogo.gols_mandante}</span>
                <span class="divider">X</span>
                <span class="score">${jogo.gols_visitante}</span>
            </figure>

            <figure class="team__container">
              <img src="images/teams/${jogo.escudo_visitante}" alt="Escudo ${jogo.equipe_visitante}">
              <figcaption>${jogo.equipe_visitante}</figcaption>
            </figure>
          </div>

          <div class='card__button'>
            <a href="#classification" class="btn primary" aria-label="Ir para o Grupo ${jogo.grupo}">Grupo ${jogo.grupo}</a>
          </div>
        </article>
      `;
    });
  })
  .catch(error => {
    console.error('Erro:', error);
  });

/* ----- Mixtup ----- */
const containerEl = document.querySelector('.semifinais__container');
var mixer = mixitup(containerEl, {
    animation: {
        enable: false
    }
});

mixer.filter('*');
