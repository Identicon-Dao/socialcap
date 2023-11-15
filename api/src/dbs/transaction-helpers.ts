/**
 * Manages storage and retrieval of the Transactions Queue involving MINA
 */
import { prisma } from "../global.js";
import { UID, WAITING, DONE, IGNORED, REVISION } from '@socialcap/contracts';

const FAILED = 13;

const MAX_RETRIES = 3;

export { TransactionsQueue, WAITING, REVISION, DONE, FAILED, IGNORED, MAX_RETRIES };


class TransactionsQueue {
  // privates 
  _queue = "";
  _txRunning = "";

  constructor(name: string) {
    this._queue = name;
  }

  static queue(name: string)  {
    return new TransactionsQueue(name) ;
  }

  hasRunningTx(): boolean {
    return this._txRunning !== "";
  }

  setTxIsRunning(txId: string) {
    this._txRunning = txId;
  }

  setNoRunningTx() {
    this._txRunning = "";
  }

  /**
 * Pushes a new transaction to the given Queue. Only the type and the data 
 * are strictly required. All other params are optional.
 * @returns the create Tx or null
 */
  async push(params: {
    type: string,
    data: any
  }): Promise<any> {
      let tx = await prisma.transactionQueue.create({
      data: {
        uid: UID.uuid4(),
        queue: this._queue, 
        type: params.type,
        data: (typeof(params.data) === 'string' 
                ? params.data : JSON.stringify(params.data || "{}")),
        state: WAITING
      }
    })
  
    return tx;
  }

  /**
   * Retrieves the first available transaction from the given Queue.
   * @returns Null if no pending transaction in the queue
   */
  async getFirstWaitingTransaction(): Promise<any> {
    let txs = await prisma.transactionQueue.findMany({
      where: { AND: [
        { queue: this._queue },
        { state: WAITING }, 
        { retries: {lt: MAX_RETRIES} }
      ]},
      orderBy: { sequence: 'asc'      }
    })

    return txs.length ? txs[0] : null ; // just return the firt or Null 
  }

  /**
   */
  async updateTransaction(uid: string, params: {
    state?: number,
    MinaTxId?: string,
    MinaTxStatus?: string
  }): Promise<any> {
    let tx = await prisma.transactionQueue.update({
      where: { uid: uid },
      data: params,
    })
  
    return tx;
  }

  /**
   * 
   */
  async retryTransaction(uid: string): Promise<any> {
    let tx = await prisma.transactionQueue.update({
      where: { uid: uid },
      data: { retries: {increment: 1}, state: WAITING },
    })
  
    return tx;
  }

  /**
   * Closes a given transaction so it will never be processed again. 
   * The transaction can be closed because it was succesful, or because it
   * failed too many times and will not be processed again.
   * 
   * In any case, we also set the Mina info related to this transaction (TxId
   * and final status as returned by Graphql).
   * 
   * @param uid the transaction Uid that we want to close
   * @param params { state?, MinatxId?, MinaTxStatus? }
   * @returns the updated Transaction
   */
  async closeTransaction(uid: string, params: {
    state?: number,
    MinaTxId?: string,
    MinaTxStatus?: string
  }): Promise<any> {
    params.state = params.state || DONE; // default for close expcept if FAILED

    let tx = await prisma.transactionQueue.update({
      where: { uid: uid },
      data: params,
    })

    return tx
  }
}
