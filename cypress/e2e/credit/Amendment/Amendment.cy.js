import { StringText, DicKeyText, Company } from "../../../support/shareObjects";

describe("Amendment Application", () => {
  let loginUser = "";
  let currentStage = "";
  let processName = "";
  let expectCurrentStage = "";
  let parameterArray = [];
  let isProcessEnd = false;
  let parameterDic = {};
  let isAmendment = true;
  let companyName = "";
  let environment = Cypress.env("environment")

  beforeEach(() => {
    const path = `${Cypress.env(
      "environment"
    )}/credit/amendment/Amendment.json`;

    cy.fixture(path).as("amendmentData")
      .then(data => {
        // Login
        cy.log(currentStage)
        
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

  afterEach(() => {
    //Logout
    if (isProcessEnd) {
      return;
    }
    if (loginUser === StringText.NoNextUser) {
      isProcessEnd = true;
    }
    cy._waitForLoading();
    // cy._logout();
  })

  //查詢需要做變更申請的案件
  it("Amendment Search by case no.", function () {
    debugger;
    processName = StringText.Amendment;

    //點選變更作業功能
    cy.get("a.p-panelmenu-header-link").contains(companyName).parent().parent().next().contains("span.p-menuitem-text", StringText.Amendment, { timeout: 5000 }).click({ force: true });
    cy.get('div.p-field-label').contains(StringText.CaseNoPoint).parent().next().type(this.amendmentData.caseNo);
    cy.contains("button.p-content-button", StringText.Search).click();

    cy._waitForLoading();

    cy.get('p-table').contains(this.amendmentData.caseNo).parent().then($body => {
      const dis = $body.find('a')
      if (dis.length) {
        // dis.contains(this.amendmentData.caseNo).click();
        //cy.get('tr.ng-star-inserted > :nth-child(1) > .ng-star-inserted').contains(this.amendmentData.caseNo).click();

        cy.get("p-table", { timeout: 10000 })
          .find("a")
          .contains(this.amendmentData.caseNo)
          .click();

        cy._waitForLoading();

        debugger;
        //挑選Reanson
        cy.get(':nth-child(4) > .p-col-5-1 > .ng-untouched > .p-dropdown', { timeout: 15000 }).click({ force: true });
        cy._waitForLoading();
        // cy.get('[optionlabel="paramCode"]', { timeout: 15000 }).click();
        // cy.get("p-dropdownitem").should('have.value',this.amendmentData.amendmentReason)
        cy.get("p-dropdownitem").contains(this.amendmentData.amendmentReason).click();
        cy._waitForLoading();

        cy.get('body').then($body => {
          const dis = $body.find('#checkbox02')
          if (dis.length) {
            cy.get('#checkbox02').check({ force: true });
          }
          else {
            cy.get('#checkbox03').check({ force: true });
          }
        })
        cy._waitForLoading();
        //填入Comment
        cy.get("div.p-field-label").contains(StringText.Comment).parent().parent().find('textarea.p-inputtextarea').type(this.amendmentData.amendmentComment, { force: true });
        // cy.get(':nth-child(5) > .p-col-12 > .p-fluid > .p-field > .ng-untouched').type(this.amendmentData.amendmentComment, { force: true });

        //擔保品(修改)
        if (this.amendmentData.purchasePrice != "" || this.amendmentData.downPayment != "") {

          cy.get("ul.p-tabview-nav").contains(StringText.Collateral).click({ force: true });
          cy._waitForLoading();
          cy.get("div.p-card-content").then(($cardContent) => {

            if (this.amendmentData.purchasePrice != "") {
              if ($cardContent.find('div[creditdetectdifftarget="purchasePrice"]').length > 0) {
                cy.get('div[creditdetectdifftarget="purchasePrice"]').find('input').type("{selectall}" + this.amendmentData.purchasePrice);
              }

              cy._waitForLoading();

              //跳出autolife警示視窗，要關掉
              cy.wait(1500)
              debugger;
              cy.get('body').then(($body) => {
                if ($body.find("sigv-error-dialog").length > 0) {
                  cy.get("span").contains("OK").click();
                }
              })
            }

            if (this.amendmentData.downPayment != "") {
              cy._waitForLoading();
              if ($cardContent.find('div[creditdetectdifftarget="downPayment"]').length > 0) {
                cy.get('div[creditdetectdifftarget="downPayment"]').find('input').type("{selectall}" + this.amendmentData.downPayment);
              }

            }
          })
        }

        //修改Terms&conditions
        if (this.amendmentData.interestFlatRate != "") {
          cy.get("ul.p-tabview-nav").contains(StringText.TermsAndConditions).click({ force: true });
          cy._waitForLoading();
          cy.get('sigv-input-number[creditdetectdifftarget="interestFlatRate"]').find('input').type("{selectall}" + this.amendmentData.interestFlatRate);
          cy._waitForLoading();
        }

        //Submit
        cy.get('.p-flex-row > .p-d-flex > sigv-bpm-btn.ng-star-inserted > div > :nth-child(1)').click({ force: true });

        cy._waitForLoading();

      } else {
        cy.log('此案件目前有變更申請單尚未跑完，無法開立新的申請單!');
        isAmendment = false;
      }

      cy._getCurrentStageAndProcessor(this.amendmentData.caseNo, companyName).then((returnParameter) => {
        loginUser = returnParameter[DicKeyText.LoginUser];
        currentStage = returnParameter[DicKeyText.CurrentStage];
      })
      expectCurrentStage = StringText.SalesManagerConfirmationStage;
    })
  });

  it("變更作業-初審1簽核關卡", function () {
    debugger;

    if (isAmendment == false) {
      return;
    }

    if (currentStage !== StringText.PreliminaryReviewStage) {
      expectCurrentStage = StringText.PreliminaryReviewStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.amendmentData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.amendmentData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval

    debugger;
    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
    })

    // expectCurrentStage = StringText.PreliminaryReviewStage;

  });

  it("變更作業-初審2簽核關卡", function () {
    debugger;
    if (isAmendment == false) {
      return;
    }
    if (currentStage !== StringText.PreliminaryReviewStage) {
      expectCurrentStage = StringText.PreliminaryReviewStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.amendmentData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.amendmentData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval


    debugger;
    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];

    })
    // expectCurrentStage = StringText.PreliminaryReviewStage;
  });

  it("變更作業-業務主管1簽核關卡", function () {
    debugger;
    if (isAmendment == false) {
      return;
    }
    if (currentStage !== StringText.SalesManagerConfirmationStage) {
      expectCurrentStage = StringText.SalesManagerConfirmationStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.amendmentData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.amendmentData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval

    debugger;
    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];

    })

    // expectCurrentStage = StringText.SalesManagerConfirmationStage;

  });

  it("變更作業-業務主管2簽核關卡", function () {
    if (isAmendment == false) {
      return;
    }
    if (currentStage !== StringText.SalesManagerConfirmationStage) {
      expectCurrentStage = StringText.SalesManagerConfirmationStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.amendmentData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.amendmentData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval


    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
    })
    // expectCurrentStage = StringText.SalesManagerConfirmationStage;
  });

  it("變更作業-審核主管1簽核關卡", function () {
    if (isAmendment == false) {
      return;
    }
    if (currentStage !== StringText.CreditReviewStage) {
      expectCurrentStage = StringText.CreditReviewStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.amendmentData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.amendmentData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval

    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
    })

    // expectCurrentStage = StringText.CreditReviewStage;
  });

  it("變更作業-審核主管2簽核關卡", function () {
    if (isAmendment == false) {
      return;
    }
    if (currentStage !== StringText.CreditReviewStage) {
      expectCurrentStage = StringText.CreditReviewStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.amendmentData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.amendmentData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval


    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
    })

    // expectCurrentStage = StringText.CreditReviewStage;
  });

  it("變更作業-審核主管3簽核關卡", function () {
    if (isAmendment == false) {
      return;
    }
    if (currentStage !== StringText.CreditReviewStage) {
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.amendmentData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.amendmentData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval


    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
    })

    // expectCurrentStage = StringText.CreditReviewStage;
  });

  it("變更作業-核決主管1簽核關卡", function () {
    if (isAmendment == false) {
      return;
    }
    if (currentStage !== StringText.ApprovalStage) {
      expectCurrentStage = StringText.ApprovalStage;
      return;
    }

    cy.log('核決主管1關卡' + processName)
    parameterDic[DicKeyText.CaseNo] = this.amendmentData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.amendmentData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval


    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
    })

    // expectCurrentStage = StringText.ApprovalStage;

  });

  it("變更作業-核決主管2簽核關卡", function () {
    if (isAmendment == false) {
      return;
    }
    if (currentStage !== StringText.ApprovalStage) {
      expectCurrentStage = StringText.ApprovalStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.amendmentData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.amendmentData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval


    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
    })

    // expectCurrentStage = StringText.ApprovalStage;
  });

  it("變更作業-核決主管3簽核關卡", function () {
    if (isAmendment == false) {
      return;
    }
    if (currentStage !== StringText.ApprovalStage) {
      expectCurrentStage = StringText.ApprovalStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.amendmentData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.amendmentData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval


    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
    })

    // expectCurrentStage = StringText.ApprovalStage;
  });

  it("變更作業-核決主管4簽核關卡", function () {
    if (isAmendment == false) {
      return;
    }
    if (currentStage !== StringText.ApprovalStage) {
      expectCurrentStage = StringText.ApprovalStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.amendmentData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.amendmentData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval

    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
    })

    // expectCurrentStage = StringText.ApprovalStage;
  });

  it("變更作業-核決主管5簽核關卡", function () {
    if (isAmendment == false) {
      return;
    }
    if (currentStage !== StringText.ApprovalStage) {
      expectCurrentStage = StringText.ApprovalStage;
      return;
    }

    parameterDic[DicKeyText.CaseNo] = this.amendmentData.caseNo
    parameterDic[DicKeyText.LoginUser] = loginUser
    parameterDic[DicKeyText.CurrentStage] = currentStage
    parameterDic[DicKeyText.ProcessName] = processName
    parameterDic[DicKeyText.CompanyName] = companyName
    parameterDic[DicKeyText.TestData] = this.amendmentData
    parameterDic[DicKeyText.CreditComment] = StringText.Approval

    cy._creditReviewFast(parameterDic).then((returnParameter) => {
      loginUser = returnParameter[DicKeyText.LoginUser];
      currentStage = returnParameter[DicKeyText.CurrentStage];
    })

    // expectCurrentStage = StringText.NoNextStage;
  });

})