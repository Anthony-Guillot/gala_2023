# Documentation API Gala 2023

## Installation et Exécution

### Installation

Pour installer l'API sur un système Linux, suivre la procédure suivante :

```markdown

- git clone git@github.com:Anthony-Guillot/gala_2023.git
- cd gala_2023
- cd api_src
- npm i
- cd ..
- cd dashboard
- npm i
- cd ..
- docker-compose up -d --build
- créer la base de donnée portant le même nom que dans le fichier .env
- docker-compose down

```

### Exécution

Pour exécuter l'API :

`docker-compose up -d`

Pour arrêter l'API : 

`docker-compose down`

## URL de l'API

L'api est accessible à l'adresse suivante : 

- en local : localhost:3000
- à distance : https://pci.leria-etud.univ-angers.fr/gala 

## Routes

### Évenement

| Route              | Méthode            | Paramètres            | Body |
-------------------------------------------------------------------------
| /Party/	         |  POST              |                       | name : {name}
                                                                    description (optionnel : test |
-------------------------------------------------------------------------
| /Party/{uuid}      |  GET               |                       |      |
--------------------------------------------------------------------------