# DEPRECATION NOTICE

We introduced new sdk that merge [js-sdk](https://github.com/tokend/js-sdk) and [js-base](https://github.com/tokend/js-base). Also the new package has more tools to work with up to date Horizon and Api servers. The current repo is fully deprecated, it is absolutely incompatible with the current system and are not going to be updated. Use this repo instead: [https://github.com/tokend/new-js-sdk](https://github.com/tokend/new-js-sdk)

# JS Base

The js-base library is the lowest-level helper library.  It consists of classes
to read, write, hash, and sign the xdr structures that are used in core.
This is an implementation in JavaScript that can be used on either Node.js or web browsers.
js-base is fork of [js-stellar-base](github.com/stellar/js-stellar-base)

> **Warning!** Node version of this package is using [`ed25519`](https://www.npmjs.com/package/ed25519) package, a native implementation of [Ed25519](https://ed25519.cr.yp.to/) in Node.js, as an [optional dependency](https://docs.npmjs.com/files/package.json#optionaldependencies). This means that if for any reason installation of this package fails, `stellar-base` will fallback to the much slower implementation contained in [`tweetnacl`](https://www.npmjs.com/package/tweetnacl).
>
> If you are using `js-base` in a browser you can ignore this. However, for production backend deployments you should definitely be using `ed25519`. If `ed25519` is successfully installed and working `StellarBase.FastSigning` variable will be equal `true`. Otherwise it will be `false`.

## Updating XDR

To generate or update XDR run `generateXDR.sh` with providing it branch name or commit hash of the needed XDR version.

## License
js-stellar-base is licensed under an Apache-2.0 license. See the [LICENSE](./LICENSE) file for details.
