
# Anime Random

  Anime Random helps you find your next anime. Over 9000 anime recommendations, you can get a retro anime from the '80s to a current anime. Slide up to discover a new anime, add filters like the type and genre to get a more accurate recommendation. Found an anime that catches your attention? Slide it down to save it into your list!
 


## Screenshots

<div style="display:flex;flex-direction:row;" >
  <img src="https://raw.githubusercontent.com/Bryancm/random_anime/master/assets/1.png?token=AEI2HV4BKFE52SN3WSZAADDBC46DG" width="260" height="589" />
  <img src="https://raw.githubusercontent.com/Bryancm/random_anime/master/assets/2.png?token=AEI2HV4BKFE52SN3WSZAADDBC46DG" width="260" height="589" />
  <img src="https://raw.githubusercontent.com/Bryancm/random_anime/master/assets/3.png?token=AEI2HV4BKFE52SN3WSZAADDBC46DG" width="260" height="589" />
</div>

  
## Tech Stack

- [React Native](https://reactnative.dev)
- [Expo](https://expo.dev)
- [Expo Ads Admob](https://docs.expo.dev/versions/latest/sdk/admob/)
- [Expo Sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/)
- [React Navigation](https://reactnavigation.org)
- [Lottie React Native](https://github.com/lottie-react-native/lottie-react-native)


  
## Folder Structure

    ├── .expo-shared               # Internal expo folder
    ├── animations                 # Spring and timing animations using react native reanimated
    ├── assets                     # Anime DB, images and lottie animations
    ├── components                 # UI components, (it has the AdBanner wich needs a banner id from admob)
    ├── db                         # DB Access and queries
    ├── navigator                  # App navigator (React navigation)
    ├── screens                    # Main screens that the app navigator use
    ├── App.js                     # Main App file
    ├── app.json                   # App config like name, version, splashscreen and admob id
    ├── package.json               # Dependencies, scripts and project details
    └── README.md

    
## Installation

You need to have installed [Expo CLI](https://docs.expo.dev/get-started/installation/)
```bash  //iOS
//Install de command tools
npm install --global expo-cli
```
Install dependencies
```bash  //iOS
//Navigate to the project folder and run
expo install
```
## Run it

- In Physical device
```bash  //iOS
//Start the server
expo start
```
Install the [Expo Go App](https://expo.dev/client) and select the Anime Random app

- in iOS emulator
```bash  //iOS
expo ios
 ```

 - in Android emulator
```bash  //iOS
expo android
 ```

 
## Roadmap

- Refactor the homescreen and card detail screen

- Update the anime database

    
## Support

For support, email me bryan.mtzs@gmail.com or send me a message on twitter [@bryanmtzw](https://twitter.com/bryanmtzw)

  
## Contributing

Contributions are always welcome!

You can contribute using the GitHub Flow (create a branch, commit changes, and open a pull request)
  
