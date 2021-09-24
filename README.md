# ListApp

### The project has WIP status

## Run the project
Before running the project you should setup your environment
### Prepare the environment
To prepare the environment follow the procedure described in react-native [docs](https://reactnative.dev/docs/environment-setup) up to ```Creating a new application``` chapter 
### Install node_modules and pods
In order to install node_modules and pods you should use terminal to navigate to the project root and run ```npm i && cd ios/ && pod install && cd ../```
### Configure .env file
The project depends on https://www.myapifilms.com/ API, hence to use the app you should get API token first [here](https://www.myapifilms.com/token.do).

After obtaining token create .env file in the root of the project. The file should content ```MY_API_FILMS_TOKEN=[your api token]``` 
### Lunch the project
#### iOS
To run the project on iOS run following command from the project root ```npx react-native run-ios```
#### Android
To run the project on Android run following command from the project root ```npx react-native run-android```
