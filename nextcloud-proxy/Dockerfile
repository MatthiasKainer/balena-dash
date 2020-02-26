FROM balenalib/raspberrypi3-node:13

RUN mkdir -p /var/nextcloud-proxy
COPY src/ /var/nextcloud-proxy
RUN cd /var/nextcloud-proxy && npm i

COPY go /go

RUN chmod +x go

HEALTHCHECK --interval=30s --timeout=30s --start-period=30s --retries=3 CMD node /var/nextcloud-proxy/healthcheck.js

CMD [ "/go" ]
