

--Internsync

What is Internsync?
Internsync helps students and job seekers discover and apply for opportunities Tinder-style.
Companies can upload job listings from the web platform, and users browse and apply through the mobile app.
Behind the scenes, there is the backend connecting everything together (big up Harrison).

So if something breaks or doesn’t load right, check the backend or the web app too. This is just one piece of a much bigger chain.


Tech Stack-

-React Native + Expo
-NativeWind (for styling; please do not touch this part, I grew gray hairs making it behave)
-Firebase (authentication and config inside services/firebaseConfig.js)
-React Context API (for state management; yes, I know, not my proudest decision)
Other libraries can be found in package.json. If you are curious or brave, open it at your own risk.

Folder Overview-
You will find your way around after a few minutes (or hours, depending on your luck).

How to Run-
1. Install dependencies
2. npm install
3. Start the app - npx expo start(clear cache as often as you can)
4. Pray to God or the universe (whatever you believe in).

Authentication-
Firebase handles user authentication.
All related setup and logic live inside: ./services/firebaseConfig.js


Environment Setup-
Before running the app, make sure your environment variables (Firebase keys, API URLs, and so on) are set up properly.
Check the sample file: .env.example
or look inside: ./services/firebaseConfig.js