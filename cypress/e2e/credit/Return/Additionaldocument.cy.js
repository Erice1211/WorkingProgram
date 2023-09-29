import { StringText, DicKeyText, Company } from "../../../support/shareObjects";


let loginUser = "";
let currentStage = "";
let processName = "";
let expectCurrentStage = "";
let parameterArray = [];
let isProcessEnd = false;
let parameterDic = {};
let companyName = "";
let environment = Cypress.env("environment")
let webSubmissionLoginUrl = "https://sit01-websubmission.chailease.com.my/login"
let caseNo = "";
const path = `${Cypress.env("environment")}/credit/return/Additionaldocument.json`;


describe("退補件流程", () => {

    beforeEach(() => {
        cy.fixture(path).as("additionaldocumentData")
            .then(data => {
                // Login

                cy.log(currentStage)
                // Login
                if (loginUser === "") {
                    // cy._login({userNo:data.user}); 
                    loginUser = data.user;
                    cy.log("default user");
                }
                else if (loginUser === StringText.NoNextUser) {
                    return;
                }

                if (data.startStage === StringText.Submission && currentStage === "") {
                    cy._login({ userNo: data.user, url: webSubmissionLoginUrl });
                } else {
                    cy._login({ userNo: loginUser });
                }

                //設定公司名稱
                if (environment === "kh_sit") {
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
            isProcessEnd = true
        }
        cy._waitForLoading();

        cy.fixture(path)
            .then(data => {
                cy.log('currentStage:'+currentStage);
                if (data.startStage === StringText.Submission && (currentStage === StringText.PreliminaryReviewStage||currentStage==='')) {
                    
                    cy._logoutWebSubmission();
                } else {
                    cy._logout();
                }
            })
    })


    it("業務做退補件", function () {
        debugger;
        parameterDic[DicKeyText.TestData] = this.additionaldocumentData
        cy.AdditionalDocument(parameterDic).then((returnParameter) => {
            cy.log('returnParameter:'+returnParameter)
            if (returnParameter != null) {
                loginUser = returnParameter[DicKeyText.LoginUser];
                currentStage = returnParameter[DicKeyText.CurrentStage];
            }
            else{
                currentStage = StringText.PreliminaryReviewStage;
            }
        })
    })

    it("credit review test-prescreen", function () {
        processName = StringText.CreditReview;
        currentStage = StringText.PreliminaryReviewStage;

        cy.log('進入credit review test-prescreen');
        parameterDic[DicKeyText.CaseNo] = this.additionaldocumentData.caseNo
        parameterDic[DicKeyText.LoginUser] = loginUser
        parameterDic[DicKeyText.CurrentStage] = currentStage
        parameterDic[DicKeyText.ProcessName] = processName
        parameterDic[DicKeyText.CompanyName] = companyName
        parameterDic[DicKeyText.TestData] = this.additionaldocumentData
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

        parameterDic[DicKeyText.CaseNo] = this.additionaldocumentData.caseNo
        parameterDic[DicKeyText.LoginUser] = loginUser
        parameterDic[DicKeyText.CurrentStage] = currentStage
        parameterDic[DicKeyText.ProcessName] = processName
        parameterDic[DicKeyText.CompanyName] = companyName
        parameterDic[DicKeyText.TestData] = this.additionaldocumentData
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

        parameterDic[DicKeyText.CaseNo] = this.additionaldocumentData.caseNo
        parameterDic[DicKeyText.LoginUser] = loginUser
        parameterDic[DicKeyText.CurrentStage] = currentStage
        parameterDic[DicKeyText.ProcessName] = processName
        parameterDic[DicKeyText.CompanyName] = companyName
        parameterDic[DicKeyText.TestData] = this.additionaldocumentData
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


        parameterDic[DicKeyText.CaseNo] = this.additionaldocumentData.caseNo
        parameterDic[DicKeyText.LoginUser] = loginUser
        parameterDic[DicKeyText.CurrentStage] = currentStage
        parameterDic[DicKeyText.ProcessName] = processName
        parameterDic[DicKeyText.CompanyName] = companyName
        parameterDic[DicKeyText.TestData] = this.additionaldocumentData
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

        parameterDic[DicKeyText.CaseNo] = this.additionaldocumentData.caseNo
        parameterDic[DicKeyText.LoginUser] = loginUser
        parameterDic[DicKeyText.CurrentStage] = currentStage
        parameterDic[DicKeyText.ProcessName] = processName
        parameterDic[DicKeyText.CompanyName] = companyName
        parameterDic[DicKeyText.TestData] = this.additionaldocumentData
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


        parameterDic[DicKeyText.CaseNo] = this.additionaldocumentData.caseNo
        parameterDic[DicKeyText.LoginUser] = loginUser
        parameterDic[DicKeyText.CurrentStage] = currentStage
        parameterDic[DicKeyText.ProcessName] = processName
        parameterDic[DicKeyText.CompanyName] = companyName
        parameterDic[DicKeyText.TestData] = this.additionaldocumentData
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


        parameterDic[DicKeyText.CaseNo] = this.additionaldocumentData.caseNo
        parameterDic[DicKeyText.LoginUser] = loginUser
        parameterDic[DicKeyText.CurrentStage] = currentStage
        parameterDic[DicKeyText.ProcessName] = processName
        parameterDic[DicKeyText.CompanyName] = companyName
        parameterDic[DicKeyText.TestData] = this.additionaldocumentData
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


        parameterDic[DicKeyText.CaseNo] = this.additionaldocumentData.caseNo
        parameterDic[DicKeyText.LoginUser] = loginUser
        parameterDic[DicKeyText.CurrentStage] = currentStage
        parameterDic[DicKeyText.ProcessName] = processName
        parameterDic[DicKeyText.CompanyName] = companyName
        parameterDic[DicKeyText.TestData] = this.additionaldocumentData
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

        parameterDic[DicKeyText.CaseNo] = this.additionaldocumentData.caseNo
        parameterDic[DicKeyText.LoginUser] = loginUser
        parameterDic[DicKeyText.CurrentStage] = currentStage
        parameterDic[DicKeyText.ProcessName] = processName
        parameterDic[DicKeyText.CompanyName] = companyName
        parameterDic[DicKeyText.TestData] = this.additionaldocumentData
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


        parameterDic[DicKeyText.CaseNo] = this.additionaldocumentData.caseNo
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


        parameterDic[DicKeyText.CaseNo] = this.additionaldocumentData.caseNo
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
        parameterDic[DicKeyText.CaseNo] = this.additionaldocumentData.caseNo
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