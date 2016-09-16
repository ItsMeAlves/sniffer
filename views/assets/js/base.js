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
                socket.emit("start", {
                    device: this.device,
                    filter: this.filter
                });
                this.actionButton = "Stop!";
            }
            else if(this.actionButton.match("Stop")) {
                socket.emit("stop");
                this.actionButton = "Start!";
            }
        }
    }
});

socket.on("packet", (data) => {
    if(root.packets.length > 100) {
        root.packets = [data, ...root.packets.slice(0, 99)];
    }
    else {
        root.packets = [data, ...root.packets];
    }
});
