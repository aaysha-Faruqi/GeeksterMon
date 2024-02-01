const typeFilter = document.getElementById("typeFilter");
const searchInput = document.getElementById("searchInput");
const pokemonContainer = document.getElementById("pokemonContainer");
let allPokemon = []; // Variable to store all Pokémon initially fetched
let pokemonTypes = []; // Variable to store all Pokémon types

// Function to fetch all Pokemon
async function fetchAllPokemon() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=150"); // Limiting to 100 Pokémon for initial display
    const data = await response.json();
    allPokemon = data.results;
    await fetchPokemonDetails(allPokemon); // Fetch details for all Pokémon
    await fetchPokemonTypes(); // Fetch Pokémon types and populate dropdown
  } catch (error) {
    console.error("Error fetching all Pokemon:", error);
  }
}

// Fetch details for all Pokémon
async function fetchPokemonDetails(pokemonList) {
  try {
    const promises = pokemonList.map((pokemon) =>
      fetch(pokemon.url).then((response) => response.json())
    );
    const pokemonData = await Promise.all(promises);
    allPokemon = pokemonData.map((data) => ({
      name: data.name,
      types: data.types[0].type.name,
      imgg: data.sprites.other.home.front_default,
      id: data.id,
      weight: data.weight,
      height: data.height,
      ability: data.abilities.map((ability) => ability.ability.name).join(", "),
    }));
    console.log(pokemonData);
    displayPokemon(allPokemon);
  } catch (error) {
    console.error("Error fetching Pokémon details:", error);
  }
}

// Populate the dropdown menu with fetched types
function populateTypeFilter() {
  typeFilter.innerHTML = ""; // Clear previous options
  pokemonTypes.forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeFilter.appendChild(option);
  });
}

// Filter Pokémon by selected type
function filterByType(selectedType) {
  if (selectedType === "All") {
    displayPokemon(allPokemon);
  } else {
    const filteredPokemon = allPokemon.filter((pokemon) =>
      pokemon.types.includes(selectedType)
    );
    displayPokemon(filteredPokemon);
  }
}

// Function to reset all filters and search
function resetFilters() {
  typeFilter.value = "All";
  searchInput.value = "";
  displayPokemon(allPokemon);
}

// Event listener for type filter dropdown
typeFilter.addEventListener("change", function () {
  const selectedType = typeFilter.value;
  filterByType(selectedType);
});

// Fetch Pokemon types and populate dropdown
async function fetchPokemonTypes() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type/");
    const data = await response.json();
    pokemonTypes = ["All", ...data.results.map((result) => result.name)]; // Include 'All' option
    populateTypeFilter();
  } catch (error) {
    console.error("Error fetching Pokemon types:", error);
  }
}

// Function to display Pokemon cards

function displayPokemon(pokemonList) {
  pokemonContainer.innerHTML = "";
  pokemonList.forEach((pokemon) => {
    const flip = document.createElement("div");
    flip.classList.add("flip_css");

    flip.innerHTML = `

            <div class="inner_css">
                <div class="pokemon-card">
                    <p>${pokemon.id}</p>
                    <img src="${pokemon.imgg}" alt="${pokemon.name}">
                    <p>${pokemon.name.toUpperCase()}</p>
                    <p>Type: ${pokemon.types.toUpperCase()}</p>
                    <div class="hw">
                        <span id = "hg">height:${pokemon.height}</span>
                        <span id="wg">weight:${pokemon.weight}</span>
                    </div>
                </div>
                
                <div class="pokemon-card-back">
                    <p>${pokemon.id}</p>
                    <h2>${pokemon.name.toUpperCase()}</h2>
                    <p>${pokemon.ability}</p>
                </div>
            </div>

            
        `;
    pokemonContainer.appendChild(flip);
  });
}

// Function to search for Pokemon by name
function searchPokemon() {
  const searchQuery = searchInput.value.toLowerCase();
  if (searchQuery) {
    const filteredPokemon = allPokemon.filter((pokemon) =>
      pokemon.name.toLowerCase().includes(searchQuery)
    );
    displayPokemon(filteredPokemon);
  } else {
    displayPokemon(allPokemon);
  }
}

// Event listener for search input
searchInput.addEventListener("input", searchPokemon);

// Fetch all Pokémon initially
fetchAllPokemon();
