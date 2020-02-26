
const versionUpgrade = "version-upgrade";

const versionUrl = `/${versionUpgrade}/version`;


const timeElapsed = (a) =>
    Math.floor((a - new Date(Date.now())) / 1000 * 60 * 60 * 24);

class VersionUpgrade extends HTMLElement {
    currentVersion = undefined;
    lastRefresh = undefined;

    constructor() {
        super();
        registerHandler(versionUpgrade, {
            ticks: 1500,
            duration: 1500,
            run: () => this._compare()
        });
    }

    _compare() {
        fetch(versionUrl)
            .then(function (response) {
                return response.json();
            })
            .then(({ version }) => {
                if (!this.currentVersion) {
                    this.lastRefresh = new Date(Date.now());
                    this.currentVersion = version;
                }
                if (this.currentVersion !== version) {
                    window.location.reload();
                } else if (timeElapsed(this.lastRefresh) > 1) {
                    window.location.reload();
                }
            });
    }
}
window.customElements.define(versionUpgrade, VersionUpgrade);



