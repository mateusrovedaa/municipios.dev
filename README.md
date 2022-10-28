# Web Scraping IBGE

API para retornar informações do portal https://www.ibge.gov.br/cidades-e-estados/.

## Executar com containers

Carregar o arquivo de profile para o terminal

```
source environment/profile
```

Realizar o build da aplicação
```
build
```

Iniciar o servidor da API e o banco de dados
```
server
```


### Comandos extras

O projeto conta com um comando `docker-compose` personalizado. Para usar, basta digitar:
```
docker-compose [comando]
```

Para visualizar logs
```
logs
```

Para encerrar a aplicação, usar o comando
```
down
```
## Executar sem containers

1. Criar uma cópia do arquivo ```.env.example``` com o nome ```.env```
```
cp .env.example .env
```

2. Preencher as variáveis com os valores
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
npm install
```

4. Executar o projeto
```
npm run serve
```


## Como usar

Requisitar a URL http://localhost:[PORT]/city/[UF]/[CIDADE]

Exemplo:

`http://localhost:3000/city/rs/doutor-ricardo` ou `http://localhost:3000/city/rs/doutor ricardo`


Serão retornados os dados disponíveis no portal e será feita uma busca da URL do site do município utilizando o Google.

Cada requisição é salva no banco de dados. Caso o registro for mais velho do que 7 dias, é feita uma nova requisição e atualizada a informação.
```
{

    "slug": "doutor-ricardo",
    "name": "Doutor Ricardo",
    "province": "RS",
    "ibgecode": 4306759,
    "mayor": "ALVARO JOSE GIACOBBO",
    "gentle": "ricardense",
    "idhm": 0.724,
    "population": "1967",
    "site": "https://doutorricardo.rs.gov.br/",
    "updatedAt": "2022-10-28T13:35:03.915Z"

}
```