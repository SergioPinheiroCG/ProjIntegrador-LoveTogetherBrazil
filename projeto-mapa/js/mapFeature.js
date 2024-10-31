// Inicializa o mapa e define o ponto central e o nível de zoom
const map = L.map('map').setView([-15.7801, -47.9292], 4); // Coordenadas do Brasil

// Adiciona um mapa base do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Função para exibir o tooltip com o valor da doação ao passar o mouse sobre o estado
function highlightFeature(e) {
    const layer = e.target;
    const stateCode = layer.feature.properties.sigla;
    const donationAmount = donationsData[stateCode] || 0;

    // Exibe o valor de doações no tooltip
    layer.bindTooltip(`R$ ${donationAmount.toLocaleString('pt-BR')}`, {
        permanent: false,
        direction: 'center',
        className: 'donation-tooltip'
    }).openTooltip();

    // Destaca o estado ao passar o mouse
    layer.setStyle({
        weight: 3,
        color: '#e05a12',
        fillOpacity: 0.9
    });
}

// Função para resetar o estilo ao remover o mouse
function resetHighlight(e) {
    const layer = e.target;
    layer.closeTooltip();
    geojson.resetStyle(layer);
}

// Função para associar os eventos de mouse aos estados
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
}

// Ajusta o tamanho do mapa para garantir que ele ocupe todo o contêiner
map.whenReady(() => {
    map.invalidateSize(); // Corrige o redimensionamento para evitar a barra de rolagem
});

// Obtenha e adicione os dados geojson para o mapa do Brasil
fetch('https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson')
    .then(response => response.json())
    .then(data => {
        geojson = L.geoJson(data, {
            style: {
                fillColor: '#ed3228',
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.6
            },
            onEachFeature: onEachFeature
        }).addTo(map);
    })
    .catch(error => console.error('Erro ao carregar dados do mapa:', error));
