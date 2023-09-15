# NoCode STI Dashboard FE

Dashboard No Cod STI

## Requisiti

* node 18
* npm
* nvm
* yarn

## Configurare il progetto

Crea una copia locale del file `.env-cmdrc` clonando il file `env-cmdrc.sample`

Configurare gli endpoint necessari

## Installazione

Usare nvm per impostare la corretta versione di node
```
use nvm
```
Per procedere con l'installazione del progetto usare il comando

```
npm install --legacy-peer-deps
```

## Avviare il progetto

Per lo start del progetto bisogna usare il comando (il progetto parte con ambiente Locale)

```
npm run start
```

Nel caso in cui si voglia fare lo start del progetto per un determinato ambiente bisogna utilizzare il comando

```
npm run start:ambiente
```

La dashboard è ora visibile all'indirizzo http://localhost:3001/irccs-dashboard


## Avviare chrome per bypassare CORS 

Durante lo sviluppo potrebbe essere utile disabilitare il CORS lato FE.

### Linux
Puoi utilizzare questa riga di comando per avviare chrome in una modalità di sicurezza ridotta:
```
google-chrome --args --disable-web-security --allow-running-insecure-context --user-data-dir=/tmp
```
Puoi settare un alias per facilitare l'operazione:
```
alias chrome-unsafe="google-chrome --args --disable-web-security --allow-running-insecure-context --user-data-dir=/tmp"
```
Basterà quindi lanciare questo comando: `chrome-unsafe`

### Windows
Puoi utilizzare questa riga di comando per avviare chrome in una modalità di sicurezza ridotta:
```
start chrome --disable-web-security --allow-running-insecure-content --user-data-dir="C:\Temp"
```