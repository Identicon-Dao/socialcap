import { error } from "console";
import { 
  TransactionsQueue,
  WAITING, DONE, FAILED, REVISION, MAX_RETRIES 
} from "../dbs/transaction-helpers.js";
import {
  TxSubmitHandlers
} from "./submit-handlers.js";


class Sequencer {

  static _queues = new Map<string, TransactionsQueue>;

  /**
   * 
   * @returns 
   */
  static async run() {
    // get the running queues list
    let names = [...Sequencer._queues.keys()]; 

    for (let j=0; j < names.length; j++) {
      // 1. Check if we have a running transaction on course. If we have, we just pass.
      let queue = Sequencer._queues.get(names[j]) as TransactionsQueue;
      if (queue.hasRunningTx())
        continue; 

      // 2. If we have no running transactions
      // Check if we have pending transactions to run. If not, just pass.
      // If we have pending transactions, we retrieve the first one from the Queue (FIFO).
      let pendingTx = await queue.getFirstWaitingTransaction();
      if (! pendingTx)
        continue;

      // 3. Dispatch the pending transaction
      // 3.1 Now we can get the Action binded to its type
      let action = TxSubmitHandlers[pendingTx.type];
      if (! action)
        continue;

      // 3.2 Now we can really dispatch it using the right Action
      // This is an asynchronous call, and will callback on Done or Failure.
      try {
        Sequencer.dispatch(pendingTx, action, {

          // the Action was succesfull so we update the transaction status
          onDone: async (result: any) => {
            let doneTx = await queue.closeTransaction(pendingTx.uid, {
              state: DONE,
              MinaTxId: result.MinaTxId,
              MinaTxStatus: result.MinaTxStatus
            })
  
            // and we set the queue as free to run other one
            queue.setNoRunningTx();
            return;
          },
  
          // the Action has failed BUT anyway must update transaction status
          onFailure: async (result: any) => {
            let failedTx = await queue.closeTransaction(pendingTx.uid, {
              state: FAILED,
              MinaTxId: result.MinaTxId,
              MinaTxStatus: result.MinaTxStatus
            })
  
            // we check if we have some retries left, and increment its count
            // so it can still be processed in the next cycle
            if (failedTx.retries < MAX_RETRIES)
              failedTx = await queue.retryTransaction(failedTx.uid);
  
            // and we set the queue as free to run it again if can retry
            queue.setNoRunningTx();
            return;
          }
        });

        // if we could send the Transaction it must be reviewed by MINA to 
        // include it in a block. We mark it as REVISION in the queue so it will
        // not be run again
        pendingTx = await queue.updateTransaction(pendingTx.uid, { 
          state: REVISION 
        });
      } 
      catch(err: any) {
        console.log("Sequencer dispatc failed ERR=", err);
      }
    }

    return;
  }


  /**
   * Dispatcher
   */
  static dispatch(
    tx: any, 
    action: (tx: any) => void, 
    callbacks: {
      onDone: (result: any) => void,
      onFailure: (result: any) => void 
    }
  ) {
    return;
  }

  /**
   * Cleanup queues, because there may be queues that have no more transactions
   * to process but are still in the Sequencer queues map. So we need to remove
   * this ones from the Map.
   */

  /**
   * Review queues. We need to take into account the case where some transaction
   * was dispatched, the sequencer was offline and so we could not record the 
   * transaction state, either as DONE or FAILED. 
   * In this case we need to check with the Graphql endpoint the real status of 
   * ths transaction:
   * - If it was success, we change state to DONE.
   * - If it failed, we change state to WAITING so it can be retried.
   */
}