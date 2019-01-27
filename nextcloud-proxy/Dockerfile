FROM balenalib/raspberrypi3-node:10.10

RUN mkdir -p /var/nextcloud-proxy
COPY src/ /var/nextcloud-proxy
RUN cd /var/nextcloud-proxy && npm i

