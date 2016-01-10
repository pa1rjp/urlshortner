module.exports = {

	// the database url to connect
        "url": "mongodb://54.169.137.14:27017,54.169.137.14:27018,54.169.137.14:27019/dev-website",
        "options": {
            "server": {
                "socketOptions": {
                    "keepAlive": 1
                }
            },
            "user": "dev-website",
            "pass": "DevWeBsiTE#@!2015",
            "auto_reconnect": true
        }
}
