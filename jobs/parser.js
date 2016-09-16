function translateProtocolField(id) {
    switch(id) {
        case "06":
            return "TCP";
            break;
        case "17":
            return "UDP";
            break;
        default:
            return "UNKNOWN";
    }
}

function ipv4(packetData) {
    var name = "IPV4";
    var versionAndLength = packetData.slice(0, 1).join("");
    var tos = packetData.slice(1, 2).join("");
    var totalLength = packetData.slice(2, 4).join("");
    var id = packetData.slice(4, 6).join("");
    var flagsAndOffset = packetData.slice(6, 8).join("");
    var ttl = packetData.slice(8, 9).join("");
    var protocolId = packetData.slice(9, 10).map((x) => {
        return parseInt(x, 16).toString().padLeft("00");
    }).join("");
    var protocol = {
        id: protocolId,
        name: translateProtocolField(protocolId)
    }
    var checksum = packetData.slice(10, 12).join("");
    var srcIp = packetData.slice(12, 16).map((x) => {
        return parseInt(x, 16);
    }).join(".");
    var destIp = packetData.slice(16, 20).map(x => {
        return parseInt(x, 16);
    }) .join(".");

    return {
        name,
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
    var name = "IPV6";
    return {
        name
    };
}

function arp(packetData) {
    var name = "ARP";
    return {
        name
    };
}

function tcp(packetData) {
return {};
}

function udp(packetData) {
return {};
}

function translateTypeField(id) {
    switch(id) {
        case "0800":
            return "IPV4";
            break;
        case "0806":
            return "ARP";
            break;
        case "86DD":
            return "IPV6";
            break;
        default:
            return "UNKNOWN";
    }
}

module.exports = {
    linkLayer(packetData) {
        var destMac = packetData.slice(0, 6).join(":");
        var srcMac = packetData.slice(6, 12).join(":");
        var id = packetData.slice(12, 14).join("").toUpperCase();
        var idName = translateTypeField(id);
        var type = {
            id: id,
            name: idName
        };
        var name = "Ethernet";

        return {
            name, destMac, srcMac, type
        };
    },
    networkLayer(packetData, type) {
        if(!type)
            return {};
        switch(type.id) {
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
        switch(protocol.id) {
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
