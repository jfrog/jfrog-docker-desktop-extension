<div align="center">

![Docker pulls](https://img.shields.io/docker/pulls/jfrog/jfrog-docker-desktop-extension?label=Docker%20Pulls&logo=Docker&style=for-the-badge)

[![Docker-Desktop-Extension-863x300-1](https://user-images.githubusercontent.com/29822394/167862029-11997794-9d66-4688-a5ff-698beebf50e4.png)](https://jfrog.com/blog/get-peace-of-mind-about-security-when-deploying-containers-from-docker-desktop/)

# JFrog Docker Desktop Extension

</div>

## General

The JFrog Docker Desktop Extension scans any of your local Docker images for security vulnerabilities.
Any image, after it has been built or pulled locally, can be scanned immediately.
The scanning process is based on [JFrog Xray's](https://jfrog.com/xray/) vast vulnerabilities database, which is continuously updated with the latest vulnerabilities.
In addition, a dedicated Security Research Team within JFrog, continuously improves the JFrog Xray's detection methods, ensuring that Xray continues to be a leading security solution in the market.

https://user-images.githubusercontent.com/29822394/167414572-df6b2d4f-9c77-4d93-9c82-500057e2ffda.mov

## Deep recursive scanning

When an image is scanned with the JFrog Extension, Xray recursively scans every package included in the Docker Image.
Drilling down to analyze even the smallest binary component that affects your software.
For example, when analyzing a Docker image, if Xray finds that it contains a Java application it will also analyze all the .jar files used in this application.

## Fixed versions

The JFrog Extension not only allows the detection of vulnerable packages, but also displays the software versions that include the fixes, allowing you to upgrade the vulnerable packages and resolve the issue.

## Easy and intuitive interface

We made sure that the UI is really easy, intuitive and user-friendly.
After selecting the image to scan, the vulnerabilities are displayed in a table, sorted by the issue severity.
Furthermore, you can filter the displayed vulnerabilities using a simple search.

When clicking on a specific vulnerability, the view is expanded, to also include the issue description, online references about the issue, and a graph showing the location of the vulnerability within the image.

## It is all available for free

Using the JFrog Extension doesn't require a paid JFrog subscription.
Follow these directions to proceed, based on your use case:

- If you already have a JFrog environment which includes Xray, all you need to do is set the connection details through the UI.
- If you don't have a JFrog environment, JFrog supports setting up an environment for free. The extension will then connect to this environment automatically. Please note that this new JFrog environment will be available for you as long as you need it.

##
