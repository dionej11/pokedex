/*IMPORTACIONES (COMPONENTES, ASSETS,ETC...)*/
import { useEffect, useState } from "react";
import { Pagination } from "../Pagination/Pagination";
import circles from "../../Assets/circles.png";
import elipse from "../../Assets/Ellipse.svg";
import lines from "../../Assets/lines.svg";
import loader from "../../Assets/tail-spin.svg"
import "./PokemonList.css";

export function PokemonList() {
  /*CONSTANTES Y CREACIÓN DE ESTADOS*/
  const dataSize = 151;
  const [pokemons, setPokemons ] = useState();
  const [pagination, setPagination] = useState(0);
  const [pokeView, setPokeView] = useState();
  /*INVOCACIÓN DE LA FUNCIÓN getData(...) QUE TRAE LA INFO DE LA API POKEMON*/
  useEffect(()=>{
    getData(`https://pokeapi.co/api/v2/pokemon?limit=${pagination === 150 ? 1 : 10}&offset=${pagination}`); 
  }, [pagination]);
  /*FUNCIÓN ASINCRONA QUE TRAE LA DATA*/
  async function getData(url) {
		try {
			let res = await fetch(url),
			json = await res.json();
      const promises = [];//arreglo de promesas para resolver
      json.results.map((pokemon) => promises.push(fetch(pokemon.url).then(res => res.json())));
      Promise.all(promises).then(results => {//se resuelven las promesas del arreglo 'promises'
        const pokemon = results.map(result => ({
          'name':result.name,
          'id': result.id,
          'image': result.sprites.other['official-artwork'].front_default,
          'abilities': result.abilities,
          'weight': result.weight,
          'height': result.height
        }));
        setPokemons(pokemon);//update del estado pokemon con la data
        setPokeView({ //update del estado pokeView para inicializar la UI con el primer pokemon de la data
          'name': pokemon[0].name, 
          'weight': pokemon[0].weight, 
          'height': pokemon[0].height, 
          'abilities': pokemon[0].abilities.map((ability) => ability.ability.name),
          'image': pokemon[0].image
        });
      });
      // 
		} catch (err) {//manejo del error
			let msj = err.statusText || "Ocurrió un error 🤕 por favor recargue la página.";
			alert(msj);
		}
	}

  return (
    <main className="pokedex">
      {/*SECCIÓN VISUALIZACIÓN DE POKEMON*/}
      <section className="pokemonView">
        <div className="pokemonViewCicles">
          <img src={circles} alt="circles decoration"/>
        </div>
        <div className="pokemonViewFigure">
          <div className="figureWrapp">
            <img src={pokeView?.image} alt={pokeView?.name}/>
          </div>
          <div className="figureDecoration">
            <img src={elipse} alt="decoration"/>
            <img src={lines} alt="decoration"/>
          </div>
        </div>
        <div className="pokemonViewLines">
          <div></div>
          <div></div>
        </div>
      </section>
      {/*SECCIÓN SELECCIONAR POKEMONES Y VER DATA*/}
      <section className="pokemonAside">
        <section className="pokemonAsideData">
          <h3>{pokeView?.name.toUpperCase()}</h3>
          <p>Weight: {pokeView?.weight}kg</p>
          <p>Height: {pokeView?.height}m</p>
          <p>Abilities:</p>
          <div className="dataAbilities">
            {
              pokeView ? pokeView.abilities.map((ability, index) => <p key={index}>{ability}</p>) : ""
            }
          </div>
        </section>
        <section className="pokemonAsidepokes">
          {
            pokemons ? 
            pokemons.map((pokemon, index) => {
              return <div key={index} className={pokeView ? pokemon.name === pokeView.name ? "indipoke":"" : ""} >
                <img width="40px" 
                  src={pokemon.image} 
                  alt={"Picture of "+pokemon.name} 
                  onClick={() => setPokeView({ 
                    'name': pokemon.name, 
                    'weight': pokemon.weight, 
                    'height': pokemon.height, 
                    'abilities': pokemon.abilities.map((ability) => ability.ability.name),
                    'image': pokemon.image
                  })}
                />
              </div>
            })
            : <img className="loader" src={loader} alt="loader..." />
          }
        </section>
        <div className="Asidepokes__buttons">
          <button className="paginationButton" onClick={() => setPagination(pagination-10)} disabled={pagination === 0}>{'<'}</button>
          <button className="paginationButton" onClick={() => setPagination(pagination+10)} disabled={pagination === 150} >{'>'}</button>
        </div>
        {/*COMPONENTE PAGINACIÓN*/}
        <Pagination totalData={dataSize} state={pagination} setState={setPagination} />
      </section>
    </main>
  );
}