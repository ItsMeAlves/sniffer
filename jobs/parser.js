function parseMac(macData) {
    return macData.join(":");
}

function parseIp32(ipData) {
    return ipData.map((x) => {
        return parseInt(x, 16);
    }).join(".");
}

function parseIp128(ipData) {
    var ip = [];

    for(var i = 0; i < 8; i++) {
        ip[i] = ipData[i * 2] + ipData[i * 2 + 1];
    }

    return ip.join(":");
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
    var srcIp = parseIp32(packetData.slice(12, 16));
    var destIp = parseIp32(packetData.slice(16, 20));
    var end = 20;

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
        destIp,
        end
    };
}

function ipv6(packetData) {
    var name = "IPV6";
    var payloadLength = packetData.slice(4,6);
    var nextHeaderId = packetData.slice(6,7).map((x) => {
        return parseInt(x, 16).toString().padLeft("00");
    }).join("");

    var nextHeader = {
        id: nextHeaderId,
        name: translateProtocolField(nextHeaderId)
    };
    var hopLimit = packetData.slice(7,8);
    var srcIpData = packetData.slice(8, 24);
    var destIpData = packetData.slice(24, 40);
    var srcIp = parseIp128(srcIpData);
    var destIp = parseIp128(destIpData);
    var end = 40;

    return {
        name,
        srcIp,
        destIp,
        nextHeader,
        end
    };
}


function arp(packetData) {
    var name = "ARP";
    var hardwareAddressLength = parseInt(packetData.slice(4, 5)[0], 16);
    var protocolAddressLength = parseInt(packetData.slice(5, 6)[0], 16);
    var opcode = parseInt(packetData.slice(6,8).join(""), 16);

    var begin = 8;
    var end = 8 + hardwareAddressLength;
    var senderHardwareAddress = parseMac(packetData.slice(begin, end));

    begin = end;
    end = begin + protocolAddressLength;

    if(protocolAddressLength == 4) {
        senderProtocolAddress = parseIp32(packetData.slice(begin, end));
    }
    else if(protocolAddressLength == 16) {
        senderProtocolAddress = parseIp128(packetData.slice(begin, end));
    }

    begin = end;
    end = begin + hardwareAddressLength

    var targetHardwareAddress = parseMac(packetData.slice(begin, end))
    begin = end;
    end = begin + protocolAddressLength;

    if(protocolAddressLength == 4) {
        targetProtocolAddress = parseIp32(packetData.slice(begin, end));
    }
    else if(protocolAddressLength == 16) {
        targetProtocolAddress = parseIp128(packetData.slice(begin, end));
    }

    return {
        name,
        opcode: {
            id: opcode,
            type: (opcode == 1)? "Request" : "Reply"
        },
        senderHardwareAddress,
        senderProtocolAddress,
        targetHardwareAddress,
        targetProtocolAddress,
        end
    };
}

function tcp(packetData) {
    var name = "TCP";
    return {
        name
    };
}

function udp(packetData) {
    var name = "UDP";
    return {
        name
    };
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
