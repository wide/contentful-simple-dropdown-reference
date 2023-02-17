This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

This app is here to provide a custom and simple dropdown rendering for entry reference.
It solves the issue explained here : https://stackoverflow.com/questions/67280282/how-can-i-set-different-label-and-value-for-dropdown-fields-in-contentful

## Install the app

[![Install to Contentful](https://www.ctfstatic.com/button/install-small.svg)](https://app.contentful.com/deeplink?link=apps&id=6s62y3vRQADfGeyoP8bXCk)

## Configuration

Once the app is installed:

1. Create a "Reference" field in the content type you want to use it.
2. Define its type as "One reference" and validate.
3. In the "Appeareance" tab, select "Simple dropdown reference"
4. In "Validation" tab, select the content types you want to be retrieved in the dropdown list
5. Click "Confirm", that's it

You should be able to see a dropdown list to select a reference in the related content entry.


## Learn More

[Read more](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/) and check out the video on how to use the CLI.

Create Contentful App uses [Create React App](https://create-react-app.dev/). You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started) and how to further customize your app.
