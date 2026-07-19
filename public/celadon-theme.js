/* Celadon site theming — variant palettes + live re-theme via CSS variables.
   `celadon` hexes are the real generated port output; sky/powder/jade are
   provisional derivations pending the ports/json files. */
(function () {
  var V = {
    'celadon-sky': {
      label: 'Sky', kind: 'light · sage paper', use: 'daytime',
      colors: {
        bg: '#eaf6e8', surface: '#f3faf1', alt: '#dcebd8', border: '#c6d9c1',
        fg: '#2b3627', muted: '#586752', faint: '#75816f', accent: '#5f8a54', 'accent-ink': '#eaf6e8',
        red: '#b23c33', green: '#4f7f2b', yellow: '#8f6c0e', blue: '#23639c', magenta: '#a4478e', cyan: '#0b8175',
        'red-b': '#93312a', 'green-b': '#416a23', 'yellow-b': '#77590c', 'blue-b': '#1d5382', 'magenta-b': '#8a3b77', 'cyan-b': '#096b61',
        'shadow-md': '0 3px 10px rgba(36,64,28,.14)', 'shadow-lg': '0 12px 32px rgba(36,64,28,.18)'
      }
    },
    'celadon-powder': {
      label: 'Powder', kind: 'dark · low contrast', use: 'night, dim rooms',
      colors: {
        bg: '#1c241a', surface: '#232c21', alt: '#2a3428', border: '#37422f',
        fg: '#b7c1b2', muted: '#8b9787', faint: '#6f7b6c', accent: '#97c273', 'accent-ink': '#1c241a',
        red: '#e39a93', green: '#97c273', yellow: '#ccae55', blue: '#82b9e4', magenta: '#dc98c9', cyan: '#4cc2b5',
        'red-b': '#edb0aa', 'green-b': '#a8d086', 'yellow-b': '#dcc06a', 'blue-b': '#97c8ec', 'magenta-b': '#e7abd6', 'cyan-b': '#67d0c4',
        'shadow-md': '0 3px 10px rgba(0,0,0,.35)', 'shadow-lg': '0 12px 32px rgba(0,0,0,.45)'
      }
    },
    'celadon': {
      label: 'Celadon', kind: 'dark · medium contrast', use: 'the default',
      colors: {
        bg: '#131b11', surface: '#1a2418', alt: '#232f20', border: '#2e3b2b',
        fg: '#c9d5c6', muted: '#939f91', faint: '#727e70', accent: '#9ecf75', 'accent-ink': '#131b11',
        red: '#fba29b', green: '#9ecf75', yellow: '#dcbb50', blue: '#7cc7fb', magenta: '#f49cdb', cyan: '#37d8c9',
        'red-b': '#fec4be', 'green-b': '#b6e68f', 'yellow-b': '#f1d26f', 'blue-b': '#abdbfe', 'magenta-b': '#ffbceb', 'cyan-b': '#62efdf',
        'shadow-md': '0 3px 10px rgba(0,0,0,.4)', 'shadow-lg': '0 12px 32px rgba(0,0,0,.5)'
      }
    },
    'celadon-jade': {
      label: 'Jade', kind: 'dark · high contrast', use: 'bright rooms, glare',
      colors: {
        bg: '#0c1309', surface: '#141d11', alt: '#1e2a19', border: '#2d3d27',
        fg: '#dfeadb', muted: '#a3b09e', faint: '#7f8c7b', accent: '#abe07f', 'accent-ink': '#0c1309',
        red: '#ffada5', green: '#abe07f', yellow: '#eec95a', blue: '#8ed4ff', magenta: '#ffa8e5', cyan: '#41ead9',
        'red-b': '#ffc9c3', 'green-b': '#c2f099', 'yellow-b': '#f8da78', 'blue-b': '#b4e2ff', 'magenta-b': '#ffc0ed', 'cyan-b': '#6ff5e4',
        'shadow-md': '0 3px 10px rgba(0,0,0,.5)', 'shadow-lg': '0 12px 32px rgba(0,0,0,.6)'
      }
    }
  };
  var ORDER = ['celadon-sky', 'celadon-powder', 'celadon', 'celadon-jade'];
  function current() {
    try { var v = localStorage.getItem('celadon-variant'); return V[v] ? v : 'celadon'; }
    catch (e) { return 'celadon'; }
  }
  function apply(name, persist) {
    var v = V[name] || V['celadon'];
    var r = document.documentElement.style;
    Object.keys(v.colors).forEach(function (k) { r.setProperty('--cel-' + k, v.colors[k]); });
    document.documentElement.setAttribute('data-celadon', name);
    if (persist !== false) { try { localStorage.setItem('celadon-variant', name); } catch (e) {} }
  }
  window.CELADON = { variants: V, order: ORDER, apply: apply, current: current };
  apply(current(), false);
})();
