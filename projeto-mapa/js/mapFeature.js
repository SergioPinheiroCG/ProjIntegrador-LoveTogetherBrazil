// Inicializa o mapa e define o ponto central e o nível de zoom
const map = L.map('map').setView([-15.7801, -47.9292], 4); // Coordenadas do Brasil

// Adiciona um mapa base do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Função para exibir o tooltip ou popup com o valor da doação e a logo ao passar o mouse sobre o estado
function highlightFeature(e) {
    const layer = e.target;
    const stateCode = layer.feature.properties.sigla;
    const donationAmount = donationsData[stateCode] || 0;

    // URL da logo da LTB
    const logoUrl = '/projeto-mapa/img/logo_-8.png';

    // Conteúdo do tooltip/popup com a logo e o valor da doação
    let content = `<img src="${logoUrl}" alt="Logo LTB" style="width: 20px; vertical-align: middle; margin-right: 5px;"> R$ ${donationAmount.toLocaleString('pt-BR')}`;

    // Se o estado for Paraíba, adiciona "Mais Informações" com um link clicável
    if (stateCode === "PB") {
        content += `<br><span id="more-info-link" style="color: blue; text-decoration: underline; cursor: pointer;">Mais informações</span>`;
        layer.bindPopup(content).openPopup();

        // Adiciona um evento de clique para o link "Mais informações"
        layer.on("popupopen", () => {
            document.getElementById("more-info-link").addEventListener("click", () => {
                window.open("https://drive.google.com/file/d/1P3O5pBIif_CMpXVvz2Y4Cm-YmtObsiYb/view", "_blank");
            });
        });
    } else {
        // Caso contrário, exibe um tooltip com a logo e o valor da doação
        layer.bindTooltip(content, {
            permanent: false,
            direction: 'center',
            className: 'donation-tooltip'
        }).openTooltip();
    }

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
    layer.closePopup();
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
