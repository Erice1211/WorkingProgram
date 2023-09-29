// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import { StringText, DicKeyText, ExtraApproverText } from "./shareObjects";
let environment = Cypress.env("environment")
const dayjs = require('dayjs')



Cypress.Commands.add("_login", ({ userNo = "", url = "" }) => {
  if (url.length === 0) {
    cy.visit("/login");
    cy.log('visit baseUrl')
  } else {
    cy.visit(url);
    cy.log('visit Url')
  }
  cy.get("#userAccount").click();
  cy.get("#userAccount").type(userNo);
  cy.get("sigv-login span").click();
});

Cypress.Commands.add("_logout", () => {
  // cy.get("div:nth-of-type(2) img").click();
  // cy.get("sigv-header div.ng-trigger span").click();
  cy.get("button:nth-of-type(3) img").click();
  cy.wait(1000);
  cy.get("sigv-header div.ng-trigger span").click();
});

Cypress.Commands.add("_logoutWebSubmission", () => {
  cy.get("app-header div.ng-star-inserted img").click();
  cy.wait(1000);
  cy.get("app-header div.ng-trigger span").click();
});

//等待Loading
Cypress.Commands.add("_waitForLoading", () => {

  // cy.get("span.loading-text").then($loadingMark => {
  //   if (Cypress.dom.isVisible($loadingMark) ){
  //     cy.wait(1500);
  //     //cy.log('wait again')
  //     cy._waitForLoading();
  //   }else{
  //     //cy.log('wait finish')
  //   }
  // })

  cy.get("div.p-blockui-document").then($loadingMark => {
    if (Cypress.dom.isVisible($loadingMark)) {
      cy.wait(1500);
      //cy.log('wait again')
      cy._waitForLoading();
    } else {
      //cy.log('wait finish')
    }
  })
});

//選擇TODO卡片
Cypress.Commands.add("_chooseTODOCard", (processName, stageName, companyName) => {
  // cy.get('div.card').each($card => {
  //   if ($card.find('div.card-header').text().trim() === processName) {
  //     if ($card.find('div.card-content').text().trim() === stageName) {
  //       // wrap this element so we can
  //       // use cypress commands on it
  //       // cy.log('into if')
  //       cy.wrap($card).click();
  //       cy._waitForLoading();
  //       return;
  //     }
  //   }
  // })

  cy.get('p-accordiontab').contains(companyName).parent().next().find('div.card').each($card => {
    if ($card.find('div.card-header').text().trim() === processName) {
      if ($card.find('div.card-content').text().trim() === stageName) {
        // wrap this element so we can
        // use cypress commands on it
        // cy.log('into if')
        cy.wrap($card).click();
        cy._waitForLoading();
        return;
      }
    }
  })
});

//依照sortColumnName欄位降冪排序
Cypress.Commands.add("_sortColumnDesc", (sortColumnName) => {
  cy.get("th").contains(sortColumnName).then(($colummn) => {
    if ($colummn.find('i.pi-sort-amount-down').length <= 0) {
      cy.wrap($colummn).click();
      cy._waitForLoading();
      cy._sortColumnDesc(sortColumnName);
    } else {
      return;
    }

  })

});

//欄位排序的共用方法
Cypress.Commands.add("_OrderByColumn", (columnName, orderMethod) => {
  //依照收件日期降冪排序
  const orderByReceiveDate = () => {

    cy.get("th").contains(columnName).then(($colummn) => {
      if ($colummn.find('i.pi-sort-amount-down').length <= 0) {
        if (orderMethod == 'DESC') {
          cy.wrap($colummn).click();
        }
        else {
          cy.wrap($colummn).click();
          cy.wrap($colummn).click();
        }
        orderByReceiveDate();
      } else {
        return;
      }
    })
  }
  orderByReceiveDate();
});

//用案件查詢取得關卡名稱
Cypress.Commands.add("_getCurrentStage", (caseNo) => {

  cy._waitForLoading();

  cy.contains("span.p-menuitem-text", StringText.CasesGeneralSearch, { timeout: 5000 }).click({ force: true });

  cy._waitForLoading();


  cy.get('div.p-field-label').contains("Case No.").next().type(caseNo);
  cy.contains("button.p-content-button", "Search").click();

  cy.get("div.p-datatable-unfrozen-view").contains("th", "Workflow Status").invoke('index').then((index) => {
    cy.get("div.p-datatable-unfrozen-view").find("td").eq(index).then((stageName) => {
      return cy.wrap(stageName.text().trim());
    })

  })

});

//用案件查詢取得關卡名稱和處理人員
Cypress.Commands.add("_getCurrentStageAndProcessor", (caseNo, companyName) => {
  //debugger;
  debugger;
  //KH環境目前須先登出用其他人登入來找下一關名稱和人員
  if(environment.includes("kh")){
    cy._logout();
    cy._waitForLoading();
    cy._login({userNo:"KH00480"});
    cy._waitForLoading();
  }

  cy._waitForLoading();

  cy.get("a.p-panelmenu-header-link").contains(companyName).parent().parent().next().contains("span.p-menuitem-text", StringText.CasesGeneralSearch, { timeout: 5000 }).click({ force: true });
  cy._waitForLoading();


  cy.get('div.p-field-label').contains("Case No.").next().type(caseNo, { force: true });
  cy.contains("button.p-content-button", "Search").click({ force: true });

  cy._waitForLoading();
  let returnDic = [];

  cy.get("div.p-datatable-unfrozen-view").contains("th", StringText.WorkflowStatus).invoke('index').then((index) => {
    cy.get("div.p-datatable-unfrozen-view").find("td").eq(index).then((stageName) => {
      returnDic[DicKeyText.CurrentStage] = stageName.text().trim();
    })

  })

  cy.get("div.p-datatable-unfrozen-view").contains("th", StringText.Processor).invoke('index').then((index) => {
    cy.get("div.p-datatable-unfrozen-view").find("td").eq(index).then((processor) => {
      returnDic[DicKeyText.LoginUser] = processor.text().trim().split(' ')[0];
    })

  })
  //debugger;

  cy.get("div.p-datatable-unfrozen-view").contains("th", StringText.CaseStatus).invoke('index').then((index) => {
    cy.get("div.p-datatable-unfrozen-view").find("td").eq(index).then((casestatus) => {

      let count = casestatus.text().trim().split(' ').length;
      let result = "";

      if (count > 3) {
        count = 3;
      }

      for (let i = 0; i < count; i++) {
        result += casestatus.text().trim().split(' ')[i] + ' '
      }
      returnDic[DicKeyText.CaseStatus] = result;//casestatus.text().trim().split(' ')[0] + ' ' + casestatus.text().trim().split(' ')[1] + ' ' + casestatus.text().trim().split(' ')[2];
    })

  })

  //returnArray[2] = cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(17)').text().trim().split(' ')[0]+cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(17)').text().trim().split(' ')[1]+cy.get('.p-datatable-tbody > tr.ng-star-inserted > :nth-child(17)').text().trim().split(' ')[2];

  return cy.wrap(returnDic);

});

//_creditReviewFast:只填寫審查批示就送出
Cypress.Commands.add("_creditReviewFast", (parameterDic) => {
  // let caseNo = parameterArray[0];
  // let loginUser = parameterArray[1];
  // let stageName = parameterArray[2];
  // let processName = parameterArray[3];
  // let isProcessEnd = false;

  let caseNo = parameterDic[DicKeyText.CaseNo];
  let loginUser = parameterDic[DicKeyText.LoginUser];
  let stageName = parameterDic[DicKeyText.CurrentStage];
  let processName = parameterDic[DicKeyText.ProcessName];
  let creditComment = parameterDic[DicKeyText.CreditComment];
  let companyName = parameterDic[DicKeyText.CompanyName];
  let testData = parameterDic[DicKeyText.TestData];


  cy.log("into commands")

  cy._waitForLoading();

  //選擇Stage卡片

  cy._chooseTODOCard(processName, stageName, companyName)

  cy._waitForLoading();

  //待辦清單每頁改成顯示50筆
  cy.get("div.p-dropdown-trigger > span", { timeout: 15000 }).click();
  cy.get("p-dropdownitem").contains("50").click();

  //按照收件時間排序
  cy._OrderByColumn(StringText.ReceivedTime, 'DESC');
  // cy._sortColumnDesc(StringText.ReceivedTime);

  //點擊Case
  cy.get("p-table", { timeout: 10000 })
    .find("a")
    .contains(caseNo)
    .click();

  cy._waitForLoading();

  // 確認Case Summary的CaseNo 是否正確
  cy.contains("div.p-field-label", "Case No", { timeout: 15000 })
    .next()
    .should("contain", caseNo);

  cy._waitForLoading();

  //審查批示
  cy.get("ul.p-tabview-nav").contains(StringText.CreditInstructions).click({ force: true });
  cy._waitForLoading();
  cy.get('[optionlabel="creditCommentName"]', { timeout: 15000 }).click();

  if (creditComment === StringText.Reject) {
    cy.get("p-dropdownitem").contains(StringText.Reject).click();
    cy.get("div.p-field-label").contains("Instruction").parent().next().find('textarea.p-inputtextarea').type(StringText.Reject);
    cy.get("app-credit-instructions").then(($el) => {
      if ($el.find('button[label="Reason"]').length > 0) {
        cy.get('button[label="Reason"]').click({ force: true });
        cy.wait(1000);
        cy.get("div.p-dialog-content").find("div.p-checkbox-box").first().click();
        cy.get('button[label="Close"]').click();
      }
    });
  } else {
    //預設為Approved
    if (stageName === StringText.ApprovalStage) {
      cy.get("p-dropdownitem").contains(StringText.Approved).click();
    } else {
      cy.get("p-dropdownitem").contains(StringText.RecommendedforApproved).click();
    }
    cy.get("div.p-field-label").contains("Instruction").parent().next().find('textarea.p-inputtextarea').type(StringText.Approval);

    //Approve才做加簽動作
    //Leo 20230821 加入選擇加簽
    debugger;
    cy.ExtraApprover(testData, stageName)
  }

  cy._waitForLoading();


  //Submit
  cy.get("span").contains("Submit").click();

  cy._waitForLoading();

  //取得下一關關卡名稱和作業人員
  var returnDic = {};
  returnDic[DicKeyText.CaseNo] = caseNo

  cy._getCurrentStageAndProcessor(caseNo, companyName).then((returnDicFromFunction) => {
    let stageName = returnDicFromFunction[DicKeyText.CurrentStage];
    let currentProcessor = returnDicFromFunction[DicKeyText.LoginUser];
    cy.log(stageName);
    cy.log(currentProcessor);

    if (stageName === StringText.ProcessCompleted) {
      returnDic[DicKeyText.LoginUser] = StringText.NoNextUser
      returnDic[DicKeyText.CurrentStage] = stageName
      returnDic[DicKeyText.ProcessName] = processName

    } else {
      returnDic[DicKeyText.LoginUser] = currentProcessor
      returnDic[DicKeyText.CurrentStage] = stageName
      returnDic[DicKeyText.ProcessName] = processName
    }

  })
  return cy.wrap(returnDic);
});

//_creditReviewPrescreen:初審填寫詳細資料用
Cypress.Commands.add("_creditReviewPrescreen", (parameterDic) => {

  let caseNo = parameterDic[DicKeyText.CaseNo];
  let loginUser = parameterDic[DicKeyText.LoginUser];
  let stageName = parameterDic[DicKeyText.CurrentStage];
  let processName = parameterDic[DicKeyText.ProcessName];
  let testData = parameterDic[DicKeyText.TestData];
  let creditComment = parameterDic[DicKeyText.CreditComment];
  let companyName = parameterDic[DicKeyText.CompanyName];

  cy._waitForLoading();

  //選擇Stage卡片
  cy.log(processName+";"+stageName+";"+companyName)
  cy._chooseTODOCard(processName, stageName, companyName)

  cy._waitForLoading();

  //待辦清單每頁改成顯示50筆
  cy.get("div.p-dropdown-trigger > span", { timeout: 15000 }).click();
  cy.get("p-dropdownitem").contains("50").click();

  //按照收件時間排序
  cy._sortColumnDesc(StringText.ReceivedTime);

  //點擊Case
  cy.get("p-table", { timeout: 10000 })
    .find("a")
    .contains(caseNo)
    .click();

  cy._waitForLoading();

  // 確認Case Summary的CaseNo 是否正確
  cy.contains("div.p-field-label", "Case No", { timeout: 15000 })
    .next()
    .should("contain", caseNo);

  cy._waitForLoading();

  //審查批示
  cy.get("ul.p-tabview-nav").contains(StringText.CreditInstructions).click({ force: true });
  cy._waitForLoading();
  cy.get('[optionlabel="creditCommentName"]').click();

  if (creditComment === StringText.Reject) {
    cy.get("p-dropdownitem").contains(StringText.Reject).click();
    cy.get("div.p-field-label").contains("Instruction").parent().next().find('textarea.p-inputtextarea').type(StringText.Reject);
    cy.get("app-credit-instructions").then(($el) => {
      if ($el.find('button[label="Reason"]').length > 0) {
        cy.get('button[label="Reason"]').click();
        cy.wait(1000);
        cy.get("div.p-dialog-content").find("div.p-checkbox-box").first().click();
        cy.get('button[label="Close"]').click();
      }
    });


  } else {
    //預設為RecommendedforApproved
    cy.get("p-dropdownitem").contains(StringText.RecommendedforApproved).click();
    cy.get("div.p-field-label").contains("Instruction").parent().next().find('textarea.p-inputtextarea').type(StringText.Approval);


    //Approve才做加簽動作
    //Leo 20230821 加入選擇加簽
    debugger;
    cy.ExtraApprover(testData, stageName)

  }

  cy._waitForLoading();

  //客戶資訊(填教育程度和婚姻狀態)
  cy.get("ul.p-tabview-nav").contains(StringText.CustomerInformations).click({ force: true });
  cy._waitForLoading();
  cy.get('app-credit-operations-information').find('p-dropdown[creditdetectdifftarget="educationLevel"]').click();
  cy.get("p-dropdownitem").first().click();
  cy.get('app-credit-operations-information').find('p-dropdown[creditdetectdifftarget="maritalStatus"]').click();
  cy.get("p-dropdownitem").first().click();

  cy.get('app-credit-operations-information').then(($information) => {

     //居住狀態
     if ($information.find('p-dropdown[creditdetectdifftarget="residentialStatus"]').length > 0) {
      cy.wrap($information).find('p-dropdown[creditdetectdifftarget="residentialStatus"]').click();
      cy.get("p-dropdownitem").first().click();;
    }
    
    //職稱
    if ($information.find('input[creditdetectdifftarget="Position"]').length > 0) {
      cy.wrap($information).find('input[creditdetectdifftarget="Position"]').type(testData.position);
    }
    //產業
    if ($information.find('p-dropdown[creditdetectdifftarget="Industry"]').length > 0) {
      cy.wrap($information).find('p-dropdown[creditdetectdifftarget="Industry"]').click();
      cy.get("p-dropdownitem").first().click();;
    }
  })
  cy._waitForLoading();
  //KH需填寫其他必填資訊
  if(environment.includes("kh")){
    cy.get('app-credit-operations-information').then(($information) => {

      if ($information.find('p-dropdown[creditdetectdifftarget="gender"]').length > 0) {
        cy.wrap($information).find('p-dropdown[creditdetectdifftarget="gender"]').click();
        cy.get("p-dropdownitem").first().click();;
      }

      if ($information.find('p-calendar[creditdetectdifftarget="idIssueDate"]').length > 0) {
        cy.wrap($information).find('p-calendar[creditdetectdifftarget="idIssueDate"]').type(testData.idIssueDate);
      }

      if ($information.find('p-calendar[creditdetectdifftarget="idExpiryDate"]').length > 0) {
        cy.wrap($information).find('p-calendar[creditdetectdifftarget="idExpiryDate"]').type(testData.idExpiryDate);
      }

      if ($information.find('p-calendar[creditdetectdifftarget="birthdate"]').length > 0) {
        cy.wrap($information).find('p-calendar[creditdetectdifftarget="birthdate"]').type(testData.birthDate);
      }

      if ($information.find('input[creditdetectdifftarget="familyNameKH"]').length > 0) {
        cy.wrap($information).find('input[creditdetectdifftarget="familyNameKH"]').type(testData.familyNameKH);
      }

      if ($information.find('input[creditdetectdifftarget="firstNameKH"]').length > 0) {
        cy.wrap($information).find('input[creditdetectdifftarget="firstNameKH"]').type(testData.firstNameKH);
      }

      if ($information.find('input[creditdetectdifftarget="EmployerName"]').length > 0) {
        cy.wrap($information).find('input[creditdetectdifftarget="EmployerName"]').type(testData.employerName);
      }

      //填所有地址(註冊、聯絡、工作)
      if ($information.find('sigv-address-diff-selector').length > 0) {
        cy.wrap($information).find('p-dropdown.addr-level-01').each(($addr1)=>{
          cy.wrap($addr1).click().then(()=>{
            cy.get("p-dropdownitem").first().click();
            cy._waitForLoading();
          })
        })

        cy.wrap($information).find('p-dropdown.addr-level-02').each(($addr2)=>{
          cy.wrap($addr2).click().then(()=>{
            cy.get("p-dropdownitem").first().click();
            cy._waitForLoading();
          })
        })

        cy.wrap($information).find('p-dropdown.addr-level-03').each(($addr3)=>{
          cy.wrap($addr3).click().then(()=>{
            cy.get("p-dropdownitem").first().click();
            cy._waitForLoading();
          })
        })

        cy.wrap($information).find('p-dropdown.addr-level-04').each(($addr4)=>{
          cy.wrap($addr4).click().then(()=>{
            cy.get("p-dropdownitem").first().click();
            cy._waitForLoading();
          })
        })

        cy.wrap($information).find('input.addr-level-05').each(($addr5)=>{
          cy.wrap($addr5).type('test').then(()=>{
            cy._waitForLoading();
          })
        })

        //年資
        if ($information.find('sigv-input-number[creditdetectdifftarget="LengthOfEmployment"]').length > 0) {
          cy.wrap($information).find('sigv-input-number[creditdetectdifftarget="LengthOfEmployment"]').type(testData.lengthOfEmployment);
        }

      }

      

      //Leo add  mobile phone.
      // cy.get('app-information-individual.ng-star-inserted > :nth-child(1) > h2').click()
      // if($information.contains(StringText.MobilePhoneNo1).length>0){
      //   cy.contains(StringText.MobilePhoneNo1).parent().parent().find("input").type(testData.mobilePhone, { force: true })
      // }
      

    })

    cy.get('app-credit-operations-information').contains(StringText.MobilePhoneNo1).then((phone1) => {
      if(phone1.length>0){
        cy.wrap(phone1).parent().next().find('input').type(testData.mobilePhone)
      }
    })

  }

  //保證人和聯絡人
  cy.get("ul.p-tabview-nav").contains(StringText.GuarantorAndContactPerson).click({ force: true });
  cy._waitForLoading();

  //KH需填寫資料
  if(environment.includes("kh")){
    //展開所有保證人的隱藏欄位
    cy.get('app-credit-operations-guarantor').contains('button',StringText.Expand).then(($expandButton)=>{
      if($expandButton.length>0){
        cy.get('app-credit-operations-guarantor').find('button.cfc-collapse-button').each(($expandButtons)=>{
          cy.wrap($expandButtons).click()
        })
      }
    })

    //填寫KH姓名
    cy.get('app-credit-operations-guarantor').then(($guarantor) => {
      if ($guarantor.find('input[creditdetectdifftarget="familyNameKH"]').length > 0) {
        cy.wrap($guarantor).find('input[creditdetectdifftarget="familyNameKH"]').type(testData.familyNameKH);
      }

      if ($guarantor.find('input[creditdetectdifftarget="firstNameKH"]').length > 0) {
        cy.wrap($guarantor).find('input[creditdetectdifftarget="firstNameKH"]').type(testData.firstNameKH);
      }


    })
  }
 



  //擔保品
  cy.get("ul.p-tabview-nav").contains(StringText.Collateral).click({ force: true });
  cy._waitForLoading();
  cy.get("app-credit-operations-security-asset").then(($collateral) => {
    cy.get('p-dropdown[creditdetectdifftarget="vehicleType"]').click();
    cy.get("p-dropdownitem").first().click();
    cy._waitForLoading();
    if ($collateral.find('div[creditdetectdifftarget="purchasePrice"]').length > 0) {
      cy.get('div[creditdetectdifftarget="purchasePrice"]').find('input').each(($purchasePrice) => {
        cy.wrap($purchasePrice).type("{selectall}" + testData.purchasePrice);
      })
    }
    cy._waitForLoading();
    if ($collateral.find('div[creditdetectdifftarget="creditAppraisalPrice"]').length > 0) {
      cy.get('div[creditdetectdifftarget="creditAppraisalPrice"]').find('input').each(($creditAppraisalPrice) => {
        cy.wrap($creditAppraisalPrice).type("{selectall}" + testData.creditAppraisalPrice);
      })
    }

    //Leo add 2023/08/14
    //跳出autolife警示視窗，要關掉
    cy.wait(1500)
    cy.AlertWindow();
    debugger;
    // cy.get('body').then(($body) => {
    //   if ($body.find("sigv-error-dialog").length > 0) {
    //     cy.get("span").contains("OK").click();
    //   }
    // })

    cy._waitForLoading();
    if ($collateral.find('div[creditdetectdifftarget="downPayment"]').length > 0) {
      cy.get('div[creditdetectdifftarget="downPayment"]').find('input').each(($downPayment) => {
        cy.wrap($downPayment).type("{selectall}" + testData.downPayment);
      })
    }

    //買賣交易
    cy._waitForLoading();
    if ($collateral.find('p-dropdown[creditdetectdifftarget="Transmission"]').length > 0) {
      cy.wrap($collateral).find('p-dropdown[creditdetectdifftarget="Transmission"]').each(($dropDown)=>{
        //cy.wrap($dropDown).click()//買賣交易要Click兩次才會出現下拉選單，原因未知
        cy.wrap($dropDown).click().then(()=>{
          cy._waitForLoading();
          cy.get("p-dropdownitem").first().click();
        })  
      }); 
    }

    //出廠年份
    cy._waitForLoading();
    if ($collateral.find('p-calendar[creditdetectdifftarget="DateManufacture"]').length > 0) {
      cy.wrap($collateral).find('p-calendar[creditdetectdifftarget="DateManufacture"]').each(($calendar)=>{
        cy.wrap($calendar).type(testData.dateManufacture);
      })
    }

    cy._waitForLoading();
  })
  cy._waitForLoading();

  //交易條件
  cy.get("ul.p-tabview-nav").contains(StringText.TermsAndConditions).click({ force: true });
  cy._waitForLoading();
  cy.get('sigv-input-number[creditdetectdifftarget="interestFlatRate"]').find('input').type("{selectall}" + testData.interestFlatRate);
  cy._waitForLoading();
  cy.get('app-terms-and-conditions').then(($information) => {
    if ($information.find('p-dropdown[creditdetectdifftarget="DealerInvoiceType"]').length > 0) {
      cy.wrap($information).find('p-dropdown[creditdetectdifftarget="DealerInvoiceType"]').click().then(()=>{
        cy.get("p-dropdownitem").first().click();
      }); 
    }

    //還款期數
    cy._waitForLoading();
     if ($information.find('sigv-input-number[creditdetectdifftarget="ApplyTenure"]').length > 0) {
      cy.get('sigv-input-number[creditdetectdifftarget="ApplyTenure"]').find('input').each(($applyTenure) => {
        cy.wrap($applyTenure).type("{selectall}" + testData.applyTenure);
      })
    }

  })

  //KH需填寫其他必填資訊
  if(environment.includes("kh")){
    cy.get('app-terms-and-conditions').then(($information) => {

      if ($information.find('p-dropdown[creditdetectdifftarget="purposeNBC"]').length > 0) {
        cy.wrap($information).find('p-dropdown[creditdetectdifftarget="purposeNBC"]').click();
        cy.get("p-dropdownitem").first().click();
      }

      if ($information.find('p-dropdown[creditdetectdifftarget="DealerCode"]').length > 0) {
        cy.wrap($information).find('p-dropdown[creditdetectdifftarget="DealerCode"]').click()
        cy.get("input.p-dropdown-filter").type("23090001")//目前只有特定供應商可以選到業務
        .then(()=>{
          cy._waitForLoading();
          cy.get("p-dropdownitem").first().click();
        })
        cy._waitForLoading();
      }

      if ($information.find('p-dropdown[creditdetectdifftarget="DealerSalesName"]').length > 0) {
        cy.wrap($information).find('p-dropdown[creditdetectdifftarget="DealerSalesName"]').click();
        cy.get("p-dropdownitem").first().click();
        cy._waitForLoading();
      }

      if ($information.find('p-dropdown[creditdetectdifftarget="DealerInvoiceType"]').length > 0) {
        cy.wrap($information).find('p-dropdown[creditdetectdifftarget="DealerInvoiceType"]').click();
        cy.get("p-dropdownitem").first().click();
      }

      if ($information.find('p-dropdown[creditdetectdifftarget="VatPaidBy"]').length > 0) {
        cy.wrap($information).find('p-dropdown[creditdetectdifftarget="VatPaidBy"]').click();
        cy.get("p-dropdownitem").first().click();
      }

    })
  }

  //審查報告
  cy.get("ul.p-tabview-nav").contains(StringText.CreditReport).click({ force: true });
  cy._waitForLoading();
  //Scoring Sheet 每個選項都選第一個
  cy.get('div[subsideitem="CreditOperations.Report.SubMenuTag.Scoring"]').find('p-dropdown').each(($dropDown) => {
    // 滑鼠點擊
    cy.wrap($dropDown).click();
    cy.get("p-dropdownitem").first().click();

    //鍵盤操作
    //cy.wrap($dropDown).type("{downArrow}{enter}");
  })

  //Submit
  cy.get("span").contains("Submit").click();

  cy._waitForLoading();


  //取得下一關關卡名稱和作業人員
  var returnDic = {};
  returnDic[DicKeyText.CaseNo] = caseNo

  cy._getCurrentStageAndProcessor(caseNo, companyName).then((returnDicFromFunction) => {
    let stageName = returnDicFromFunction[DicKeyText.CurrentStage];
    let currentProcessor = returnDicFromFunction[DicKeyText.LoginUser];

    if (stageName === StringText.ProcessCompleted) {
      returnDic[DicKeyText.LoginUser] = StringText.NoNextUser
      returnDic[DicKeyText.CurrentStage] = stageName
      returnDic[DicKeyText.ProcessName] = processName

    } else {
      returnDic[DicKeyText.LoginUser] = currentProcessor
      returnDic[DicKeyText.CurrentStage] = stageName
      returnDic[DicKeyText.ProcessName] = processName
    }

  })

  return cy.wrap(returnDic);

});

//ToSecondaryCreditReview:初審填寫詳細資料用，為了進到授服作業
Cypress.Commands.add("ToSecondaryCreditReview", (parameterDic) => {
  let caseNo = parameterDic[DicKeyText.CaseNo];
  let loginUser = parameterDic[DicKeyText.LoginUser];
  let stageName = parameterDic[DicKeyText.CurrentStage];
  let processName = parameterDic[DicKeyText.ProcessName];
  let isProcessEnd = false;
  let testData = parameterDic[DicKeyText.TestData];
  let creditComment = parameterDic[DicKeyText.CreditComment];
  let RanciGrade = parameterDic[DicKeyText.RanciGrade];
  let companyName = parameterDic[DicKeyText.CompanyName];

  cy._waitForLoading();

  //選擇Stage卡片
  //debugger;
  //cy.log("ToSecondaryCreditReview中的" + processName + ";" + stageName)
  cy._chooseTODOCard(processName, stageName, companyName)
  cy._waitForLoading();

  //待辦清單每頁改成顯示50筆
  cy.get("div.p-dropdown-trigger > span", { timeout: 15000 }).click();
  cy.get("p-dropdownitem").contains("50").click();

  //按照收件時間排序
  cy._sortColumnDesc(StringText.ReceivedTime);

  //點擊Case
  cy.get("p-table", { timeout: 10000 })
    .find("a")
    .contains(caseNo)
    .click();
  cy._waitForLoading();

  // 確認Case Summary的CaseNo 是否正確
  cy.contains("div.p-field-label", "Case No", { timeout: 15000 })
    .next()
    .should("contain", caseNo);
  cy._waitForLoading();

  //審查批示
  cy.get("ul.p-tabview-nav").contains(StringText.CreditInstructions).click({ force: true });
  cy._waitForLoading();
  cy.get('[optionlabel="creditCommentName"]').click();
  if (creditComment === StringText.Reject) {
    cy.get("p-dropdownitem").contains(StringText.Reject).click();

    //初審階段的Reject才要勾選理由
    if (stageName === StringText.PreliminaryReviewStage || stageName === StringText.CreditReviewStage) {
      cy.get('.p-col-12 > .p-field > .p-content-button > .p-button-label').click({ force: true });
      // cy.contains("button.p-content-button p-ml-2 p-button p-component", "Reason").click({force:true});
      // cy.get('p-d-flex p-ai-center p-field-checkbox').check();
      cy.get(':nth-child(1) > .p-d-flex > .ng-untouched > .p-checkbox > .p-checkbox-box').click({ force: true });
      // cy.contains("button.p-button-secondary p-content-button p-mr-2 p-button p-component", "Close").click({force:true});
      cy.get('.p-dialog-footer > .p-d-flex > .p-button-secondary').click({ force: true });
    }
    cy.get("div.p-field-label").contains("Instruction").parent().next().find('textarea.p-inputtextarea').type(StringText.Reject);
  } else {
    //預設為RecommendedforApproved
    // cy.get("p-dropdownitem").contains(StringText.RecommendedforApproved).click();
    // cy.get("div.p-field-label").contains("Instruction").parent().next().find('textarea.p-inputtextarea').type(StringText.Approval);
    if (stageName === StringText.ApprovalStage) {
      cy.get("p-dropdownitem").contains(StringText.Approved).click();
    } else {
      cy.get("p-dropdownitem").contains(StringText.RecommendedforApproved).click();
    }
    cy.wait(1000);
    cy.get("div.p-field-label").contains("Instruction").parent().next().find('textarea.p-inputtextarea').type(StringText.Approval);

    //Approve才做加簽動作
    //Leo 20230821 加入選擇加簽
    //debugger;
    cy.ExtraApprover(testData, stageName)
  }

  cy._waitForLoading();

  if (stageName === StringText.PreliminaryReviewStage) {
    //客戶資訊(填教育程度和婚姻狀態)
    cy.get("ul.p-tabview-nav").contains(StringText.CustomerInformations).click({ force: true });
    cy._waitForLoading();
    cy.get('app-credit-operations-information').find('p-dropdown[creditdetectdifftarget="educationLevel"]').click();
    cy.get("p-dropdownitem").first().click();
    cy.get('app-credit-operations-information').find('p-dropdown[creditdetectdifftarget="maritalStatus"]').click();
    cy.get("p-dropdownitem").first().click();
    cy._waitForLoading();

    //擔保品
    cy.get("ul.p-tabview-nav").contains(StringText.Collateral).click({ force: true });
    cy._waitForLoading();
    cy.get("div.p-card-content").then(($cardContent) => {
      cy.get('p-dropdown[creditdetectdifftarget="vehicleType"]').click();
      cy.get("p-dropdownitem").first().click();
      cy._waitForLoading();

      if ($cardContent.find('div[creditdetectdifftarget="purchasePrice"]').length > 0) {
        cy.get('div[creditdetectdifftarget="purchasePrice"]').find('input').type("{selectall}" + testData.purchasePrice);
      }

      cy._waitForLoading();

      if ($cardContent.find('div[creditdetectdifftarget="creditAppraisalPrice"]').length > 0) {
        cy.get('div[creditdetectdifftarget="creditAppraisalPrice"]').find('input').type("{selectall}" + testData.creditAppraisalPrice);

        //跳出autolife警示視窗，要關掉
        cy.wait(1500)
        //debugger;
        cy.get('body').then(($body) => {
          if ($body.find("sigv-error-dialog").length > 0) {
            cy.get("span").contains("OK").click();
          }
        })
      }

      cy._waitForLoading();

      if ($cardContent.find('div[creditdetectdifftarget="downPayment"]').length > 0) {
        cy.get('div[creditdetectdifftarget="downPayment"]').find('input').type("{selectall}" + testData.downPayment);
      }

      cy._waitForLoading();
    })

    cy._waitForLoading();

    //交易條件
    cy.get("ul.p-tabview-nav").contains(StringText.TermsAndConditions).click({ force: true });
    cy._waitForLoading();
    cy.get('sigv-input-number[creditdetectdifftarget="interestFlatRate"]').find('input').type("{selectall}" + testData.interestFlatRate);
    cy._waitForLoading();

    //審查報告
    cy.get("ul.p-tabview-nav").contains(StringText.CreditReport).click({ force: true });
    cy._waitForLoading();
    cy.get('div[subsideitem="CreditOperations.Report.SubMenuTag.Scoring"]').find('p-dropdown').each(($dropDown) => {
      //滑鼠點擊
      cy.wrap($dropDown).click();
      cy.get("p-dropdownitem").first().click();
      //鍵盤操作
      //cy.wrap($dropDown).type("{downArrow}{enter}");
    })

    //設定RANCI Grade
    debugger;

    if (RanciGrade != "") {
      cy.contains(StringText.RAMCIGrade).parent().find("input").type(RanciGrade)
    }

  }
  debugger;

  //Submit
  cy._waitForLoading();
  // cy.get("span").contains("Save").click();
  // cy._waitForLoading();
  cy.get("span").contains("Submit").click();

  cy._waitForLoading();

  //取得下一關關卡名稱和作業人員
  var returnDic = {};
  returnDic[DicKeyText.CaseNo] = caseNo

  cy._getCurrentStageAndProcessor(caseNo, companyName).then((returnDicFromFunction) => {
    let stageName = returnDicFromFunction[DicKeyText.CurrentStage];
    let currentProcessor = returnDicFromFunction[DicKeyText.LoginUser];
    let currentCaseStatus = returnDicFromFunction[DicKeyText.CaseStatus];

    cy.log(stageName);
    cy.log(currentProcessor);

    if (stageName === StringText.ProcessCompleted) {
      returnDic[DicKeyText.LoginUser] = StringText.NoNextUser
      returnDic[DicKeyText.CurrentStage] = stageName
      returnDic[DicKeyText.ProcessName] = processName
      returnDic[DicKeyText.CaseStatus] = currentCaseStatus
    } else {
      returnDic[DicKeyText.LoginUser] = currentProcessor
      returnDic[DicKeyText.CurrentStage] = stageName
      returnDic[DicKeyText.ProcessName] = processName
      returnDic[DicKeyText.CaseStatus] = currentCaseStatus
    }
  })

  return cy.wrap(returnDic);
});


//加簽指派
Cypress.Commands.add("ExtraApprover", (testData, stageName) => {
  //加簽人員
  let ExtraMatch = false;
  cy.get("div.p-tabview-panels").then(($ExtraApproveLevel) => {

    if ($ExtraApproveLevel.find('label[for="extraApproverLevel"]').length > 0) {

      //點選Comment標題，為了把Instrction訊息視窗點掉
      cy.get('h2.ng-star-inserted').contains(StringText.Comment).click()
      // cy.get('app-credit-instructions > :nth-child(1) > h2.ng-star-inserted').click()

      // 打開加簽欄位選單
      cy.get('label[for="extraApproverLevel"]').contains(StringText.ExtraApproverLevel).parent().parent().find('p-dropdown.p-inputwrapper-filled').click()

      cy.get('.p-dropdown > .ng-trigger').each(($dropDownItem) => {

        if (stageName == StringText.PreliminaryReviewStage && testData.PreliminaryStageExtrFlag1 == "Y") {
          cy.log('進入if')
          ExtraMatch = false;
          for (let i = 0; i < $dropDownItem.find('span.ng-star-inserted').length; i++) {
            if ($dropDownItem.find('span.ng-star-inserted').eq(i).text().trim() == ExtraApproverText.PreliminaryStageExtr1) {
              cy.log('選單內容有符合')
              cy.wrap($dropDownItem.find('span.ng-star-inserted').eq(i)).click();
              ExtraMatch = true;
              return;
            }
          }
        }
        else if (stageName == StringText.SalesManagerConfirmationStage && testData.SalesManagerConfirmationStageExtrFlag1 == "Y") {
          ExtraMatch = false;
          for (let i = 0; i < $dropDownItem.find('span.ng-star-inserted').length; i++) {
            if ($dropDownItem.find('span.ng-star-inserted').eq(i).text().trim() == ExtraApproverText.SalesManagerConfirmationStageExtr1) {
              cy.wrap($dropDownItem.find('span.ng-star-inserted').eq(i)).click();
              ExtraMatch = true;
              return;
            }
          }
        }
        else if (stageName == StringText.CreditReviewStage && (testData.CreditReviewStageExtrFlag1 == "Y" || testData.CreditReviewStageExtrFlag2 == "Y")) {
          cy.log('進入if')
          ExtraMatch = false;
          for (let i = 0; i < $dropDownItem.find('span.ng-star-inserted').length; i++) {
            if ($dropDownItem.find('span.ng-star-inserted').eq(i).text().trim() == ExtraApproverText.CreditReviewStageExtr1) {
              cy.wrap($dropDownItem.find('span.ng-star-inserted').eq(i)).click();
              ExtraMatch = true;
              return;
            }
          }
          if (ExtraMatch == false) {
            for (let j = 0; j < $dropDownItem.find('span.ng-star-inserted').length; j++) {
              if ($dropDownItem.find('span.ng-star-inserted').eq(j).text().trim() == ExtraApproverText.CreditReviewStageExtr2) {
                cy.wrap($dropDownItem.find('span.ng-star-inserted').eq(j)).click();
                ExtraMatch = true;
                return;
              }
            }
          }
        }
        else if (stageName == StringText.ApprovalStage && (testData.ApprovalStageExtrFlag1 == "Y" || testData.ApprovalStageExtrFlag2 == "Y" || testData.ApprovalStageExtrFlag3 == "Y" || testData.ApprovalStageExtrFlag4 == "Y")) {
          cy.log('進入if')
          ExtraMatch = false;
          for (let i = 0; i < $dropDownItem.find('span.ng-star-inserted').length; i++) {
            if ($dropDownItem.find('span.ng-star-inserted').eq(i).text().trim() == ExtraApproverText.ApprovalStageExtr1) {
              cy.wrap($dropDownItem.find('span.ng-star-inserted').eq(i)).click();
              ExtraMatch = true;
              return;
            }
          }
          cy.log('ExtraMatch2:' + ExtraMatch)
          if (ExtraMatch == false) {
            for (let j = 0; j < $dropDownItem.find('span.ng-star-inserted').length; j++) {
              if ($dropDownItem.find('span.ng-star-inserted').eq(j).text().trim() == ExtraApproverText.ApprovalStageExtr2) {
                cy.wrap($dropDownItem.find('span.ng-star-inserted').eq(j)).click();
                ExtraMatch = true;
                return;
              }
            }
          }
          cy.log('ExtraMatch3:' + ExtraMatch)
          if (ExtraMatch == false) {
            for (let k = 0; k < $dropDownItem.find('span.ng-star-inserted').length; k++) {
              if ($dropDownItem.find('span.ng-star-inserted').eq(k).text().trim() == ExtraApproverText.ApprovalStageExtr3) {
                cy.wrap($dropDownItem.find('span.ng-star-inserted').eq(k)).click();
                ExtraMatch = true;
                return;
              }
            }
          }
          cy.log('ExtraMatch4:' + ExtraMatch)
          if (ExtraMatch == false) {
            for (let l = 0; l < $dropDownItem.find('span.ng-star-inserted').length; l++) {
              if ($dropDownItem.find('span.ng-star-inserted').eq(l).text().trim() == ExtraApproverText.ApprovalStageExtr4) {
                cy.wrap($dropDownItem.find('span.ng-star-inserted').eq(l)).click();
                ExtraMatch = true;
                return;
              }
            }
          }
        }
      })
    }

  })

})


//進件
Cypress.Commands.add("_webSubmission", ({ testData }) => {

  //點進件加號
  cy.get('p-sidebar[styleclass="ice-pop-layout-sidebar desktop"]').contains(StringText.Submission).prev().click();
  cy._waitForLoading();

  //複製案件
  cy.get('label').contains(StringText.CopyCaseDetails).click();
  cy.get('app-leading-page').contains(StringText.IDNo).next().type(testData.idNo);
  cy.get('app-leading-page').find('button').contains(StringText.Query).click();
  cy._waitForLoading();
  cy.contains('td', testData.caseNoCopy).prev().click();
  cy.get('app-leading-page').contains('a', StringText.Next).click();
  cy._waitForLoading();
  //KH需先做EKYC
  if(environment.includes("kh")){
    cy.get('app-ekyc').contains('a',StringText.EKYCVerify).click()
    .then(() => {
      //上傳檔案
      cy.get('div.p-field-label').contains(StringText.IDcard).parent().next().find('input[type=file]').selectFile(testData.idCardPath,{ force: true })
      cy.get('div.p-field-label').contains(StringText.Photo).parent().next().find('input[type=file]').selectFile(testData.photoPath,{ force: true })
    })
    .then(() => {
      //驗證按鈕
      cy.get('button[ng-reflect-label="EKYC Verify"]').click();
      cy._waitForLoading();
    })
    .then(() => {
      //關閉驗證視窗
      cy.get('div.p-dialog-header').contains('h1',StringText.EKYCVerify).next().find('span.p-dialog-header-close-icon').click()
    })

  }

  cy._waitForLoading();
  cy.get('app-process').contains('a',StringText.Submit).click();
  cy._waitForLoading();

  //搜尋剛剛進件案件
  cy.get('p-sidebar[styleclass="ice-pop-layout-sidebar desktop"]').contains(StringText.Search).prev().click();
  cy._waitForLoading();
  cy.get('app-index').contains('label', StringText.IDNo).parent().next().type(testData.idNo);
  cy.get('app-index').contains('label', StringText.ProductName).parent().next().click();
  cy.get('input.p-multiselect-filter').type(testData.product);
  cy.get('p-multiselectitem[ng-reflect-label="'+testData.product+'"]').click();

  if(environment.includes("kh")){
    //KH日期YYYY/MM/DD
    cy.get('app-index').contains('label',StringText.ApplicationDate).parent().next().children().first().type(dayjs().format('YYYY/MM/DD'));
  }else{
    cy.get('app-index').contains('label',StringText.ApplicationDate).parent().next().children().first().type(dayjs().format('DD/MM/YYYY'));
  }
  cy.get('app-index').contains('a',StringText.Search).click();
  cy._waitForLoading();

  //增加Filter Field，顯示全部欄位
  cy.get('app-index').find('button[ng-reflect-label="Filter Field"]').click();
  cy.get('p-multiselectitem[ng-reflect-label="Search.Common.All"]').then(function ($item) {
    if ($item.find('span.pi-check').length <= 0) {
      cy.wrap($item).click();
    }
  })
  cy.get('app-index').find('button[ng-reflect-label="Filter Field"]').click();//關閉顯示

  //降冪排序
  cy._sortColumnDesc(StringText.CaseNo);

  //取得CaseNo、下一關名稱和處理人員
  var returnDic = {};

  cy.get("p-table").contains("th", StringText.CaseNo).invoke('index').then((index) => {
    cy.get("tbody").find("tr").eq(0).find("td").eq(index).then((caseNo) => {
      returnDic[DicKeyText.CaseNo] = caseNo.text().trim();
      cy.log('Case No：' + caseNo.text())
    })

  })

  cy.get("p-table").contains("th", StringText.WorkflowStage).invoke('index').then((index) => {
    cy.get("tbody").find("tr").eq(0).find("td").eq(index).then((stageName) => {
      returnDic[DicKeyText.CurrentStage] = stageName.text().trim();
      cy.log('下一關：' + stageName.text())
    })

  })

  cy.get("p-table").contains("th", StringText.Processor).invoke('index').then((index) => {
    cy.get("tbody").find("tr").eq(0).find("td").eq(index).then((processor) => {
      returnDic[DicKeyText.LoginUser] = processor.text().trim().split(' ')[0];
      cy.log('處理人：' + processor.text())
    })

  })

  return cy.wrap(returnDic);

})

//退補件
Cypress.Commands.add("AdditionalDocument", (parameterDic) => {
  var returnData = {};
  let ProductName = '';
  cy.log("拋過來的陣列" + parameterDic);
  let testData = parameterDic[DicKeyText.TestData];
  debugger;
  cy.log("傳過來資料:" + testData)
  //returnData[DicKeyText.CaseNo] = caseNo
  //點進件加號
  cy.get('p-sidebar[styleclass="ice-pop-layout-sidebar desktop"]').contains(StringText.ToDo).prev().click();
  cy._waitForLoading();
  cy.get("span").contains(StringText.ReturnAdditionalDoc).click({ force: true });
  cy.get("span").contains(StringText.Expand).click({ force: true });
  cy.log(testData.caseNo)
  cy.get('div.p-field-label').contains(StringText.CaseNoPoint).parent().next().type(testData.caseNo);
  cy.get('.p-field > .button > .btn-primary').click();

  let tabledata ="";
  var returnDic = {};
  //檢查是否找到要做退補件的單號連結
cy.get('.p-text-center').invoke('text').then((text) => {

  cy.log('目前是否有取到單號:'+text);
  tabledata=text;
  if (tabledata.toString().trim() == "No Data") {
    cy.log('此案件目前無需做退補件!');
  }
  else {
    cy.get('p-table').contains(testData.caseNo).parent().then($detail => {

      if ($detail.find('a').length > 0) {
        cy.get("p-table", { timeout: 10000 })
          .find("a")
          .contains(testData.caseNo)
          .click();
        cy._waitForLoading();
        cy.AlertWindow();

        //填入Condition Change
        cy.get("div.p-field-label").contains(StringText.ConditionChange).parent().parent().find('textarea.p-inputtextarea').type(testData.ConditionChange, { force: true });
        cy.get("span").contains(StringText.CustomerInformation).click({ force: true });

        //Product Name
        if (testData.ProductName != "") {
          cy.get('p-dropdown[optionlabel="productName"]').click();
          cy.get("p-dropdownitem").contains(testData.ProductName).click();
          ProductName = testData.ProductName;
        }

        cy.get('p-dropdown[optionlabel="productName"]').find('span')  // 選擇你想要的 <span> 元素
          .invoke('text')  // 使用 invoke('text') 獲取文字內容
          .then((text) => {
            // 在這裡可以使用 text 變數來訪問 <span> 元素的文字內容
            // 例如，可以將文字內容輸出到控制台
            cy.log('Span 元素的文字內容是:', text);
            ProductName = text;
            cy.log('ProductName是:', ProductName);
          });

        //修改Customer Information
        if (testData.IdentityType === "Individual") {
          cy.get('p-dropdown[formcontrolname="identityType"]').click();
          cy.get("p-dropdownitem").contains(testData.IdentityType).click();
          cy._waitForLoading();
          cy.AlertWindow();

          //Identification Type
          if (testData.IdentificationType != "" && ProductName != "HP for PC-Used") {
            cy.get('app-customer-information').find('p-dropdown[formcontrolname="identificationType"]').click();
            cy.get("p-dropdownitem").contains(testData.IdentificationType).click();
          }


          //IdNo
          if (testData.IDNo != "") {
            cy.get('app-customer-information').find('input[formcontrolname="idNo"]').type("{selectall}" + testData.IdNo);
            cy._waitForLoading();
            cy.AlertWindow();
          }

          //姓名
          if (testData.IndivName != "") {
            cy.get('app-customer-information').find('input[formcontrolname="firstName"]').type("{selectall}" + testData.IndivName, { force: true });
            cy._waitForLoading();
            cy.AlertWindow();
          }

          //修改生日
          if (testData.BirthDate != "") {
            cy.get('app-customer-information').then(($information) => {

              if ($information.find('p-calendar[formcontrolname="birthdate"]').length > 0) {
                cy.wrap($information).find('input[placeholder="dd/MM/yyyy"]').type("{selectall}" + testData.BirthDate, { force: true });
                cy._waitForLoading();
                cy.AlertWindow();
              }
            })
          }

          cy._waitForLoading();
          cy.AlertWindow();
          //選擇性別
          if (testData.Male == "Y") {
            cy.get('[type="radio"]').check('1', { force: true })
          }
          else {
            cy.get('[type="radio"]').check('2', { force: true })
          }

          //選擇國籍
          if (testData.Nationality != "") {
            cy.get('p-dropdown[formcontrolname="nationality"]').click();
            cy.get("p-dropdownitem").contains(testData.Nationality).click();
          }

          //婚姻狀態
          if (testData.MaritalStatus != "" && ProductName != "HP for PC-Used") {
            cy.get('p-dropdown[formcontrolname="maritalStatus"]').click();
            cy.get("p-dropdownitem").contains(testData.MaritalStatus).click();
          }

          //種族
          if (testData.Race != "") {
            cy.get('p-dropdown[formcontrolname="race"]').click();
            cy.get("p-dropdownitem").contains(testData.Race).click();
          }

          //Email
          if (testData.Email != "") {
            cy.get('input[formcontrolname="email"]').type("{selectall}" + testData.Email);
          }

          //居住狀況
          if (testData.ResidentialStatus != "" && ProductName != "HP for PC-Used") {
            cy.get('p-dropdown[formcontrolname="residentialStatus"]').click();
            cy.get("p-dropdownitem").contains(testData.ResidentialStatus).click();
          }

          //註冊地址
          if (testData.RegAddress != "") {

            cy.get('sigv-address-selector[formcontrolname="registeredAddressContent"]').find('p-dropdown[ng-reflect-placeholder=" State/Territory"]').click();
            cy.get("p-dropdownitem").contains(testData.RegAddress).click();

            // cy.get('p-dropdown[ng-reflect-placeholder=" State/Territory"]').click();


            cy.get('sigv-address-selector[formcontrolname="registeredAddressContent"]').find('p-dropdown[ng-reflect-placeholder=" City"]').click();
            cy.get("p-dropdownitem").first().click();

            cy.get('sigv-address-selector[formcontrolname="registeredAddressContent"]').find('p-dropdown[ng-reflect-placeholder=" Postcode"]').click();
            cy.get("p-dropdownitem").first().click();

            if (testData.HouseNumber != "") {
              cy.get('sigv-address-selector[formcontrolname="registeredAddressContent"]').find('input[placeholder=" Unit/House Number, Street Name, Apartment, Suite"]').type("{selectall}" + testData.HouseNumber);
            }

            cy.get('span').contains('Reg. Add').click();
          }

          //電話
          if (testData.PhoneNo != "" && ProductName != "HP for PC-Used") {
            cy.get('app-customer-information').find('input[formcontrolname="telephone"]').type("{selectall}" + testData.PhoneNo, { force: true });
            cy._waitForLoading();
            cy.AlertWindow();
          }
          //行動電話1
          if (testData.MobilePhoneNo1 != "") {
            cy.get('app-customer-information').find('input[formcontrolname="mobilePhone1"]').type("{selectall}" + testData.MobilePhoneNo1, { force: true });
            cy._waitForLoading();
            cy.AlertWindow();
          }

          //行動電話2
          if (testData.MobilePhoneNo2 != "") {
            cy.get('app-customer-information').find('input[formcontrolname="mobilePhone2"]').type("{selectall}" + testData.MobilePhoneNo2, { force: true });
            cy._waitForLoading();
            cy.AlertWindow();
          }

        }
        else {
          cy.get('p-dropdown[formcontrolname="identityType"]').click();
          cy.get("p-dropdownitem").contains(testData.IdentityType).click();
          cy._waitForLoading();
          cy.AlertWindow();

          //Identification Type
          if (testData.IdentificationType != "" && ProductName != "HP for PC-Used") {
            cy.get('p-dropdown[formcontrolname="identificationType"]').click();
            cy.get("p-dropdownitem").contains(testData.IdentificationType).click();
          }


          //IdNo
          if (testData.IDNo != "") {
            cy.get('app-customer-information').find('input[formcontrolname="idNo"]').type("{selectall}" + testData.IdNo);
            cy._waitForLoading();
            cy.AlertWindow();
          }

          //顧客姓名
          if (testData.CustomerName != "") {
            cy.get('app-customer-information').find('input[formcontrolname="customerName"]').type("{selectall}" + testData.CustomerName, { force: true });
            cy._waitForLoading();
            cy.AlertWindow();
          }

          //修改Date Of Incorporation
          if (testData.DateOfIncorporation != "") {
            cy.get('app-customer-information').then(($information) => {

              if ($information.find('p-calendar[formcontrolname="dateofIncorporation"]').length > 0) {
                cy.wrap($information).find('input[placeholder="dd/MM/yyyy"]').type("{selectall}" + testData.DateOfIncorporation, { force: true });
                cy._waitForLoading();
                cy.AlertWindow();
              }
            })
          }

          cy.get('.p-grid.mb-20 > .p-col-12 > .p-field-label > label').click();

          cy._waitForLoading();
          cy.AlertWindow();
          //選擇設立於東馬
          if (testData.RegisteredEastMalaysia == "Yes") {
            cy.get('[type="radio"]').check('true', { force: true });
          }
          else {
            cy.get('[type="radio"]').check('false', { force: true });
          }

          cy._waitForLoading();
          cy.AlertWindow();
          //註冊地址
          if (testData.RegCompanyAddress != "") {

            cy.get('sigv-address-selector[formcontrolname="registeredAddressContent"]').find('p-dropdown[ng-reflect-placeholder=" State/Territory"]').click();
            cy.get("p-dropdownitem").contains(testData.RegCompanyAddress).click();
            // cy.get('p-dropdown[ng-reflect-placeholder=" State/Territory"]').click();
            cy.get('sigv-address-selector[formcontrolname="registeredAddressContent"]').find('p-dropdown[ng-reflect-placeholder=" City"]').click();
            cy.get("p-dropdownitem").first().click();

            cy.get('sigv-address-selector[formcontrolname="registeredAddressContent"]').find('p-dropdown[ng-reflect-placeholder=" Postcode"]').click();
            cy.get("p-dropdownitem").first().click();

            if (testData.CustomerNumbr != "") {
              cy.get('sigv-address-selector[formcontrolname="registeredAddressContent"]').find('input[placeholder=" Unit/House Number, Street Name, Apartment, Suite"]').type("{selectall}" + testData.CustomerNumbr);
            }
            cy.get('span').contains('Reg. Add').click();
          }

          //公司註冊電話
          if (testData.RegCompanyPhoneNo != "") {
            cy.get('app-customer-information').find('input[formcontrolname="regCompanyPhoneNo"]').type("{selectall}" + testData.RegCompanyPhoneNo, { force: true });
            cy._waitForLoading();
            cy.AlertWindow();
          }

          //公司連絡電話
          if (testData.RegCompanyContactPhoneNo != "") {
            cy.get('app-customer-information').find('input[formcontrolname="regCompanyContactPhoneNo"]').type("{selectall}" + testData.RegCompanyContactPhoneNo, { force: true });
            cy._waitForLoading();
            cy.AlertWindow();
          }
        }
        //Submit
        // cy.get("a").contains("Submit").click({force:true});
        cy.get('div.cfc-common-bottom-panel-wrapper').contains('a', StringText.Submit).click();
        cy._waitForLoading();

      }
      // } else {
      //   cy.log('此案件目前無需做退補件!');
      // }

    })
  }

 //搜尋剛剛進件案件
 cy.get('p-sidebar[styleclass="ice-pop-layout-sidebar desktop"]').contains(StringText.Search).prev().click();
 cy._waitForLoading();
 cy.get('app-index').contains('label', StringText.CaseNo).parent().next().type(testData.caseNo);
 cy.get('app-index').contains('a', StringText.Search).click();
 cy._waitForLoading();

 //增加Filter Field，顯示全部欄位
 cy.get('app-index').find('button[ng-reflect-label="Filter Field"]').click();
 cy.get('p-multiselectitem[ng-reflect-label="Search.Common.All"]').then(function ($item) {
   if ($item.find('span.pi-check').length <= 0) {
     cy.wrap($item).click();
   }
 })
 cy.get('app-index').find('button[ng-reflect-label="Filter Field"]').click();//關閉顯示

 //降冪排序
 cy._sortColumnDesc(StringText.CaseNo);

 //取得下一關名稱和處理人員
 var returnDic = {};

 cy.get("p-table").contains("th", StringText.WorkflowStage).invoke('index').then((index) => {
   cy.get("tbody").find("tr").eq(0).find("td").eq(index).then((stageName) => {
     returnDic[DicKeyText.CurrentStage] = stageName.text().trim();
     cy.log('下一關：' + stageName.text())
   })

 })

 cy.get("p-table").contains("th", StringText.Processor).invoke('index').then((index) => {
   cy.get("tbody").find("tr").eq(0).find("td").eq(index).then((processor) => {
     returnDic[DicKeyText.LoginUser] = processor.text().trim().split(' ')[0];
     cy.log('處理人：' + processor.text())
   })

 })
 return cy.wrap(returnDic);

})

});



//點掉畫面上的提示訊息視窗
Cypress.Commands.add("AlertWindow", () => {
  cy.get('body').then(($body) => {
    if ($body.find("sigv-error-dialog").length > 0) {
      cy.get("span").contains("OK", { timeout: 5000 }).click({ force: true });
    }
  })
})