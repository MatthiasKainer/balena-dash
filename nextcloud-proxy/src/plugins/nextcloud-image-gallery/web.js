const clockTemplate = document.createElement('template');

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
    constructor() {
        super();
        this._backgroundImage = `/${key}/random.jpg`;
        registerHandler("nextcloud-gallery", {
            ticks: 1500,
            duration: 1500,
            run: () => this._changeBackgroundImage()
        });
        ["click", "touchstart", "touchend", "touchmove"].forEach(eventType => {
            this.addEventListener(eventType, () => {
                registeredHandlers["nextcloud-gallery"].ticks = 0;
            })
        });
        this.root = this.attachShadow({ mode: "open" });
        this.root.appendChild(clockTemplate.content.cloneNode(true));
    }
    
    connectedCallback() {
        this._updateRendering();
    }

    _changeBackgroundImage() {
        try {
            fetch(nextcloudUrl)
                .then(function (response) {
                    return response.json();
                })
                .then((myJson) => {
                    this._backgroundImage = myJson.result;
                    this._updateRendering();
                });
        } catch (err) { }
    }

    _updateRendering() {
        const div = this.root.querySelector(".background");
        div.style.backgroundImage = `url("${this._backgroundImage}")`
    }
    
}

window.customElements.define(key, NextCloudGallery);



