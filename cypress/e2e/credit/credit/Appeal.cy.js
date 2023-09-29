import { StringText,DicKeyText,Company } from "../../../support/shareObjects";

describe("appeal test", () => {
 
  
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
    )}/credit/credit/Appeal.json`;

    

    cy.fixture(path).as("testData")
      .then(data => {
        // Login
       
        if(loginUser===""){
          // cy._login({userNo:data.user}); 
          loginUser=data.prescreenUser;
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

    if(loginUser===StringText.NoNextUser){
      isProcessEnd=true
    }
    cy._waitForLoading();
    cy._logout();
  })


  it("appeal test-credit review prescreen reject", function () {
    processName=StringText.CreditReview;
    currentStage=StringText.PreliminaryReviewStage;

    parameterDic[DicKeyText.CaseNo]=this.testData.caseNo
    parameterDic[DicKeyText.LoginUser]=loginUser
    parameterDic[DicKeyText.CurrentStage]=currentStage
    parameterDic[DicKeyText.ProcessName]=processName 
    parameterDic[DicKeyText.CompanyName]=companyName  
    parameterDic[DicKeyText.TestData]=this.testData
    parameterDic[DicKeyText.CreditComment]=StringText.Reject
    

    cy._creditReviewPrescreen(parameterDic).then((returnParameter)=>{
      loginUser=returnParameter[DicKeyText.LoginUser];
      currentStage=returnParameter[DicKeyText.CurrentStage];
      if(loginUser===StringText.NoNextUser){
        loginUser=this.testData.appealUser
        processName=StringText.Appeal;
        currentStage=StringText.Applying;
      }
      
    })

     //expectCurrentStage=StringText.SalesManagerConfirmationStage;

  });

//Leo add
it("appeal test-credit review prescreen 2 reject", function () {

  if(currentStage !== StringText.PreliminaryReviewStage){
    //expectCurrentStage=StringText.SalesManagerConfirmationStage;
    return;
  }

  parameterDic[DicKeyText.CaseNo]=this.testData.caseNo
  parameterDic[DicKeyText.LoginUser]=loginUser
  parameterDic[DicKeyText.CurrentStage]=currentStage
  parameterDic[DicKeyText.ProcessName]=processName 
  parameterDic[DicKeyText.CompanyName]=companyName
  parameterDic[DicKeyText.TestData]=this.testData
  parameterDic[DicKeyText.CreditComment]=StringText.Reject
  

  cy._creditReviewFast(parameterDic).then((returnParameter)=>{
    loginUser=returnParameter[DicKeyText.LoginUser];
    currentStage=returnParameter[DicKeyText.CurrentStage];
    if(loginUser===StringText.NoNextUser){
      loginUser=this.testData.appealUser
      processName=StringText.Appeal;
      currentStage=StringText.Applying;
    }
    
  })

   //expectCurrentStage=StringText.SalesManagerConfirmationStage;

});

  it("appeal test- credit review sales manager confirm reject", function () {
    
    if(currentStage !== StringText.SalesManagerConfirmationStage){
      //expectCurrentStage=StringText.SalesManagerConfirmationStage;
      return;
    }
    
    parameterDic[DicKeyText.CaseNo]=this.testData.caseNo
    parameterDic[DicKeyText.LoginUser]=loginUser
    parameterDic[DicKeyText.CurrentStage]=currentStage
    parameterDic[DicKeyText.ProcessName]=processName 
    parameterDic[DicKeyText.CompanyName]=companyName
    parameterDic[DicKeyText.TestData]=this.testData
    parameterDic[DicKeyText.CreditComment]=StringText.Reject


    cy._creditReviewFast(parameterDic).then((returnParameter)=>{
      loginUser=returnParameter[DicKeyText.LoginUser];
      currentStage=returnParameter[DicKeyText.CurrentStage];
      if(loginUser===StringText.NoNextUser){
        loginUser=this.testData.appealUser
        processName=StringText.Appeal;
        currentStage=StringText.Applying;
      }
      
    })

    //expectCurrentStage=StringText.SalesManagerConfirmationStage;

  });

//Leo add
  it("appeal test- credit review sales manager 2 confirm reject", function () {
    
    if(currentStage !== StringText.SalesManagerConfirmationStage){
      //expectCurrentStage=StringText.SalesManagerConfirmationStage;
      return;
    }
    
    parameterDic[DicKeyText.CaseNo]=this.testData.caseNo
    parameterDic[DicKeyText.LoginUser]=loginUser
    parameterDic[DicKeyText.CurrentStage]=currentStage
    parameterDic[DicKeyText.ProcessName]=processName 
    parameterDic[DicKeyText.CompanyName]=companyName
    parameterDic[DicKeyText.TestData]=this.testData
    parameterDic[DicKeyText.CreditComment]=StringText.Reject


    cy._creditReviewFast(parameterDic).then((returnParameter)=>{
      loginUser=returnParameter[DicKeyText.LoginUser];
      currentStage=returnParameter[DicKeyText.CurrentStage];
      if(loginUser===StringText.NoNextUser){
        loginUser=this.testData.appealUser
        processName=StringText.Appeal;
        currentStage=StringText.Applying;
      }
      
    })

    //expectCurrentStage=StringText.SalesManagerConfirmationStage;

  });



  it("appeal test- credit review credit review reject", function () {
    
    if(currentStage !== StringText.CreditReviewStage){
      return;
    }
    
    parameterDic[DicKeyText.CaseNo]=this.testData.caseNo
    parameterDic[DicKeyText.LoginUser]=loginUser
    parameterDic[DicKeyText.CurrentStage]=currentStage
    parameterDic[DicKeyText.ProcessName]=processName 
    parameterDic[DicKeyText.CompanyName]=companyName
    parameterDic[DicKeyText.TestData]=this.testData
    parameterDic[DicKeyText.CreditComment]=StringText.Reject


    cy._creditReviewFast(parameterDic).then((returnParameter)=>{
      loginUser=returnParameter[DicKeyText.LoginUser];
      currentStage=returnParameter[DicKeyText.CurrentStage];
      if(loginUser===StringText.NoNextUser){
        loginUser=this.testData.appealUser
        processName=StringText.Appeal;
        currentStage=StringText.Applying;
      }
      
    })

  });


 

  it("appeal test-appeal apply", function () {

    //點Menu
    //cy.contains("span.p-menuitem-text",StringText.Appeal,{ timeout: 5000 }).click();
    cy.get("a.p-panelmenu-header-link").contains(companyName).parent().parent().next().contains("span.p-menuitem-text", StringText.Appeal, { timeout: 5000 }).click({ force: true });

    cy._waitForLoading();

    //查詢Case
    cy.get('div.p-field-label').contains(StringText.CaseNoPoint).parent().next().type(this.testData.caseNo);
    cy.contains("button.p-content-button", StringText.Search).click();

    
    cy._waitForLoading();



    //點擊Case
    cy.get("p-table", { timeout: 10000 })
    .find("a")
    .contains(this.testData.caseNo)
    .click();

    cy._waitForLoading();

    //輸入申覆理由
    cy.get('div.p-field-label').contains(StringText.AppealReason,{timeout:20000}).next().type(StringText.Appeal,{timeout:20000});

    cy._waitForLoading();


    //調整交易條件
    cy.get("ul.p-tabview-nav").contains(StringText.TermsAndConditions).click({force: true});
    cy._waitForLoading();
    cy.get('sigv-input-number[creditdetectdifftarget="interestFlatRate"]').find('input').type("{selectall}" +this.testData.interestFlatRateForAppeal);
    cy._waitForLoading();

    //Submit
    cy.get("span").contains("Submit").click();

    cy._waitForLoading();


   //取得下一關關卡名稱和作業人員   
   cy._getCurrentStageAndProcessor(this.testData.caseNo,companyName).then((returnDicFromFunction) => {
    currentStage=returnDicFromFunction[DicKeyText.CurrentStage];
    loginUser=returnDicFromFunction[DicKeyText.LoginUser];    
   })


  })



  it("appeal test-sales manager confirm", function () {
    
    if(currentStage !== StringText.SalesManagerConfirmationStage){
      return;
    }

    parameterDic[DicKeyText.CaseNo]=this.testData.caseNo
    parameterDic[DicKeyText.LoginUser]=loginUser
    parameterDic[DicKeyText.CurrentStage]=currentStage
    parameterDic[DicKeyText.ProcessName]=processName 
    parameterDic[DicKeyText.CompanyName]=companyName
    parameterDic[DicKeyText.CreditComment]=StringText.Approval


    cy._creditReviewFast(parameterDic).then((returnParameter)=>{
      loginUser=returnParameter[DicKeyText.LoginUser];
      currentStage=returnParameter[DicKeyText.CurrentStage];
      
    })

  });

  it("appeal test-prescreen", function () {
    if(currentStage !== StringText.PreliminaryReviewStage){
      return;
    }

    
    parameterDic[DicKeyText.CaseNo]=this.testData.caseNo
    parameterDic[DicKeyText.LoginUser]=loginUser
    parameterDic[DicKeyText.CurrentStage]=currentStage
    parameterDic[DicKeyText.ProcessName]=processName 
    parameterDic[DicKeyText.CompanyName]=companyName
    parameterDic[DicKeyText.TestData]=this.testData
    parameterDic[DicKeyText.CreditComment]=StringText.Approval



    cy._creditReviewFast(parameterDic).then((returnParameter)=>{
      loginUser=returnParameter[DicKeyText.LoginUser];
      currentStage=returnParameter[DicKeyText.CurrentStage];
      
    })

  });


  it("appeal test-credit review", function () {
    if(currentStage !== StringText.CreditReviewStage){
      return;
    }
    

    parameterDic[DicKeyText.CaseNo]=this.testData.caseNo
    parameterDic[DicKeyText.LoginUser]=loginUser
    parameterDic[DicKeyText.CurrentStage]=currentStage
    parameterDic[DicKeyText.ProcessName]=processName 
    parameterDic[DicKeyText.CompanyName]=companyName
    parameterDic[DicKeyText.TestData]=this.testData
    parameterDic[DicKeyText.CreditComment]=StringText.Approval


    cy._creditReviewFast(parameterDic).then((returnParameter)=>{
      loginUser=returnParameter[DicKeyText.LoginUser];
      currentStage=returnParameter[DicKeyText.CurrentStage];
      
    })

    //expectCurrentStage=StringText.ApprovalStage;
  });


  it("appeal test-Approval", function () {
    if(currentStage !== StringText.ApprovalStage){
      //expectCurrentStage=StringText.ApprovalStage;
      return;
    }
  
    parameterDic[DicKeyText.CaseNo]=this.testData.caseNo
    parameterDic[DicKeyText.LoginUser]=loginUser
    parameterDic[DicKeyText.CurrentStage]=currentStage
    parameterDic[DicKeyText.ProcessName]=processName 
    parameterDic[DicKeyText.CompanyName]=companyName
    parameterDic[DicKeyText.TestData]=this.testData
    parameterDic[DicKeyText.CreditComment]=StringText.Approval



    cy._creditReviewFast(parameterDic).then((returnParameter)=>{
      loginUser=returnParameter[DicKeyText.LoginUser];
      currentStage=returnParameter[DicKeyText.CurrentStage];
    })

    //expectCurrentStage=StringText.ApprovalStage;
  });
  

  it("appeal test-Approval 2", function () {
    if(currentStage !== StringText.ApprovalStage){
      //expectCurrentStage=StringText.ApprovalStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo]=this.testData.caseNo
    parameterDic[DicKeyText.LoginUser]=loginUser
    parameterDic[DicKeyText.CurrentStage]=currentStage
    parameterDic[DicKeyText.ProcessName]=processName 
    parameterDic[DicKeyText.CompanyName]=companyName
    parameterDic[DicKeyText.TestData]=this.testData
    parameterDic[DicKeyText.CreditComment]=StringText.Approval

    cy._creditReviewFast(parameterDic).then((returnParameter)=>{
      loginUser=returnParameter[DicKeyText.LoginUser];
      currentStage=returnParameter[DicKeyText.CurrentStage];
    })


    //expectCurrentStage=StringText.ApprovalStage;
  });




})