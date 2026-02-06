module.exports = {
    expo: {
        name: "InternSync",
        slug: "interSync_Mobile",
        version: "1.0.0",
        description: "InternSync connects students with internships seamlessly. Simplified applications and career tracking.",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "internsyncmobile",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.olaotesile.internsync",
            privacyPolicyUrl: "https://internsync.com/privacy",
            buildNumber: "7",
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false
            }
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#000000"
            },
            edgeToEdgeEnabled: true,
            package: "com.olaotesile.internsync",
            privacyPolicyUrl: "https://internsync.com/privacy",
            versionCode: 7
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png"
        },
        plugins: [
            "expo-router",
            [
                "expo-splash-screen",
                {
                    "image": "./assets/images/splash-icon.png",
                    "imageWidth": 200,
                    "resizeMode": "contain",
                    "backgroundColor": "#000000"
                }
            ],
            "expo-font",
            "expo-secure-store",
            "expo-web-browser",
            "expo-dev-client"
        ],
        experiments: {
            typedRoutes: true
        },
        extra: {
            router: {},
            eas: {
                projectId: "369333f0-bbe3-49e0-afce-81e3c0ffa108"
            },
            // 🔐 Environment Variables for Production
            firebaseApiKey: process.env.FIREBASE_API_KEY || "AIzaSyBhnS7Klo4XcksmSVmD2RtN7ckpz3p9xX8",
            firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || "internsync-435f0.firebaseapp.com",
            firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "internsync-435f0",
            firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || "internsync-435f0.appspot.com",
            firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || "1028469357708",
            firebaseAppId: process.env.FIREBASE_APP_ID || "1:1028469357708:web:d936783ea35e74eb114fa9",
            firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID || "G-N5B7HE8C7K",
            apiBaseUrl: process.env.API_BASE_URL || "https://internsync-production.up.railway.app"
        }
    }
};
