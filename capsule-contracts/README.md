# Nervos Developer Training Course Script Examples

This repo contains the script examples for the Nervos Developer Training Course.

**These scripts are for example purposes and should not be used in production!**

## Available Scripts

* **always** - A lock script that always succeeds (unlocks). This is also known as the "Always Success" lock script.

* **jsoncell** - A type script that only allows valid JSON strings to be stored as cell data.

## Usage

Build all contracts (debug):

``` sh
capsule build
```

Run all tests:

``` sh
capsule test
```

Build all contracts (release):

``` sh
capsule build --release
```

Build a specific contract (debug):

``` sh
capsule build --name counter
```

Build a specific contract (release):

``` sh
capsule build --name counter --release
```
