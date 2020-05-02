const clockTemplate = document.createElement("template");

const key = "nextcloud-gallery";

const nextcloudUrl = `/${key}/next`;

clockTemplate.innerHTML = `
  <style>
  .background {
    width: 100%;
    height: 100%;
    background: no-repeat center center fixed;
    background-size: contain;
    background-image: url("/${key}/random.jpg");
    -webkit-transition-property: background-image 1.5s ease-in 1.5s;
    -moz-transition-property: background-image 1.5s ease-in 1.5s;
    -o-transition-property: background-image 1.5s ease-in 1.5s;
    transition: background-image 1.5s ease-in 1.5s;
    will-change: transition;

}
  </style>
  <div class="background"></div>
`;

class NextCloudGallery extends HTMLElement {
    nextImages = [];
    prevImages = [];

    constructor() {
        super();
        this._backgroundImage = `/${key}/random.jpg`;
        registerHandler("nextcloud-gallery", {
            ticks: 1500,
            duration: 1500,
            run: () => this._changeBackgroundImage(),
        });
        ["click", "touchstart", "touchend", "touchmove"].forEach((eventType) => {
            this.addEventListener(eventType, () => {
                registeredHandlers["nextcloud-gallery"].ticks = 0;
            });
        });
        this._loadImagesForPreloading();
        this.root = this.attachShadow({ mode: "open" });
        this.root.appendChild(clockTemplate.content.cloneNode(true));
    }

    connectedCallback() {
        this._updateRendering();
    }

    _loadImagesForPreloading() {
        try {
            fetch(nextcloudUrl)
                .then(function (response) {
                    return response.json();
                })
                .then((myJson) => {
                    const { result } = myJson;
                    if (this.nextImages[this.nextImages.length - 1] !== result)
                        this.nextImages.push(myJson.result);
                    else 
                        console.log("Did not add next image because it's the same as the last")
                        setTimeout(() => {
                            if (this.nextImages.length < 100) {
                                this._loadImagesForPreloading();
                            }
                        }, 500);
                })
                .catch((reason) => {
                    console.error("a query failed. retry later", reason)
                    setTimeout(() => {
                        if (this.nextImages.length < 100) {
                            this._loadImagesForPreloading();
                        }
                    }, 10000);
                });
        } catch (err) {
            setTimeout(() => {
                if (this.nextImages.length < 100) {
                    this._loadImagesForPreloading();
                }
            }, 10000);
        }
    }

    _changeBackgroundImage() {
        if (this.nextImages.length < 1) {
            return this._loadImagesForPreloading();
        } else if (this.nextImages.length < 10) {
            this._loadImagesForPreloading();
        }
        const nextImage = this.nextImages.shift();
        this.prevImages.push(nextImage);
        if (this.prevImages.length > 100) this.prevImages.shift();
        this._backgroundImage = nextImage;
        this._updateRendering();
    }

    _updateRendering() {
        const div = this.root.querySelector(".background");
        div.style.backgroundImage = `url("${this._backgroundImage}")`;
    }
}

window.customElements.define(key, NextCloudGallery);
