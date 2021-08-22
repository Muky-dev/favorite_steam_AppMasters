# Favorite Steam API

<p align="center">
  <img alt="programing gif" src="https://media0.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif?cid=ecf05e47wop40m3lc4or31tbp0ejk16rbvlezoviakl81kqk&rid=giphy.gif&ct=g">
</p>

## Sumário
* [Resumo](#resumo)
* [Link da API rodando](#link-para-a-api-rodando-no-heroku)
* [Rotas](#rotas)
* [Infos](#infos)

## Resumo
- Projeto criado para o processo de seleção de estágiarios da App Masters: https://appmasters.io
- Desenvolvido com Node e Typescript, utilizando Express para lidar com requisições e respostas HTTP.
- Foi utilizado um rate-limiter para limitar a quantidade de requisições para a API da Steam `Limitado a 200 Requests a cada 5 minutos`

### Adicional
- Rotas de favorito com error handling
- Usando cache em memória para todas as requisições
- Usando MongoDB para armazenar informações dos favoritos

## Link para a API rodando no Heroku: 
### https://favorite-steam-api.herokuapp.com/

## Rotas

### Root
- `GET` - `/` : Retorna vários apps com as propriedades "appid" e "name"
- `GET` - `/:appid` : Recebe "appid" pelo parâmetro de url e retorna todos os dados disponíveis na api sobre o app

### Favorite (todos os endpoints aqui necessitam do "user-hash" no header)
- `GET` - `/favorite` Retorna todos os favoritos do usuário com seus respectivos dados ("user", "appid", "rating" e "data")
- `POST` - `/favorite/:appid` Recebe "appid" no parâmetro de url, podendo receber "rating", que vai de 0 a 5, no corpo da requisicão e adiciona aos favoritos do usuário
- `DELETE` - `/favorite/:appid` Recebe "appid" no parâmetro de url e deleta esse favorito do usuário (se ele existir)

## Infos:
- O projeto utiliza MongoDB e então é necessário configurar as variáveis de ambiente.

### Variáveis de ambiente:

- `DB_USER` - Nome de usuário do banco de dados | `Obrigatório`
- `DB_PASS` - Senha do usuário | `Obrigatório`
- `DB_NAME` - Nome do banco de dados | `Obrigatório`
- `PORT` - Porta onde a API irá operar (Valor padrão: 4000)


## Como iniciar o projeto:
```
$ git clone https://github.com/Muky-dev/favorite_steam_AppMaster
$ cd favorite_steam_AppMaster
$ yarn install
$ yarn build
$ yarn start
```
