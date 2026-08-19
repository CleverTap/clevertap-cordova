// swift-tools-version:5.9

import PackageDescription

let package = Package(
    name: "clevertap-cordova",
    platforms: [.iOS(.v13)],
    products: [
        .library(name: "clevertap-cordova", targets: ["clevertap-cordova"])
    ],
    dependencies: [
        .package(url: "https://github.com/apache/cordova-ios.git", from: "8.0.0"),
        .package(url: "https://github.com/CleverTap/clevertap-ios-sdk.git", from: "7.8.0")
    ],
    targets: [
        .target(
            name: "clevertap-cordova",
            dependencies: [
                .product(name: "Cordova", package: "cordova-ios"),
                .product(name: "CleverTapSDK", package: "clevertap-ios-sdk"),
                .product(name: "CleverTapLocation", package: "clevertap-ios-sdk")
            ],
            path: "src/ios",
            publicHeadersPath: "."
        )
    ]
)
