
Each Sequences has associated

- a Type of Tx to execute, the seuence has only one type of Tx

- a Transaction Queue: the list of transactions to execute 

- a Dispatcher: dispatchs and monitors the trasanctions to execute

- some Actions: the set of actions the dispatcher must execute for this Tx type


We have a list of async sequences[] running in a loop

loop:
  sequence <- get next sequence from the list
  sequence.dispatcherIsAvailable ?
    - no: 
        continue

    - yes: 
      sequence.queueHasTxs ?
        - no: 
            continue
    
        - yes:
            tx <- get next tx from the queue
            sequence.dispatchTransaction
            continue

# Sequencer

The Sequencer receives a given transaction, adds it to its Queue and dispatches it to its "_zkApp_" when it is the "_right_ time" to do so. 

A `zkApp`  is a given MINA Smart Contract deployed on the MINA Network, and related to a given account, having a unique  "_zkAppAddress_". 

The `zkAppAddress` is the PublicKey of the deployed zkApp, as a string in Base58 format.

The `right time`  means that **there is no other transaction running, and that the previous transaction has been added to a block. That means, one transaction per block, per zkApp**.

A cycle of the Sequencer has the following form:

~~~
1. Check if we have a running transaction on course. If we have, we just pass.

2. If we have no running transactions

  3.1. Check if we have pending transactions to run. If not, just pass.

  3.2. If we have pending transactions, we retrieve the first one from the Queue (FIFO).

    3.2.1. Dispatch the pending transaction, by running the first of its Actions. 
           This is an asynchronous call, and will callback the Dispatcher when it 
           has ended or failed.
           Finally, change Dispatcher state to 'AWAITING', and continue.


~~~

Class Sequencer {

    - queue
    - dispatcher
    - actions Action[]
    
    hasPendingTxs(): boolean
    
    dispatcherIsAvailable(): boolean
    
    dispatchTx()
}

Dispatcher
  - state
  - retries
  - currentTx
    dispatch(tx)
    isReady()

Queue
  - transactions []
    hasPending()
    push(tx)
    pop(): tx

Action
  - zkApp
    run(tx)
    wait() ???

Transaction
  - type: string
  - data: string
  - signature: SignatureJSON {signature, scalar}
  - signerAddr: string