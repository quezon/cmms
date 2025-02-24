# Atlas CMMS Mobile App

This project aims to help manage assets, schedule maintenance and track work orders. This is the mobile app developed
with React Native.
You can see more explanations in [Purpose.pdf](Purpose.pdf). We would be very happy to have new contributors join us.
**And please star the repo**.

**Screenshot**:

<img src="https://i.ibb.co/B39dVjC/Screenshot-20230320-110652.jpg" width="300"/>
<img src="https://i.ibb.co/NWSfcpq/Screenshot-20230320-111216.jpg" width="300"/>

## Start/run

```shell
npm run android
```

## Build
You will need to create an [expo](https://expo.dev) account
Place `google-services.json` in the root folder
```shell
eas build --profile previewAndroid --platform android
```
It will generate an apk in expo.
## Configuration

Set these environment variables

| Name       | Required | Description         | Default Value |
|------------|----------|---------------------|---------------|
| API_URL    | Yes      | Your public api url | (empty)       |
| JWT_SECRET | Yes      | The JWT secret key  | (empty)       |

## Getting help

If you have questions, concerns, bug reports, etc, please file an issue in this repository's Issue Tracker or send an
email at ibracool99@gmail.com.

## Getting involved

You can contribute in different ways. Sending feedback on features, fixing certain bugs, implementing new features, etc.
Instructions on _how_ to contribute can be found in [CONTRIBUTING](CONTRIBUTING.md).
