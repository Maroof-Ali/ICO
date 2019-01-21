const Token = artifacts.require("./Token.sol");
const ICO = artifacts.require("./ICO.sol");

var Web3 = require("web3");
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");


contract("ICO", accounts => {

    function  tokenToChacha(_token){
      return _token/(10**6);
    }

    function chachaToToken(_chacha){
      return _chacha*(10**6);
    }



  // it('should be owner address', async function () {
  //   const icoInstance = await ICO.deployed();
  //
  //   let add = await icoInstance.ownerAdd();
  //   console.log(add);
  // });


  it("It should be possible for user to buy token", async () => {

    const tokenInstance = Token.deployed();
    const icoInstance = ICO.deployed();

    const accounts = await web3.eth.getAccounts()
    let userAccount = accounts[1];
    const decimal = 10;
    console.log("Owner account address ..... ", accounts[0])

    let temp = await tokenInstance.balanceOf.call(accounts[0]);
    console.log("Owner balance initially ..... ", tokenToChacha(temp).toString(decimal) );
    assert.equal(tokenToChacha(temp).toString(decimal), 100, "there is a problem in user owner initial balance");


    await tokenInstance.transfer(icoInstance.address, 50000000, {from: accounts[0]});

    // let temp1 = await tokenInstance.balanceOf.call(accounts[0]);
    // console.log("Owner balance after transfer to ICO ..... ", tokenToChacha(temp1).toString(decimal));

    let temp2 = await tokenInstance.balanceOf.call(icoInstance.address);
    console.log("ICO balance before loosing any token ..... ", tokenToChacha(temp2).toString(decimal));
    assert.equal(tokenToChacha(temp2).toString(decimal), 50, "ICO does'nt get right balance");


    let userBalance = await tokenInstance.balanceOf.call(userAccount);
    console.log("User token balance Before buying token ..... ", userBalance.toString(10));
    assert.equal(userBalance.toString(decimal), 0, "It should be Zero");


    let userBal = await web3.eth.getBalance(userAccount);
    console.log("User Account balance before, in ether ..... ", web3.utils.fromWei(userBal, "ether"));

    await icoInstance.buyToken({
      value: 500,
      from: userAccount
    });

    let temp3 = await tokenInstance.balanceOf.call(icoInstance.address);
    console.log("ico balance after loosing token ..... ", tokenToChacha(temp3).toString(decimal));
    assert.equal(tokenToChacha(temp3).toString(decimal), 49.995, "ICO didnt dispatched the required amount");

    let userBalanceAfter = await tokenInstance.balanceOf.call(userAccount);
    console.log("User token balance After buying token ..... ", userBalanceAfter.toString(decimal));
    assert.equal(userBalanceAfter.toString(decimal), 5000, "user token transaction is unsuccessful");


    let userBal1 = await web3.eth.getBalance(userAccount);
    console.log("User Account balance after, in ether ..... ", web3.utils.fromWei(userBal1, "ether"));


    // assert.equal(storedData, 89, "The value 89 was not stored.");
  });

  // it('transaction should be revert', async function () {
  //
  //   const tokenInstance = Token.deployed();
  //   const icoInstance = ICO.deployed();
  //
  //   const accounts = await web3.eth.getAccounts()
  //   let userAccount = accounts[1];
  //   let icoBalance = 5000000;
  //
  //   await icoInstance.buyToken({
  //     value: 500,
  //     from: userAccount
  //   });
  //
  //   await tokenInstance.transfer(icoInstance.address, 1000, {from: accounts[1]});
  //   assert.equal(icoBalance, 5001000, "Transaction successfull");
  //
  // });
})