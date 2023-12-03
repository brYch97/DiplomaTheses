
# FormSurveyJS PCF

This PCF allows you to create interactive forms that can include other PCF components. The PCF also supports prefilling user information based on the JSON provided in the `br_identityclaim` field in the `Contact` table. 

The PCF can exist in four modes:


- **Field Designer:**
  - Used for creating pre-prepared fields that can be utilized in the creation of templates and forms. This component is deployed on the Power Apps form of the `CustomField` table.

- **Template Designer:**
  - Used for designing templates that can be used in the creation of forms. This component is deployed on the Power Apps form of the `Template` table.

- **Form Designer:**
  - Used for creating forms intended for completion by individuals. The form component is deployed on the Power Apps form of the `Form` table.

- **Client Input:**
  - Used for filling out forms and reading obtained responses. The form component is deployed on the Power Apps form of the `Response` table.



## Building the component

- Install [Node.js](https://nodejs.org/)
- Run the following command in the source folder:
```bash
npm install
npm run build
```
## Publishing to your Power Apps environment

The PCF can be pushed to your Power Apps environment by following [this guide](https://d365spartan.wordpress.com/2019/09/12/powerapps-component-framework-pcf-push/).



