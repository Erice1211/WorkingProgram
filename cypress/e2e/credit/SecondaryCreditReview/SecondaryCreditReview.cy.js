//引入常用字串變數
import { StringText, DicKeyText, Company } from "../../../support/shareObjects";

describe("SecondaryCreditReview AutoTest", () => {
  let loginUser = "";
  let currentStage = "";
  let processName = "";
  let CaseStatus = "";
  let expectCurrentStage = "";
  let parameterArray = [];
  let isProcessEnd = false;
  let parauser = "";
  let parameterDic = {};
  let companyName = "";
  let environment = Cypress.env("environment")

  //放每一個測試檔之前都會先跑一次作業
  beforeEach(() => {

    const path = `${Cypress.env(
      "environment"
    )}/credit/secondarycreditreview/SecondaryCreditReview.json`;

    cy.fixture(path).as("sencondarycreditreviewData")
      .then(data => {
        // Login
       
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
          companyName = Company["KH" + data.companyId]
        } else {
          //MY
          companyName = "CHBE"
        }

        cy._waitForLoading();
      });
  });

  //放每一個測試檔跑完之後要跑的作業
  afterEach(() => {
    //Logout
    if (isProcessEnd) {
      return;
    }
    if (loginUser === StringText.NoNextUser) {
      isProcessEnd = true;
    }
    cy._waitForLoading();
    cy._logout();
  })

  it("取得當前關卡的人員", function () {
    cy._getCurrentStageAndProcessor(this.sencondarycreditreviewData.caseNo,companyName).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
      CaseStatus = returnParameter[DicKeyText.CaseStatus];
      cy.log(returnParameter);
    })
  });

  //審查作業，要做Reject，RANCI值MY:8以上、KH:1000以上
  it("審查作業初審，要設定進入授服，初審關卡1", function () {
    if (CaseStatus.trim().toString() === StringText.SecondaryCreditReview) {
      return;
    }
    processName = StringText.CreditReview;
    debugger;
    if (currentStage !== StringText.PreliminaryReviewStage) {
      expectCurrentStage = StringText.PreliminaryReviewStage;
      return;
    }
    parameterDic[DicKeyText.CaseNo] = this.sencondarycreditreviewData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.sencondarycreditreviewData
    parameterDic[DicKeyText.CreditComment] = StringText.Reject
    parameterDic[DicKeyText.RanciGrade] = this.sencondarycreditreviewData.Ranci

    cy.ToSecondaryCreditReview(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
      processName = returnParameter[DicKeyText.ProcessName];
      CaseStatus = returnParameter[DicKeyText.CaseStatus];
    })
    expectCurrentStage = StringText.PreliminaryReviewStage;
  });

  it("審查作業初審，要設定進入授服，初審關卡2", function () {
    cy.log('初審關卡2' + CaseStatus + processName + currentStage)
    if (CaseStatus.trim().toString() === StringText.SecondaryCreditReview) {
      return;
    }

    processName = StringText.CreditReview;
    debugger;
    if (currentStage !== StringText.PreliminaryReviewStage) {
      expectCurrentStage = StringText.PreliminaryReviewStage;
      return;
    }
    parameterDic[DicKeyText.CaseNo] = this.sencondarycreditreviewData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.CreditComment] = StringText.Reject
    cy.ToSecondaryCreditReview(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
      processName = returnParameter[DicKeyText.ProcessName];
      CaseStatus = returnParameter[DicKeyText.CaseStatus];
    })
    expectCurrentStage = StringText.PreliminaryReviewStage;
  });

  it("審查作業，要設定進入授服，業務主管1", function () {
    if (CaseStatus.trim().toString() === StringText.SecondaryCreditReview) {
      return;
    }
    if (currentStage !== StringText.SalesManagerConfirmationStage) {
      expectCurrentStage = StringText.SalesManagerConfirmationStage;
      return;
    }
    parameterDic[DicKeyText.CaseNo] = this.sencondarycreditreviewData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.sencondarycreditreviewData
    parameterDic[DicKeyText.CreditComment] = StringText.Reject
    parameterDic[DicKeyText.RanciGrade] = ""
    cy.ToSecondaryCreditReview(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
      processName = returnParameter[DicKeyText.ProcessName];
      CaseStatus = returnParameter[DicKeyText.CaseStatus];
    })
    expectCurrentStage = StringText.SalesManagerConfirmationStage;
  });

  it("審查作業，要設定進入授服，業務主管2", function () {
    debugger;
    if (CaseStatus.trim().toString() === StringText.SecondaryCreditReview) {
      return;
    }
    if (currentStage !== StringText.SalesManagerConfirmationStage) {
      expectCurrentStage = StringText.SalesManagerConfirmationStage;
      return;
    }
    parameterDic[DicKeyText.CaseNo] = this.sencondarycreditreviewData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.sencondarycreditreviewData
    parameterDic[DicKeyText.CreditComment] = StringText.Reject
    parameterDic[DicKeyText.RanciGrade] = ""
    cy.ToSecondaryCreditReview(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
      processName = returnParameter[DicKeyText.ProcessName];
      CaseStatus = returnParameter[DicKeyText.CaseStatus];
    })
    expectCurrentStage = StringText.SalesManagerConfirmationStage;
  });

  it("審查作業，要設定進入授服，審核主管1", function () {
    debugger;
    if (CaseStatus.trim().toString() === StringText.SecondaryCreditReview) {
      return;
    }
    if (currentStage !== StringText.CreditReviewStage) {
      expectCurrentStage = StringText.CreditReviewStage;
      return;
    }
    parameterDic[DicKeyText.CaseNo] = this.sencondarycreditreviewData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.sencondarycreditreviewData
    parameterDic[DicKeyText.CreditComment] = StringText.Reject
    parameterDic[DicKeyText.RanciGrade] = ""
    cy.ToSecondaryCreditReview(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
      processName = returnParameter[DicKeyText.ProcessName];
      CaseStatus = returnParameter[DicKeyText.CaseStatus];
    })
    expectCurrentStage = StringText.CreditReviewStage;
  });

  it("審查作業，要設定進入授服，審核主管2", function () {
    debugger;
    if (CaseStatus.trim().toString() === StringText.SecondaryCreditReview) {
      return;
    }
    if (currentStage !== StringText.CreditReviewStage) {
      expectCurrentStage = StringText.CreditReviewStage;
      return;
    }
    parameterDic[DicKeyText.CaseNo] = this.sencondarycreditreviewData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.sencondarycreditreviewData
    parameterDic[DicKeyText.CreditComment] = StringText.Reject
    parameterDic[DicKeyText.RanciGrade] = ""
    cy.ToSecondaryCreditReview(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
      processName = returnParameter[DicKeyText.ProcessName];
      CaseStatus = returnParameter[DicKeyText.CaseStatus];
    })
    expectCurrentStage = StringText.CreditReviewStage;
  });

  it("授服作業-審核主管1簽核關卡", function () {
    if (currentStage !== StringText.CreditReviewStage) {
      expectCurrentStage = StringText.CreditReviewStage;
      return;
    }
    processName = StringText.SecondaryCreditReview;
    parameterDic[DicKeyText.CaseNo] = this.sencondarycreditreviewData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.sencondarycreditreviewData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval
    parameterDic[DicKeyText.RanciGrade] = ""
    
    cy.ToSecondaryCreditReview(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
      processName = returnParameter[DicKeyText.ProcessName];
      CaseStatus = returnParameter[DicKeyText.CaseStatus];
    })
    expectCurrentStage = StringText.CreditReviewStage;
  });

  it("授服作業-核決主管1簽核關卡", function () {
    if (currentStage !== StringText.ApprovalStage) {
      expectCurrentStage = StringText.ApprovalStage;
      return;
    }
    processName = StringText.SecondaryCreditReview;
    parameterDic[DicKeyText.CaseNo] = this.sencondarycreditreviewData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.sencondarycreditreviewData
    parameterDic[DicKeyText.CreditComment] = 
    parameterDic[DicKeyText.RanciGrade] = ""
    cy.ToSecondaryCreditReview(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
      processName = returnParameter[DicKeyText.ProcessName];
      CaseStatus = returnParameter[DicKeyText.CaseStatus];
    })
    expectCurrentStage = StringText.ApprovalStage;
  });

  it("授服作業-核決主管2簽核關卡", function () {
    if (currentStage !== StringText.ApprovalStage) {
      expectCurrentStage = StringText.ApprovalStage;
      return;
    }
    processName = StringText.SecondaryCreditReview;
    parameterDic[DicKeyText.CaseNo] = this.sencondarycreditreviewData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.sencondarycreditreviewData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval
    parameterDic[DicKeyText.RanciGrade] = ""
    cy.ToSecondaryCreditReview(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
      processName = returnParameter[DicKeyText.ProcessName];
      CaseStatus = returnParameter[DicKeyText.CaseStatus];
    })
    expectCurrentStage = StringText.ApprovalStage;
  });
})