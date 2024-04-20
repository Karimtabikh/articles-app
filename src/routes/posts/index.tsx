import { Link, createFileRoute } from "@tanstack/react-router";
import { getPokemonList } from "../../api/pokemon";

export const Route = createFileRoute("/posts/")({
  component: PokemonList,
  loader: getPokemonList,
});

function PokemonList() {
  const pokemons = Route.useLoaderData();
  return (
    <>
      <h2>Pokemons</h2>
      <ul>
        {pokemons.map((pokemon) => (
          <li key={pokemon.id}>
            <Link
              to={"/posts/$id"}
              params={{
                id: pokemon.id,
              }}
            >
              {pokemon.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
