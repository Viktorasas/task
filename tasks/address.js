task("create-new-address", "Create new address on local node")
.addParam("amount", "How many addresses to create")
.setAction(createAddress);

export async function createAddress( amount, hre) {
    async function _createAddress() {
      return new Promise(resolve =>  {
        // logic
        console.log(amount)
      });
    }
    await _createAddress();
  }