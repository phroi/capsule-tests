# Capsule Tests

This repo contains some capsule tests adapted from the Nervos Developer Training Course.

This repo has been created with the purpose of showing the current issues affecting all `Capsule >0.7.3`. This repo represent the minimal code to reproduce these issues.

[Executing these tests](https://github.com/phroi/capsule-tests) shows that `Capsule 0.9.0` with `rustc 1.63.0` suffer from:

* `VM Internal Error: MemOutOfBound` when executing any non trivial script.
* `Transaction timeout` when executing `always` success script.

**Note:** creating and executing tests for these scripts will not manifest these issues without a full CKB VM environment.

The same scripts compiled with `Capsule 0.7.3` don't have these issues.

Some research on these issues has been done already by [Travis Lee Richardson](https://github.com/TravisLeeRichardson/Capsulev0.9.0-Memory-Config-Issue/blob/main/README.md)  and [Jordan Mack](https://discord.com/channels/657799690070523914/834511268873895956/1086895949370118234).

## Setup

0. Install `Git (2.25.1)`
1. Install `Node.js 16 LTS (16.19.1)`
2. Install `Rust (1.63.0)`
3. Install `Capsule 0.9.0`
4. Download [`ckb 0.107.0`](https://github.com/nervosnetwork/ckb-indexer/releases/tag/v0.4.2)
5. Download [`ckb-indexer 0.4.2`](https://github.com/nervosnetwork/ckb-indexer/releases/tag/v0.4.2)
6. Extract the `ckb 0.107.0` folder and renamed it to `~/ckb`
7. Extract and move `ckb-indexer` binary into `~/ckb`
8. [Configure devchain](https://docs.nervos.org/docs/basics/guides/devchain)
9. Enable the internal ckb indexer in `ckb.toml`, so  `modules = ["Net", "Pool", "Miner", "Chain", "Stats", "Subscription", "Experiment", "Debug", "Indexer"]`
10. [Update the Chain Hashes in `user/capsule-tests/lumos-tests/config.json`](https://nervos.gitbook.io/developer-training-course/lab-exercise-setup#update-your-chain-hashes-in-config.json)
11. Clone the `Capsule Tests repository`: `git clone https://github.com/phroi/capsule-tests.git`

Now on one terminal, launch the following command to start (and stop with `Ctrl+C`) all the needed service processes:

`(trap 'kill -INT 0' SIGINT; cd ~/ckb/; ckb run & sleep 1 && ckb miner & sleep 1 && ckb-indexer -s ~/ckb/indexer-data)`

On the other terminal execute the tests. The following tests are currently available:

* `node index.js ../capsule-contracts/build/release/jsoncell`
* `node index.js ../capsule-contracts/build/release/jsoncell_capsule_0.7.3`
* `node index.js ../capsule-contracts/build/release/always`
* `node index.js ../capsule-contracts/build/release/always_capsule_0.7.3`

## Full Logs for `Capsule 0.9.0`

### Log of `jsoncell` compiled with `Capsule 0.9.0`

```bash
user@host:~/capsule-tests/lumos-tests$ node index.js ../capsule-contracts/build/release/jsoncell
Now setting up Cells for tests. Please wait....................................

DEPLOY CODE

Cell Deps:
  - dep_type: dep_group
    out_point: 0x5630cbcc5620009aa9e87ce5a2d46b2a42831bfb95d0b2113e57d446dae82cdd-0x0
Inputs:
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0x2ee770e176fc05ae4e156f806571c8b12504ebf0d9c56a77f74e595f1cbac6ef-0x0
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0x2ee770e176fc05ae4e156f806571c8b12504ebf0d9c56a77f74e595f1cbac6ef-0x1
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0x2ee770e176fc05ae4e156f806571c8b12504ebf0d9c56a77f74e595f1cbac6ef-0x2
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0x2ee770e176fc05ae4e156f806571c8b12504ebf0d9c56a77f74e595f1cbac6ef-0x3
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0x2ee770e176fc05ae4e156f806571c8b12504ebf0d9c56a77f74e595f1cbac6ef-0x4
Outputs:
  - capacity: 4,678,100,000,000 Shannons (46,781.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
  - capacity: 321,899,900,000 Shannons (3,218.9990 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
TX Fee: 100,000 Shannons

Transaction Sent: 0x75db7162c8ff8f5b9297b67d2578a70e552f17e9e364c6d7ba99def4b5ee7d4b

Waiting for transaction to confirm...............................

CREATE CELLS

Cell Deps:
  - dep_type: dep_group
    out_point: 0x5630cbcc5620009aa9e87ce5a2d46b2a42831bfb95d0b2113e57d446dae82cdd-0x0
  - dep_type: code
    out_point: 0x75db7162c8ff8f5b9297b67d2578a70e552f17e9e364c6d7ba99def4b5ee7d4b-0x0
Inputs:
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0x2ee770e176fc05ae4e156f806571c8b12504ebf0d9c56a77f74e595f1cbac6ef-0x5
Outputs:
  - capacity: 11,600,000,000 Shannons (116.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: 0x2a930792406c785f521fbae485c964537c0ecd4bcb59348868526a888f435881
  - capacity: 988,399,900,000 Shannons (9,883.9990 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
TX Fee: 100,000 Shannons


Error: JSONRPCError
Type: server error
Code: -302
Message: TransactionFailedToVerify: Verification failed Script(TransactionScriptError { source: Outputs[0].Type, cause: VM Internal Error: MemOutOfBound })
Data: Verification(Error { kind: Script, inner: TransactionScriptError { source: Outputs[0].Type, cause: VM Internal Error: MemOutOfBound } })

/home/user/capsule-tests/lumos-tests/lib/index.js:444
   throw new Error("RPC Returned Error!");
         ^

Error: RPC Returned Error!
    at sendTransaction (/home/user/capsule-tests/lumos-tests/lib/index.js:444:10)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at async createCells (/home/user/capsule-tests/lumos-tests/index.js:157:15)
    at async main (/home/user/capsule-tests/lumos-tests/index.js:233:36)

```

### Log of `always` compiled with `Capsule 0.9.0`

```bash
user@host:~/capsule-tests/lumos-tests$ node index.js ../capsule-contracts/build/release/always
Now setting up Cells for tests. Please wait..............................

DEPLOY CODE

Cell Deps:
  - dep_type: dep_group
    out_point: 0x5630cbcc5620009aa9e87ce5a2d46b2a42831bfb95d0b2113e57d446dae82cdd-0x0
Inputs:
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0x902a3f427f0d97f710ac73a19c8c702d70cee26df0cc1f21494330e4a6908fc7-0x0
Outputs:
  - capacity: 877,300,000,000 Shannons (8,773.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
  - capacity: 122,699,900,000 Shannons (1,226.9990 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
TX Fee: 100,000 Shannons

Transaction Sent: 0x7a679ec8527c7af9ee8a8a19ca13c394cedde025dbfe84968bb56e1ff8a11b3e

Waiting for transaction to confirm...............................

CREATE CELLS

Cell Deps:
  - dep_type: dep_group
    out_point: 0x5630cbcc5620009aa9e87ce5a2d46b2a42831bfb95d0b2113e57d446dae82cdd-0x0
  - dep_type: code
    out_point: 0x7a679ec8527c7af9ee8a8a19ca13c394cedde025dbfe84968bb56e1ff8a11b3e-0x0
Inputs:
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0x902a3f427f0d97f710ac73a19c8c702d70cee26df0cc1f21494330e4a6908fc7-0x1
Outputs:
  - capacity: 11,600,000,000 Shannons (116.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: 0x8b5382172ff072fe94ea3fe5c940f342b975839a3302600de931d66ae1512b79
  - capacity: 988,399,900,000 Shannons (9,883.9990 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
TX Fee: 100,000 Shannons

Transaction Sent: 0xb239bc1424cf3fad627e177f987b1d6f576b0979ceddd2d1e99702ae0a57a5f9

Waiting for transaction to confirm............................................................................................................................................................................................................................................................................................................/home/user/capsule-tests/lumos-tests/lib/index.js:505
    return reject(Error("Transaction timeout."));
                  ^

Error: Transaction timeout.
    at /home/user/capsule-tests/lumos-tests/lib/index.js:505:19
```

## Full Logs for `Capsule 0.7.3`

### Log of `jsoncell` compiled with `Capsule 0.7.3`

```bash
user@host:~/capsule-tests/lumos-tests$ node index.js ../capsule-contracts/build/release/jsoncell_capsule_0.7.3
Now setting up Cells for tests. Please wait......................................

DEPLOY CODE

Cell Deps:
  - dep_type: dep_group
    out_point: 0x5630cbcc5620009aa9e87ce5a2d46b2a42831bfb95d0b2113e57d446dae82cdd-0x0
Inputs:
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0xbce94198d216ee4f5ee9653bf4eced4635f1d9b5b4e4418104ca15f7be1dec48-0x0
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0xbce94198d216ee4f5ee9653bf4eced4635f1d9b5b4e4418104ca15f7be1dec48-0x1
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0xbce94198d216ee4f5ee9653bf4eced4635f1d9b5b4e4418104ca15f7be1dec48-0x2
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0xbce94198d216ee4f5ee9653bf4eced4635f1d9b5b4e4418104ca15f7be1dec48-0x3
Outputs:
  - capacity: 3,377,300,000,000 Shannons (33,773.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
  - capacity: 622,699,900,000 Shannons (6,226.9990 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
TX Fee: 100,000 Shannons

Transaction Sent: 0x98a1e4e2f5040030123ddee376a32e3bf8761e84911040f829b35480cdaf851c

Waiting for transaction to confirm...............................

CREATE CELLS

Cell Deps:
  - dep_type: dep_group
    out_point: 0x5630cbcc5620009aa9e87ce5a2d46b2a42831bfb95d0b2113e57d446dae82cdd-0x0
  - dep_type: code
    out_point: 0x98a1e4e2f5040030123ddee376a32e3bf8761e84911040f829b35480cdaf851c-0x0
Inputs:
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0xbce94198d216ee4f5ee9653bf4eced4635f1d9b5b4e4418104ca15f7be1dec48-0x4
Outputs:
  - capacity: 11,600,000,000 Shannons (116.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: 0x17f95a225eef865d2ffd8777cc40eda89db8c643bdad1c7b4e4fda16c813a521
  - capacity: 988,399,900,000 Shannons (9,883.9990 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
TX Fee: 100,000 Shannons

Transaction Sent: 0x29ed92289500b05d55a1ee56e87c7f4ab03ddde56bdf621525894ab4f278d5d5

Waiting for transaction to confirm...............................

CONSUME CELLS

Cell Deps:
  - dep_type: dep_group
    out_point: 0x5630cbcc5620009aa9e87ce5a2d46b2a42831bfb95d0b2113e57d446dae82cdd-0x0
  - dep_type: code
    out_point: 0x98a1e4e2f5040030123ddee376a32e3bf8761e84911040f829b35480cdaf851c-0x0
Inputs:
  - capacity: 11,600,000,000 Shannons (116.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: 0x17f95a225eef865d2ffd8777cc40eda89db8c643bdad1c7b4e4fda16c813a521
    out_point: 0x29ed92289500b05d55a1ee56e87c7f4ab03ddde56bdf621525894ab4f278d5d5-0x0
Outputs:
  - capacity: 11,599,900,000 Shannons (115.9990 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
TX Fee: 100,000 Shannons

Transaction Sent: 0x6a7452c9ab487b2d1cde87e0a45ca1027e9a258be366f8444273b2a229d912d7

Waiting for transaction to confirm...............................

Test completed successfully!
```

### Log of `always` compiled with `Capsule 0.7.3`

```bash
user@host:~/capsule-tests/lumos-tests$ node index.js ../capsule-contracts/build/release/always_capsule_0.7.3
Now setting up Cells for tests. Please wait........................................

DEPLOY CODE

Cell Deps:
  - dep_type: dep_group
    out_point: 0x5630cbcc5620009aa9e87ce5a2d46b2a42831bfb95d0b2113e57d446dae82cdd-0x0
Inputs:
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0x4d6440ef0852cbda188b462d65aed362cb14be5c3423255d61995b31ab097eed-0x0
Outputs:
  - capacity: 879,700,000,000 Shannons (8,797.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
  - capacity: 120,299,900,000 Shannons (1,202.9990 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
TX Fee: 100,000 Shannons

Transaction Sent: 0x93cec2cbd37855b653c70fdc4a76b4716636fa17e1fb8952e3d0124093a8ba1d

Waiting for transaction to confirm...............................

CREATE CELLS

Cell Deps:
  - dep_type: dep_group
    out_point: 0x5630cbcc5620009aa9e87ce5a2d46b2a42831bfb95d0b2113e57d446dae82cdd-0x0
  - dep_type: code
    out_point: 0x93cec2cbd37855b653c70fdc4a76b4716636fa17e1fb8952e3d0124093a8ba1d-0x0
Inputs:
  - capacity: 1,000,000,000,000 Shannons (10,000.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
    out_point: 0x4d6440ef0852cbda188b462d65aed362cb14be5c3423255d61995b31ab097eed-0x1
Outputs:
  - capacity: 11,600,000,000 Shannons (116.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: 0x741e54b9a6f2bccbdf1d61e0fb0f2a8fb6b58d2158663f963feb0d9d1eca58ac
  - capacity: 988,399,900,000 Shannons (9,883.9990 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
TX Fee: 100,000 Shannons

Transaction Sent: 0x7979becbd98ccd01903581f47be5ac2d8ca7a5943cb6e02b4781a0bb5a0d110c

Waiting for transaction to confirm...............................

CONSUME CELLS

Cell Deps:
  - dep_type: dep_group
    out_point: 0x5630cbcc5620009aa9e87ce5a2d46b2a42831bfb95d0b2113e57d446dae82cdd-0x0
  - dep_type: code
    out_point: 0x93cec2cbd37855b653c70fdc4a76b4716636fa17e1fb8952e3d0124093a8ba1d-0x0
Inputs:
  - capacity: 11,600,000,000 Shannons (116.0000 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: 0x741e54b9a6f2bccbdf1d61e0fb0f2a8fb6b58d2158663f963feb0d9d1eca58ac
    out_point: 0x7979becbd98ccd01903581f47be5ac2d8ca7a5943cb6e02b4781a0bb5a0d110c-0x0
Outputs:
  - capacity: 11,599,900,000 Shannons (115.9990 CKBytes)
    lock: 0x6ee8b1ea3db94183c5e5a47fbe82110101f6f8d3e18d1ecd4d6a5425e648da69
    type: null
TX Fee: 100,000 Shannons

Transaction Sent: 0x2081e3e31f7711d50c6ef2eb2b09cab84d1cb476ee815cf498072a3e77bdf3b9

Waiting for transaction to confirm...............................

Test completed successfully!
```
