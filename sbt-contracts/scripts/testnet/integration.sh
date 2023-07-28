#!/bin/bash
set -e
export NEAR_ENV="testnet"
MASTER_ACCOUNT="sbt_master.testnet"
REGISTRY_ACCOUNT="v3-registry.sbt_master.testnet"
PROOF_SBT_ACCOUNT="v3-proof_sbt.sbt_master.testnet"
ADMIN_ACCOUNT="sbt_admin.testnet"  #expected to be a DAO
ISSUER_ACCOUNT="sbt_issuer.testnet"
SBT_MINT_DEPOSIT_YOCTO=8000000000000000000000
SBT_RECEIVER="manza.testnet"
SBT_CLASS=1

echo "REGISTER SBT ISSUER ACCOUNT TO REGISTRY"

near call $REGISTRY_ACCOUNT admin_add_sbt_issuer '{"issuer": "'$PROOF_SBT_ACCOUNT'"}' --accountId $ADMIN_ACCOUNT

echo "CHECK SBT ISSUERS"
near view $REGISTRY_ACCOUNT sbt_issuers

echo "ENABLE NEXT CLASS FOR MINTER"

near call $PROOF_SBT_ACCOUNT enable_next_class '{"requires_iah":false, "minter":"'$ISSUER_ACCOUNT'", "max_ttl": 27000000000, "memo":"enabling next class for issuer" }' --accountId $ADMIN_ACCOUNT

echo "AUTHORIZE ISSUER 'minter' TO MINT TOKENS OF A  'class'"

near call $PROOF_SBT_ACCOUNT authorize '{"class":'$SBT_CLASS', "minter":"'$ISSUER_ACCOUNT'", "memo": "adding issuer to class"}' --accountId $ADMIN_ACCOUNT

echo "MINT SBT TO USER"

near call $PROOF_SBT_ACCOUNT sbt_mint '{"receiver":"'$SBT_RECEIVER'", "metadata":{"class":'$SBT_CLASS'},"memo": "minting"}' --depositYocto $SBT_MINT_DEPOSIT_YOCTO  --accountId $ISSUER_ACCOUNT

echo "SBT TOKENS BY OWNER"

near view $REGISTRY_ACCOUNT sbt_tokens_by_owner '{"account": "'$SBT_RECEIVER'"}'