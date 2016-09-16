function ipv4(packetData) {
    var versionAndLength = packetData.slice(0, 1).join("");
    var tos = packetData.slice(1, 2).join("");
    var totalLength = packetData.slice(2, 4).join("");
    var id = packetData.slice(4, 6).join("");
    var flagsAndOffset = packetData.slice(6, 8).join("");
    var ttl = packetData.slice(8, 9).join("");
    var protocol = packetData.slice(9, 10).join("");
    var checksum = packetData.slice(10, 12).join("");
    var srcIp = packetData.slice(12, 16).map((x) => {
        return parseInt(x, 16);
    }).join(".");
    var destIp = packetData.slice(16, 20).map(x => {
        return parseInt(x, 16);
    }) .join(".");

    console.log(srcIp);
    console.log(destIp);
    return {
        versionAndLength,
        tos,
        totalLength,
        id,
        flagsAndOffset,
        ttl,
        protocol,
        checksum,
        srcIp,
        destIp
    };
}

function ipv6(packetData) {
return {};
}

function arp(packetData) {
return {};
}

function tcp(packetData) {
return {};
}

function udp(packetData) {
return {};
}

module.exports = {
    linkLayer(packetData) {
        var destMac = packetData.slice(0, 6).join(":");
        var srcMac = packetData.slice(6, 12).join(":");
        var type = packetData.slice(12, 14).join("");

        return {
            destMac, srcMac, type
        };
    },
    networkLayer(packetData, type) {
        if(!type)
            return {};
        switch(type.toUpperCase()) {
    		case "0800":
    			return ipv4(packetData);
    			break;
            case "86DD":
                return ipv6(packetData);
                break;
    		case "0806":
                return arp(packetData);
    			break;
    		default:
    			return {};
    	}
    },
    transportLayer(packetData, protocol) {
        if(!protocol)
            return {};
        switch(protocol.toUpperCase()) {
            case "06":
                return tcp(packetData);
                break;
            case "17":
                return udp(packetData);
                break;
            default:
                return {}
        }
    }
}
