
const versionUpgrade = "version-upgrade";

const versionUrl = `/${versionUpgrade}/version`;


const timeElapsed = (a) =>
    Math.floor((a - new Date(Date.now())) / 1000 * 60 * 60 * 24);

const nextRefresh = () => {
    const result = new Date(Date.now().getFullYear(), Date.now().getMonth(), Date.now().getDay(), 0, 0, 0);
    result.setDate(result.getDate() + 1);
    return result;
}

const doRefresh = (date) => new Date(Date.now()) > date;

class VersionUpgrade extends HTMLElement {
    currentVersion = undefined;
    nextPlannedRefresh = undefined;

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
                    this.nextPlannedRefresh = nextRefresh();
                    this.currentVersion = version;
                }
                if (this.currentVersion !== version) {
                    window.location.reload();
                } else if (doRefresh(this.nextPlannedRefresh)) {
                    window.location.reload();
                }
            });
    }
}
window.customElements.define(versionUpgrade, VersionUpgrade);



