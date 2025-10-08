/*=============== CLASSIFICATION JS ===============*/
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

/*=============== FIRST PHASE JS ===============*/
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
      linha.classList.add('line-game'); // só um exemplo de classe para estilizar
      tabelaJogos.appendChild(linha);

      linha.innerHTML = `
        <div class="container__games">
          <div class='table__title'>
            <img src="images/logo.png" alt="Campeonato Municipal 2025">
            <h2>Campeonato Municipal 2025</h2>
            <p>${jogo.estadio} - ${jogo.diaSemana}</p>
            <h3>${jogo.data} - ${jogo.hora}</h3>
          </div>

          <div class="departure__container">
            <div class="team__container">
              <img src="images/teams/${jogo.escudo_mandante}" alt="Escudo ${jogo.equipe_mandante}">
              <p>${jogo.equipe_mandante}</p>
            </div>
            <div class='scoreboard'>
              <h2>${jogo.gols_mandante}</h2>
              <p>X</p>
              <h2>${jogo.gols_visitante}</h2>
            </div>
            <div class="team__container">
              <img src="images/teams/${jogo.escudo_visitante}" alt="Escudo ${jogo.equipe_visitante}">
              <p>${jogo.equipe_visitante}</p>
            </div>
          </div>

          <div class='card__button'>
            <button class='btn'>Grupo ${jogo.grupo}</button>
          </div>
        </div>
      `;
    });
  })
  .catch(error => {
    console.error('Erro:', error);
  });


/*=============== SWIPER ===============*/
const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    pagination: {
        el: ".swiper-pagination",
        clickable: true
    },

    breakpoints: {
        600: {
            slidesPerView: 1
        }, 
        1024: {
            slidesPerView: 2
        }
    }
});

/*=============== NAV TOGGLE (small screens) ===============*/
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

// Close nav menu on click of nav link on small screens
function updateNavListeners() {
    const navItems = navMenu.querySelectorAll('a');
    navItems.forEach(item => {
        item.removeEventListener('click', closeNavHandler); // remove first to avoid duplicates
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

/*=============== TOGGLE THEME (light & dark mode) ===============*/
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
    ? "<i class='uil uil-sun'></i>"
    : "<i class='uil uil-moon'></i>";

  // Acessibilidade (opcional)
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

/*=============== MIXTUP ===============*/
const containerEl = document.querySelector('.semifinais__container');
var mixer = mixitup(containerEl, {
    animation: {
        enable: false
    }
});

mixer.filter('*');