const geoip = require('geoip-lite');
const logsController = require('./logsController');

addressController = {
    getPhysicalAddressByIp(userId, ipAddress) {
        let region = "";

        try {
            const geoData = geoip.lookup(ipAddress);
            region = geoData ? geoData.region : "";
        } catch(error) {
            logsController.logMessage(6, userId, ipAddress, `Error getting the physical address from ip: ${error}`);
        }
        
        return region;
    }
};

module.exports = addressController;

/* Regions in Israel: 
    D - HaDarom
    M - HaMerkaz
    Z - HaTsafon
    HA - Haifa
    TA - Tel Aviv
    JM - Jerusalem
*/
