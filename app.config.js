module.exports = {
    expo: {
        name: "InternSync",
        slug: "interSync_Mobile",
        version: "1.1.2",
        description: "InternSync connects students with internships seamlessly. Simplified applications and career tracking.",
        orientation: "portrait",
        icon: "./assets/images/icon.png",
        scheme: "internsyncmobile",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        ios: {
            supportsTablet: false,
            bundleIdentifier: "com.internsync.app",
            privacyPolicyUrl: "https://internsync.com/privacy",
            buildNumber: "13",
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
                UIRequiresFullScreen: true,
                NSPhotoLibraryUsageDescription: "InternSync needs access to your photo library to allow you to upload a profile picture and save internship-related documents directly to your professional profile."
            }
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/adaptive-icon.png",
                backgroundColor: "#000000"

            },
            edgeToEdgeEnabled: true,
            package: "com.internsync.app",
            privacyPolicyUrl: "https://internsync.com/privacy",
            versionCode: 13
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
            // 🔐 Environment Variables
            firebaseApiKey: process.env.FIREBASE_API_KEY,
            firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
            firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
            firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
            firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
            firebaseAppId: process.env.FIREBASE_APP_ID,
            firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
            apiBaseUrl: process.env.API_BASE_URL || "https://internsync-production.up.railway.app"
        }
    }
};
