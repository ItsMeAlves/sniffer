var root = new Vue({
    el: "#app",
    data: {
        packets: [1,2,3],
        actionButton: "Start!"
    },
    methods: {
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
    root.packets = [10, ...root.packets];
});
