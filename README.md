

--Internsync

Lead Mobile Developer: Ola Otesile
Contributors: Emeka Iwuagwu, Naivedya Bhuyan (please add your name if you change anything in the code)

Introduction-
To whoever, for whatever reason, has opened this codebase...

You’re probably here to change something.
You’re also probably going to wish you didn’t.

If I’m not dead, your best shot is to just page me for help. Only God and a small, really small part of me truly understand what’s going on in here.

That said, welcome to the core of Internsync.

Hours wasted here: 43hrs
(please increase this count as it applies to you)

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
The structure is... custom.
But it works. Mostly.
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

Final Words-
If it breaks, it is probably your fault.
If it works, you are welcome.

“Built with confusion, persistence, and God's help.” 
– Ola Otesile