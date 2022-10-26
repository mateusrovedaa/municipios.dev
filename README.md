# Web Scraping IBGE

API para retornar informações do portal https://www.ibge.gov.br/cidades-e-estados/.

## Como executar

1. Criar uma cópia do arquivo ```.env.example``` com o nome ```.env```
```
cp .env.example .env
```

2. Preencher as variáveis com os valores. Banco ainda não está sendo utilizado.
```
PORT=

DB_DATABASE=
DB_USERNAME=
DB_PASSWORD=
DB_HOST=
DB_PORT=
DB_DIALECT=
```

3. Instalar os pacotes
```
yarn install
```

4. Executar o projeto
```
yarn serve
```

## Como usar

Requisitar a URL http://localhost/city/[UF]/[CIDADE]

Exemplo:

http://localhost/city/rs/lajeado

```
{

    "city": "lajeado",
    "province": "rs",
    "mayor": "MARCELO CAUMO",
    "gentle": "lajeadense",
    "idhm": "0,778",
    "population": "86.005"

}
```