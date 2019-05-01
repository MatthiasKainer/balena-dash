FROM nodered/node-red-docker:rpi-v8

USER node-red

RUN npm install node-red-contrib-resinio node-red-dashboard node-red-contrib-credentials npm install node-red-node-snmp

RUN touch settings.js
COPY ./settings.js /data/settings.js