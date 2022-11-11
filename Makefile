update-abi:
	cd ./frontend && rm -r -f ./eth-sdk/abis/ && npx eth-sdk

deploy-mumbai:
	cd ./hardhat && npx hardhat run scripts/deploy.ts --network mumbai

start-frontend:
	cd ./frontend && npm run dev 

deploy-graph:
	cd graph && yarn deploy