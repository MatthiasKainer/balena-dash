const registeredHandlers = {};

(function () {
function eventLoop() {
    Object.keys(registeredHandlers).forEach(handlerName => {
        const handler = registeredHandlers[handlerName];
        handler.ticks--;
        if (!handler.stopped && handler.ticks < 0) {
            console.log(`[Handler] Triggering ${handlerName}`);
            handler.run();
            handler.ticks = handler.duration;
        }
    })
    setTimeout(eventLoop, 100)
} 
eventLoop();
})();

function registerHandler(name, options = {
    ticks: Number.MAX_SAFE_INTEGER,
    duration: Number.MAX_SAFE_INTEGER,
    run: () => {}
}) {
    registeredHandlers[`${name}`] = options;
}