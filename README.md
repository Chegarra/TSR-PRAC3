# Structure

## tsrimage 

contains the Dockerfile that must be used to setup the image used in Lab3 of TSR.
This image is built on top of the base archlinux image, and includes all software needed to 
run your components in lab3, except, perhaps, the npm packages your software actually needs.

The name we give it is tsir/baselab3. This image should be the starting point for all the other images defined within this lab

## components
Contain two basic examples for this Lab.
In both cases we follow the convention of declaring the "main" in package.json
to point to config/default.js

By doing so we can use the "require" object ot resolve relative paths, and, besides,
gain access to the configuration definition for the comopnent from within the
basic deployer code.

### balancer
This is a program that accepts web requests, and transforms them into zmq messages
that get delivered to a set of workers connected to its router socket.

### frontend
This is a zmq program connecting to a balancer. It accepts requests via zmq, and returns responses using zmq too

## examples
### service
This is an exemple of a service definition. It is quite basic, and shows how components are located
and what image names are expected for them

### deployment
Also a very simple deployment description.
The description has a pointer to the service definition.
Then it contains bindings for external ports of the components
and for their declared configurable parameters.

## basicdeployer
This directory contains the module implementing the basic functions to deploy a service
defined following the simple guidelines exemplified within the *examples* directory.

## deployer.js
This is a script which can be used to launch a deployment defined as exemplified by *examples/deployment*

