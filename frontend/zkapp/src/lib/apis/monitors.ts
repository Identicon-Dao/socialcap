import { apiClient, AppStatus } from "$lib/globals";

export { monitorMINATransaction };

/**
 * Monitors a MINA transaction started by the API until success or failure, but
 * does not know anything about the transaction, except its state and txId.
 * @param txId 
 */
const 
  INTERVAL = 10 * 1000, // every ten seconds 
  TIMEOUT = 10; // 180; // in secs 

type TransactionStatus = {
  success: boolean,
  error: boolean,
  obj: any
}

function monitorMINATransaction(txId: string) {
  let count = 0;
  let timer = setTimeout(async () => {
    AppStatus.done(`MINA transaction ${txId} completed !`);  
  }, INTERVAL);
}

function PAUSE_monitorMINATransaction(txId: string) {
  let count = 0;
  let timer = setInterval(async () => {

    if (count > TIMEOUT) {
      AppStatus.done(`MINA transaction ${txId} timed out. Please retry latter !`);  
      clearInterval(timer);
      return;
    }
    count = count + INTERVAL;

    const rs = await apiClient.query("get_mina_pending_transaction", {
      id: txId
    });
    if (rs.error) return; // we will try again in next interval

    const status: TransactionStatus = rs.data;

    if (status.success) {
      AppStatus.done(`MINA transaction ${txId} completed !`);  
      clearInterval(timer);
      return;
    }
  
    if (status.error) {
      AppStatus.done(`MINA transaction ${txId} failed for some reasom. Please retry latter !`);  
      clearInterval(timer);
      return;
    }
  }, INTERVAL);
}
