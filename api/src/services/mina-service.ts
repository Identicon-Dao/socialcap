import 'dotenv/config';
import { logger } from "../global.js";
import { 
  Mina, PublicKey, PrivateKey, MerkleMapWitness, CircuitString,
  Field, UInt32 
} from "o1js";
import { 
  COMMUNITIES_MERKLE_MAP, PERSONS_MERKLE_MAP, MEMBERS_MERKLE_MAP,
  PLANS_MERKLE_MAP, CLAIMS_MERKLE_MAP, CREDENTIALS_MERKLE_MAP, TASKS_MERKLE_MAP,
  NULLIFIER_MERKLE_MAP, OffchainMerkleMap,
} from "../dbs/index.js";
import { 
  ProvablePerson, ProvableCommunity, ProvableMember, ProvableTask,
  ProvableClaim, ProvableCredential, ProvableElector, ProvablePlan,
  MerkleMapProxy,MerkleMapUpdate, 
  CommunitiesContract, ClaimingsContract, ElectorsContract, SocialcapContract
} from "@socialcap/contracts";
import { waitForTransaction } from "./mina-transactions.js";
export { MinaService, setMinaNetwork } ;

const TX_FEE = 200_000_000;

let deployer = {
  publicKey: PublicKey.fromBase58(process.env.DEPLOYER_ID as string),
  privateKey: PrivateKey.fromBase58(process.env.DEPLOYER_KEY as string)
}

let sender = {
  publicKey: PublicKey.fromBase58(process.env.SENDER_ID as string),
  privateKey: PrivateKey.fromBase58(process.env.SENDER_KEY as string)
}


function setMinaNetwork() {
  const   
    BERKELEY_URL = 'https://proxy.berkeley.minaexplorer.com/graphql',
    ARCHIVE_URL = 'https://archive.berkeley.minaexplorer.com/';

  const Berkeley = Mina.Network({
    mina: BERKELEY_URL, 
    archive: ARCHIVE_URL
  });

  Mina.setActiveInstance(Berkeley);
}


class MinaService {

  static async updatePersonsRoot(
    provable: ProvablePerson, 
    map: MerkleMapProxy, 
    witness: MerkleMapWitness, 
    updatedMerkle: MerkleMapUpdate
  ) {
    try {
      return;

      const publicKey = PublicKey.fromBase58(
        process.env.COMMUNITIES_CONTRACT_ID as string
      );
      logger.info(`Running CommunitiesContract '${publicKey.toBase58()}' ...`)
      
      await CommunitiesContract.compile();
      let zkContract = new CommunitiesContract(publicKey);

      let tx = await Mina.transaction(
        { sender: deployer.publicKey, fee: TX_FEE }, () => {
          zkContract.updatePerson(
            provable as ProvablePerson,
            map, 
            witness,
            updatedMerkle
          );
        }
      );
      await tx.prove();
      await tx.sign([deployer.privateKey]);
      let pendingTx = await tx.send();    

      waitForTransaction(
        pendingTx.hash() as string, 
        {}, 
        (params: any) => { console.log("Txn OK"); },
        (params: any, error: any) => { console.log("Txn Failed", error); },
      )  
    }
    catch (err: any) {
      console.log(err);
      throw err.toString();
    }
  }

  static async updateCommunitiesRoot(
    provable: ProvableCommunity, 
    map: MerkleMapProxy, 
    witness: MerkleMapWitness, 
    updatedMerkle: MerkleMapUpdate
  ) {
    //
  }

  static async updateMembersRoot(
    provable: ProvableMember, 
    map: MerkleMapProxy, 
    witness: MerkleMapWitness, 
    updatedMerkle: MerkleMapUpdate
  ) {
    //
  }
  
  static async updatePlansRoot(
    provable: ProvablePlan, 
    map: MerkleMapProxy, 
    witness: MerkleMapWitness, 
    updatedMerkle: MerkleMapUpdate
  ) {
    //
  }
  static async updateClaimsRoot(
    provable: ProvableClaim, 
    map: MerkleMapProxy, 
    witness: MerkleMapWitness, 
    updatedMerkle: MerkleMapUpdate
  ) {
    //
  }
  static async updateCredentialsRoot(
    provable: ProvableCredential, 
    map: MerkleMapProxy, 
    witness: MerkleMapWitness, 
    updatedMerkle: MerkleMapUpdate
  ) {
    //
  }

  static async updateTasksRoot(
    provable: ProvableTask, 
    map: MerkleMapProxy, 
    witness: MerkleMapWitness, 
    updatedMerkle: MerkleMapUpdate
  ) {
    //
  }

  static async emptyHandler(
    provable: ProvableTask, 
    map: MerkleMapProxy, 
    witness: MerkleMapWitness, 
    updatedMerkle: MerkleMapUpdate
  ) {
    //
  }

  static async updateNullifierRoot(
    map: OffchainMerkleMap,
    updatedMerkle: MerkleMapUpdate,
    params: any,
    onSuccess: (params: any) => void,
    onError: (params: any, error: any) => void
  ) {
    let mapProxy: MerkleMapProxy = {
      id: UInt32.from(map.id),
      name: CircuitString.fromString("nullifier"),
      root: map.getRoot(),
      count: Field(map.size())
    };
    let key = updatedMerkle.afterLeaf.key.toString();
    let witness: MerkleMapWitness = map.getWitness(key) as MerkleMapWitness;
    
    try {
      const publicKey = PublicKey.fromBase58(process.env.ELECTORS_CONTRACT_ID as string);
      logger.info(`Running ElectorsContract '${publicKey.toBase58()}' ...`)

      await ElectorsContract.compile();
      let zkContract = new ElectorsContract(publicKey);

      let txn = await Mina.transaction(
        { sender: deployer.publicKey, fee: TX_FEE }, () => {
          zkContract.updateNullifier(
            mapProxy,
            witness,
            updatedMerkle      
          )
        }
      );
      await txn.prove();
      await txn.sign([deployer.privateKey]);
      let pendingTx = await txn.send();

      waitForTransaction(
        pendingTx.hash() as string, 
        params, 
        onSuccess,
        onError
      )  
    }
    catch (err: any) {
      onError(params, err);
    }
  }
}
