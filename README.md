# Angular Ecommerce with Spring Boot

This is a full stack project made with angular and spring boot

The app is still in progress

[//]: # (## Screenshots)

[//]: # ()
[//]: # (![Project Screenshot]&#40;images/1.png&#41;)

[//]: # (![Project Screenshot]&#40;images/2.png&#41;)

[//]: # (![Project Screenshot]&#40;images/3.png&#41;)


## Tools Used

- Angular 18
- Spring boot with maven
- Postgresql
- Stripe (payment)
- Okta (auth)


## Environment Variables

To run this project, you will need to create your application.properties file:

`spring.datasource.url`

`spring.datasource.username`

`spring.datasource.password`

`spring.data.rest.base-path=/api`

`allowed.origins=https://localhost:4200`

`spring.data.rest.detection-strategy=ANNOTATED`


## Run Application

## From Spring Boot
```bash
  mvn spring-boot:run
```
## From Angular:
```bash
  ng serve
```

## Authors

- [@Juan Ignacio Caprioli (ChanoChoca)](https://github.com/ChanoChoca)


## Badges

[//]: # (Add badges from somewhere like: [shields.io]&#40;https://shields.io/&#41;)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![GPLv3 License](https://img.shields.io/badge/License-GPL%20v3-yellow.svg)](https://opensource.org/licenses/)
[![AGPL License](https://img.shields.io/badge/license-AGPL-blue.svg)](http://www.gnu.org/licenses/agpl-3.0)
