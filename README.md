# SimSage admin interface

## installing node 16 on Ubuntu  

```
sudo apt update
sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates gcc g++ make

# install nodejs
curl -sL "https://deb.nodesource.com/setup_16.x" | sudo -E bash -
apt install nodejs
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
