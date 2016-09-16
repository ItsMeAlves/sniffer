var root = new Vue({
    el: "#app",
    data: {
        packets: [],
        device: "wlan0",
        filter: "",
        actionButton: "Start!"
    },
    methods: {
        clean() {
            this.packets = [];
        },
        action() {
            if(this.actionButton.match("Start")) {
                socket.emit("start", {});
                this.actionButton = "Stop!";
            }
            else if(this.actionButton.match("Stop")) {
                socket.emit("stop", {});
                this.actionButton = "Start!";
            }
        }
    }
});

socket.on("packet", (data) => {
    root.packets = [data, ...root.packets];
});
