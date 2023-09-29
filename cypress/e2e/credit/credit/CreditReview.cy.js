import { StringText,DicKeyText,Company } from "../../../support/shareObjects";

describe("credit review test", () => {

  let loginUser="";
  let currentStage="";
  let processName="";
  let expectCurrentStage="";
  let parameterArray =[];
  let isProcessEnd =false;
  let parameterDic = {};
  let companyName="";
  let environment=Cypress.env("environment")


  beforeEach(() => {
    const path = `${Cypress.env(
      "environment"
    )}/credit/credit/CreditReview.json`;
      
    

    cy.fixture(path).as("testData")
      .then(data => {
        // Login
        // cy.log(currentStage)
        // cy.log(processName)
        // cy.log(loginUser)
       
        if(loginUser===""){
          // cy._login({userNo:data.user}); 
          loginUser=data.user;
          cy.log("default user");
        }
        else if(loginUser===StringText.NoNextUser){
          return;
        }


        cy._login({userNo:loginUser});


        //設定公司名稱
        if(environment.includes("kh")){
          //KH
          companyName=Company["KH"+data.companyId]
        }else{
          //MY
          companyName="CHBE"
        }

        cy._waitForLoading();
      });
  });

  afterEach(() => {
    //Logout
    if(isProcessEnd){
      return;
    }

    // if(currentStage!=//expectCurrentStage&&currentStage!=StringText.ProcessCompleted){
    //   return;
    // }

    if(loginUser===StringText.NoNextUser){
      isProcessEnd=true
    }
    cy._waitForLoading();
    cy._logout();
  })

  it("credit review test-prescreen", function () {
    processName = StringText.CreditReview;
    currentStage = StringText.PreliminaryReviewStage;


    parameterDic[DicKeyText.CaseNo] = this.testData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.testData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval

    cy._creditReviewPrescreen(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];

    })

    //expectCurrentStage=StringText.SalesManagerConfirmationStage;

  });

  //leo add
  it("credit review test-prescreen 2", function () {

    if (currentStage !== StringText.PreliminaryReviewStage) {
      //expectCurrentStage=StringText.SalesManagerConfirmationStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.testData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.testData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval

    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];

    })

    //expectCurrentStage=StringText.SalesManagerConfirmationStage;

  });

  it("credit review test-sales manager confirm", function () {

    if (currentStage !== StringText.SalesManagerConfirmationStage) {
      //expectCurrentStage=StringText.SalesManagerConfirmationStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.testData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.testData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval



    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];

    })

    //expectCurrentStage=StringText.SalesManagerConfirmationStage;

  });

  it("credit review test-sales manager confirm 2", function () {
    if (currentStage !== StringText.SalesManagerConfirmationStage) {
      //expectCurrentStage=StringText.CreditReviewStage;
      return;
    }


    parameterDic[DicKeyText.CaseNo] = this.testData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.testData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval



    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];

    })
    //expectCurrentStage=StringText.CreditReviewStage;
  });

  it("credit review test-credit review", function () {
    if (currentStage !== StringText.CreditReviewStage) {
      //expectCurrentStage=StringText.CreditReviewStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.testData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.testData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval



    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];

    })

    //expectCurrentStage=StringText.CreditReviewStage;
  });

  it("credit review test-credit review 2", function () {
    if (currentStage !== StringText.CreditReviewStage) {
      //expectCurrentStage=StringText.ApprovalStage;
      return;
    }


    parameterDic[DicKeyText.CaseNo] = this.testData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.testData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval



    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];

    })

    //expectCurrentStage=StringText.CreditReviewStage;
  });


  it("credit review test-credit review 3", function () {
    if (currentStage !== StringText.CreditReviewStage) {
      return;
    }


    parameterDic[DicKeyText.CaseNo] = this.testData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.testData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval



    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];

    })

    //expectCurrentStage=StringText.ApprovalStage;
  });


  it("credit review test-Approval", function () {
    if (currentStage !== StringText.ApprovalStage) {
      //expectCurrentStage=StringText.ApprovalStage;
      return;
    }


    parameterDic[DicKeyText.CaseNo] = this.testData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.testData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval



    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];

    })

    //expectCurrentStage=StringText.ApprovalStage;

  });


  it("credit review test-Approval 2", function () {
    if (currentStage !== StringText.ApprovalStage) {
      //expectCurrentStage=StringText.ApprovalStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.testData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.testData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval



    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];

    })

    //expectCurrentStage=StringText.ApprovalStage;
  });


  it("credit review test-Approval 3", function () {
    if (currentStage !== StringText.ApprovalStage) {
      return;
    }


    parameterDic[DicKeyText.CaseNo] = this.testData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.CreditComment] = StringText.Approval



    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];

    })

    //expectCurrentStage=StringText.NoNextStage;
  });


  it("credit review test-Approval 4", function () {
    if (currentStage !== StringText.ApprovalStage) {
      return;
    }


    parameterDic[DicKeyText.CaseNo] = this.testData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.CreditComment] = StringText.Approval



    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];

    })

    //expectCurrentStage=StringText.NoNextStage;
  });

  it("credit review test-Approval 5", function () {
    if (currentStage !== StringText.ApprovalStage) {
      return;
    }
    parameterDic[DicKeyText.CaseNo] = this.testData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.CreditComment] = StringText.Approval



    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];

    })

    //expectCurrentStage=StringText.NoNextStage;
  });



});
