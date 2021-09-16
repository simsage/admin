# SimSage admin interface

node 12, npm 6 build

## installing node 12 on Ubuntu

```
sudo apt update
sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates gcc g++ make
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -

sudo apt install nodejs
```

## checking versions

```
node --version
npm --version
```

## installing
Make sure you remove any existing `package-lock.json` first
```
npm install
```

## running this UI

```
npm run start
```
