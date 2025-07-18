# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.3.0](https://github.com/uamanager/homebridge-calendar-scheduler/compare/v2.2.2...v2.3.0) (2025-07-08)


### Features

* update deps and migrate functionality ([530014a](https://github.com/uamanager/homebridge-calendar-scheduler/commit/530014aa599569c3a6c3edbb707782bea8f9b215))


### Bug Fixes

* **deps:** update dependency follow-redirects to v1.15.6 [security] ([9ee6ac2](https://github.com/uamanager/homebridge-calendar-scheduler/commit/9ee6ac270246d1fadc075692f535629a50b86edb))

### [2.2.2](https://github.com/uamanager/homebridge-calendar-scheduler/compare/v2.2.1...v2.2.2) (2023-09-16)


### Bug Fixes

* **deps:** update dependency toad-scheduler to v3 ([8483e7f](https://github.com/uamanager/homebridge-calendar-scheduler/commit/8483e7fb8369b17dc098f842825de57a0d23373c))

### [2.1.2](https://github.com/uamanager/homebridge-calendar-scheduler/compare/v2.1.1...v2.1.2) (2023-02-26)

### [2.1.1](https://github.com/uamanager/homebridge-calendar-scheduler/compare/v2.1.0...v2.1.1) (2023-02-05)


### Bug Fixes

* **deps:** fixed yarn lock ([f98e7d6](https://github.com/uamanager/homebridge-calendar-scheduler/commit/f98e7d6a88a5d1ca868e9e599868d006559ff0e5))
* **deps:** update dependency homebridge-util-accessory-manager to v0.0.7 ([3869acf](https://github.com/uamanager/homebridge-calendar-scheduler/commit/3869acf9f5ce28d96df0e6bf7a14c9476b63a026))

## [2.1.0](https://github.com/uamanager/homebridge-calendar-scheduler/compare/v2.0.3...v2.1.0) (2023-01-28)


### Features

* unrestrict notification offset ([054a408](https://github.com/uamanager/homebridge-calendar-scheduler/commit/054a408858e22ee636823631189a136d5d417c0e)), closes [#72](https://github.com/uamanager/homebridge-calendar-scheduler/issues/72)

### [2.0.3](https://github.com/uamanager/homebridge-calendar-scheduler/compare/v2.0.2...v2.0.3) (2023-01-28)


### Bug Fixes

* notifications trigger creation ([7f5f553](https://github.com/uamanager/homebridge-calendar-scheduler/commit/7f5f55354df8d59461018d0fe6edaa9a63498730)), closes [#72](https://github.com/uamanager/homebridge-calendar-scheduler/issues/72)

### [2.0.2](https://github.com/uamanager/homebridge-calendar-scheduler/compare/v2.0.1...v2.0.2) (2023-01-28)


### Bug Fixes

* notifications trigger creation ([60d67f1](https://github.com/uamanager/homebridge-calendar-scheduler/commit/60d67f15f37d145d34d34c5b9f6b782ccb83b140))

### [2.0.1](https://github.com/uamanager/homebridge-calendar-scheduler/compare/v2.0.0...v2.0.1) (2023-01-28)


### Bug Fixes

* notifications config range ([22a719e](https://github.com/uamanager/homebridge-calendar-scheduler/commit/22a719eed8b083646826a67d5da2af35dcb153a4))
* notifications config range ([fc38de9](https://github.com/uamanager/homebridge-calendar-scheduler/commit/fc38de98c2af715d12106dc422f150560a3c35e7))

## [2.0.0](https://github.com/uamanager/homebridge-calendar-scheduler/compare/v1.8.2...v2.0.0) (2023-01-28)


### ⚠ BREAKING CHANGES

* `calendarOffset` option is removed and ignored! Use new
notifications feature instead.

### Features

* caching and notifications ([f9891e8](https://github.com/uamanager/homebridge-calendar-scheduler/commit/f9891e8d05038e72429da3c0efc9310363457332)), closes [#72](https://github.com/uamanager/homebridge-calendar-scheduler/issues/72)
* calendar queries caching ([fb3077d](https://github.com/uamanager/homebridge-calendar-scheduler/commit/fb3077da765e111f52311cd68cebb6929102c716))
* global ticker ([29822e1](https://github.com/uamanager/homebridge-calendar-scheduler/commit/29822e1c1489f8dbae18e0188343d2a1867b2dd1))


### Bug Fixes

* notifications config ([c7f8e30](https://github.com/uamanager/homebridge-calendar-scheduler/commit/c7f8e30ea716e772417574d67f42631346f3d801))
* notifications config ([fa7b620](https://github.com/uamanager/homebridge-calendar-scheduler/commit/fa7b6207fae52ccc66a8bc922906e2785cbfb7a8))
* notifications config ([1114e28](https://github.com/uamanager/homebridge-calendar-scheduler/commit/1114e280762564277423abbbd1c9de401f31d027))

### [1.8.2](https://github.com/uamanager/homebridge-calendar-scheduler/compare/v1.8.1...v1.8.2) (2023-01-25)


### Bug Fixes

* ical parser issues ([76f1a8e](https://github.com/uamanager/homebridge-calendar-scheduler/commit/76f1a8eb0a040b8b2c739a758a04bf9edfbfacd6)), closes [#103](https://github.com/uamanager/homebridge-calendar-scheduler/issues/103)

### [1.8.1](https://github.com/uamanager/homebridge-calendar-scheduler/compare/v1.8.0...v1.8.1) (2023-01-25)


### Bug Fixes

* ical parser issues ([b515790](https://github.com/uamanager/homebridge-calendar-scheduler/commit/b515790b79d508b825f812dbddecbc60e81d1836)), closes [#103](https://github.com/uamanager/homebridge-calendar-scheduler/issues/103)

## [1.8.0](https://github.com/uamanager/homebridge-calendar-scheduler/compare/v1.7.3...v1.8.0) (2023-01-23)


### Features

* accessory manager ([7488f79](https://github.com/uamanager/homebridge-calendar-scheduler/commit/7488f79f78a9d55ea6a1cf6e62f0a0f3a3239c60))


### Bug Fixes

* ical parser ([1a08a8f](https://github.com/uamanager/homebridge-calendar-scheduler/commit/1a08a8f989f57b2d980669249712edfc4e4d1829))

### [1.7.3](https://github.com/uamanager/homebridge-calendar-scheduler/compare/v1.7.2...v1.7.3) (2023-01-19)


### Bug Fixes

* safe event name ([4a6428c](https://github.com/uamanager/homebridge-calendar-scheduler/commit/4a6428c27720bf55c1f30558dc15bafa32fdd172))

### [1.7.2](https://github.com/uamanager/homebridge-calendar-scheduler/compare/v1.7.1...v1.7.2) (2023-01-18)


### Bug Fixes

* less files and changelog ([7e92b76](https://github.com/uamanager/homebridge-calendar-scheduler/commit/7e92b769461d846fefa1ecba45946b1578e5dd9d))
